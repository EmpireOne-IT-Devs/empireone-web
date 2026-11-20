<?php

namespace App\Http\Controllers\API\AssetInventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetInventory\AcknowledgeAssetLiabilityForm;
use App\Http\Requests\AssetInventory\ResendAssetLiabilityForm;
use App\Http\Requests\AssetInventory\StorePaperLiabilityForm;
use App\Http\Requests\AssetInventory\VoidAssetLiabilityForm;
use App\Http\Resources\AssetInventory\AssetLiabilityFormResource;
use App\Http\Resources\AssetInventory\PaperLiabilityEmployeeResource;
use App\Models\AssetInventory\AssetLiabilityForm;
use App\Services\AssetLiabilityFormService;
use App\Services\PaperLiabilityFormService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AssetLiabilityFormController extends Controller
{
    public function __construct(private AssetLiabilityFormService $service, private PaperLiabilityFormService $paperForms) {}

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', AssetLiabilityForm::class);
        $filters = $request->validate([
            'page' => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'search' => ['nullable', 'string', 'max:150'],
            'status' => ['nullable', Rule::in(AssetLiabilityForm::STATUSES)],
            'source' => ['nullable', Rule::in(['digital', AssetLiabilityForm::SOURCE_PAPER])],
        ]);
        $query = AssetLiabilityForm::query()
            ->select(['id', 'uuid', 'item_request_id', 'assignee_id', 'employee_name', 'employee_number',
                'asset_tag', 'source', 'status', 'issue_date', 'acknowledged_at', 'paper_signed_date', 'email_sent_at', 'created_at'])
            ->with('itemRequest:id,uuid,item_request_id')->latest('id');
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['source'])) {
            $query->where('source', $filters['source']);
        }
        if (($term = trim($filters['search'] ?? '')) !== '') {
            $query->where(function ($search) use ($term) {
                $search->whereLike('employee_name', "%{$term}%")->orWhereLike('employee_number', "%{$term}%")
                    ->orWhereLike('asset_tag', "%{$term}%")
                    ->orWhereHas('itemRequest', fn ($request) => $request->whereLike('item_request_id', "%{$term}%"));
                if (preg_match('/^LF-([0-9]{1,18})$/i', $term, $matches)) {
                    $search->orWhere('id', (int) $matches[1]);
                }
            });
        }

        return AssetLiabilityFormResource::collection($query->paginate(10)->appends($filters))
            ->response()->header('Cache-Control', 'private, no-store');
    }

    public function show(AssetLiabilityForm $liabilityForm): JsonResponse
    {
        Gate::authorize('view', $liabilityForm);

        return $this->detail($liabilityForm);
    }

    public function paperEmployees(Request $request): JsonResponse
    {
        Gate::authorize('recordPaper', AssetLiabilityForm::class);
        $validated = $request->validate(['search' => ['required', 'string', 'min:2', 'max:150']]);

        return PaperLiabilityEmployeeResource::collection($this->paperForms->employees($validated['search']))
            ->response()->header('Cache-Control', 'private, no-store');
    }

    public function storePaper(StorePaperLiabilityForm $request): JsonResponse
    {
        return $this->detail($this->paperForms->create($request->user(), $request->validated(), $request->file('scan')), 201);
    }

    public function paperScan(AssetLiabilityForm $liabilityForm): StreamedResponse
    {
        Gate::authorize('downloadPaperScan', $liabilityForm);

        return $this->paperForms->download($liabilityForm);
    }

    public function acknowledge(AcknowledgeAssetLiabilityForm $request, AssetLiabilityForm $liabilityForm): JsonResponse
    {
        return $this->detail($this->service->acknowledge($liabilityForm, $request->user(), $request->validated('templateVersion')));
    }

    public function void(VoidAssetLiabilityForm $request, AssetLiabilityForm $liabilityForm): JsonResponse
    {
        return $this->detail($this->service->void($liabilityForm, $request->user(), $request->validated('reason')));
    }

    public function resend(ResendAssetLiabilityForm $request, AssetLiabilityForm $liabilityForm): JsonResponse
    {
        $this->service->resend($liabilityForm);

        return $this->detail($liabilityForm->refresh(), 202);
    }

    private function detail(AssetLiabilityForm $form, int $status = 200): JsonResponse
    {
        return (new AssetLiabilityFormResource($form->load('itemRequest:id,uuid,item_request_id')))
            ->response()->setStatusCode($status)->header('Cache-Control', 'private, no-store');
    }
}
