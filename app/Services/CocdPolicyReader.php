<?php

namespace App\Services;

use Smalot\PdfParser\Parser;

class CocdPolicyReader
{
    public function getPolicyContent(): string
    {
        // Matches the file naming from your reference controller
        $pdfPath = public_path('pdf/cocd.pdf');

        // Fallback check in case the longer name is ever used
        if (!file_exists($pdfPath)) {
            $pdfPath = public_path('pdf/code-of-discipline.pdf');
        }

        if (file_exists($pdfPath)) {
            try {
                $parser  = new Parser();
                $pdf     = $parser->parseFile($pdfPath);
                return $pdf->getText();
            } catch (\Throwable $e) {
                return '';
            }
        }

        return '';
    }
}
