<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    public function ask_ai(Request $request)
    {
        $question = $request->input('query');

        if (!$question) {
            return response()->json(['error' => 'Please provide a question.'], 400);
        }

        // =========================================================
        // STEP 1: Ask AI to translate the question into a SQL query
        // =========================================================

        // Tell the AI exactly how your tables are structured so it knows how to join them.
        $schema = "
        Table `users`: id, name, email, role (1=Admin, 2=Employee)
        Table `account_personal_informations`: user_id, first_name, last_name, date_of_birth, contact, region, province, city, barangay, street, zip_code, year_graduated, degree, school_name, course
        Table `account_employees`: user_id, employee_id, department_id, position, position_level, started_at, e_r_leader_id, eogs_email, basic_pay, status, signature, location_id, site_id
        Table `locations`: id, name
        Table `sites`: id, name

        Relationships: 
        1. users.id = account_personal_informations.user_id 
        2. users.id = account_employees.user_id
        3. account_employees.location_id = locations.id
        4. account_employees.site_id = sites.id

        Note: 'Incomplete', 'Missing', or 'No' data means the column is NULL or an empty string ('').
        ";

        $sqlPrompt = "You are a strict, read-only MySQL assistant for an HR system. Given the following database schema, write a SQL SELECT query that answers the user's question. \n\n" .
            "RULES: \n" .
            "1. Return ONLY the raw SQL query. Do not wrap it in ```sql backticks.\n" .
            "2. Do not include any explanations.\n" .
            "3. Use LEFT JOINs so you don't miss users who lack records in the related tables.\n\n" .
            "Schema:\n" . $schema;

        try {
            $sqlResponse = Http::withToken(env('OPENAI_API_KEY'))
                ->timeout(120)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o-mini',
                    'messages' => [
                        ['role' => 'system', 'content' => $sqlPrompt],
                        ['role' => 'user', 'content' => $question]
                    ],
                    'temperature' => 0, // 0 makes the AI highly precise and deterministic for code
                ]);

            // Clean up the string just in case the AI added formatting
            $sqlQuery = trim($sqlResponse->json('choices.0.message.content'));
            $sqlQuery = str_replace(['```sql', '```'], '', $sqlQuery);
            $sqlQuery = trim($sqlQuery);

            // SECURITY CHECK: Ensure it is ONLY a SELECT statement (Prevents DROP, DELETE, UPDATE)
            if (stripos($sqlQuery, 'SELECT') !== 0) {
                return response()->json(['reply' => 'I cannot process this type of request for security reasons.']);
            }

            // =========================================================
            // STEP 2: Execute the Query on your Database
            // =========================================================
            $dbResults = DB::select($sqlQuery);

            // =========================================================
            // STEP 3: Ask AI to format the raw database data into a nice reply
            // =========================================================

            $formatPrompt = "You are a helpful company HR assistant. The user asked a question, and the database returned the following JSON data. " .
                "Formulate a polite, natural-sounding answer using ONLY this data. If the data is empty, politely tell them no matching records were found.\n\n" .
                "User Question: " . $question . "\n" .
                "Database Results: " . json_encode($dbResults);

            $finalResponse = Http::withToken(env('OPENAI_API_KEY'))
                ->timeout(120)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o-mini',
                    'messages' => [
                        ['role' => 'system', 'content' => $formatPrompt]
                    ],
                    'temperature' => 0.4,
                ]);

            $aiReply = $finalResponse->json('choices.0.message.content');

            return response()->json([
                'reply' => $aiReply,
                // 'debug_sql' => $sqlQuery // Uncomment this if you want to see what SQL the AI wrote in your Network tab
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
