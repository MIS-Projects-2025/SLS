<?php

namespace App\Http\Controllers\PositiveLogsheet;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PositiveChecklistController extends Controller
{

    protected $datatable;
    protected $datatable1;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }
    public function index(Request $request)
    {

        $PositivechecklistItems = DB::connection('mysql')->table('positive_checklist_items')->get()->toArray();

        return Inertia::render('PositiveLogsheet/PositiveChecklist', [
            'PositivechecklistItemses' => $PositivechecklistItems,
        ]);
    }

    public function store(Request $request)
    {
        // Validate incoming data (basic validation)
        $request->validate([
            'machine_type'   => 'required|string|max:45',
            'machine_model'  => 'required|string|max:45',
            'machine_num'    => 'required|string|max:45',
            'ww'             => 'required|string|max:45',
            'date'           => 'required|string|max:45',
            'shift_time'     => 'required|string|max:45',
            'package_type'   => 'nullable|string|max:45',
            'lot_id'         => 'nullable|string|max:45',
            'process_type'   => 'nullable|string|max:45',
            'customer_name'  => 'nullable|string|max:45',
            'badge'          => 'nullable|string|max:45',
            'fill_type'      => 'nullable|string|max:45',
            'mark_type'      => 'nullable|string|max:45',
            'remarks'        => 'nullable|string',
            'answers'        => 'required|string',
        ]);

        try {
            // Generate a unique setup_log_id
            $setupLogId = Str::uuid()->toString();

            DB::connection('mysql')->table('positive_losheet_tbl')->insert([
                'setup_log_id'   => $setupLogId,
                'machine_type'   => $request->machine_type,
                'machine_model'  => $request->machine_model,
                'machine_num'    => $request->machine_num,
                'ww'             => $request->ww,
                'date'           => $request->date,
                'shift_time'     => $request->shift_time,
                'package_type'   => $request->package_type,
                'lot_id'         => $request->lot_id,
                'process_type'   => $request->process_type,
                'customer_name'  => $request->customer_name,
                'badge'          => $request->badge,
                'fill_type'      => $request->fill_type,
                'mark_type'      => $request->mark_type,
                'remarks'        => $request->remarks,
                'answers'        => $request->answers,
            ]);

            DB::connection('mysql')->table('setup_losheet_tbl')
                ->where('machine_type', ($request->machine_type))
                ->where('machine_model', ($request->machine_model))
                ->where('machine_num', ($request->machine_num))
                ->where('ww', ($request->ww))
                ->where('date', ($request->date))
                ->where('shift_time', ($request->shift_time))
                ->where('package_type', ($request->package_type))
                ->where('lot_id', ($request->lot_id))
                ->where('process_type', ($request->process_type))
                ->where('customer_name', ($request->customer_name))
                ->where('badge', ($request->badge))
                ->update([
                    'setup_log_id' => $setupLogId
                ]);

            return redirect()
                ->route('setup-new.checklist.index')
                ->with('success', 'Checklist saved successfully!');
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to save checklist: ' . $e->getMessage(),
            ], 500);
        }
    }
}
