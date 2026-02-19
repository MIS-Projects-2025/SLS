<?php

namespace App\Http\Controllers\SetupLogsheet;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SetupChecklistController extends Controller
{

    protected $datatable;
    protected $datatable1;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }
    public function index(Request $request)
    {

        // $machine_type = DB::connection('mysql')->table('machine_list')
        //     ->select('machine_num', 'machine_type', 'machine_platform')
        //     ->whereNotNull('machine_type')
        //     ->whereNotIn('machine_num', ['N/A', ''])
        //     ->whereNotIn('machine_type', ['N/A', '', 'NON T&R', 'granite', 'air ionizer', 'microscope'])
        //     ->whereNotIn('machine_platform', ['N/A', ''])
        //     ->orderBy('machine_type', 'asc')
        //     ->get();

        // $machinePlatform = DB::connection('mysql')->table('machine_list')
        //     ->select('machine_num', 'machine_type', 'machine_platform')
        //     ->whereNotNull('machine_type')
        //     ->whereNotIn('machine_num', ['N/A', ''])
        //     ->whereNotIn('machine_type', ['N/A', '', 'NON T&R', 'granite', 'air ionizer', 'microscope'])
        //     ->whereNotIn('machine_platform', ['N/A', '19at28', '19at128', '14at128'])
        //     ->orderBy('machine_platform', 'asc')
        //     ->get();

        $machine_type = DB::connection('mysql')->table('setup_checklist_items')
            ->select('machine_type', 'machine_model')
            ->whereNotNull('machine_type')
            ->orderBy('machine_type', 'asc')
            ->get();

        $machinePlatform = DB::connection('mysql')->table('setup_checklist_items')
            ->select('machine_type', 'machine_model')
            ->whereNotNull('machine_type')
            ->orderBy('machine_type', 'asc')
            ->get();

        $machineList = DB::connection('server25')->table('machine_list')
            ->where('machine_num', '!=', 'N/A')
            ->where('machine_platform', '!=', 'N/A')
            ->whereNotNull('machine_num')
            ->whereIn('status', ['ACTIVE', 'Active', 'active'])
            ->get();

        $checklistItems = DB::connection('mysql')->table('setup_checklist_items')
            ->get();

        $packageType = DB::connection('server25')->table('package_list')
            ->select('lead_count', 'package_type')
            ->whereNotNull('package_type')
            ->whereNotIn('package_type', ['N/A', ''])
            ->whereNotNull('lead_count')
            ->whereNotIn('lead_count', ['N/A', ''])
            ->groupBy('package_type', 'lead_count')
            ->orderBy('package_type', 'asc')
            ->get();

        $customerList = DB::connection('server25')->table('customer_list')
            ->where('customer_name', '!=', 'N/A')
            ->whereNotNull('customer_name')
            ->orderBy('customer_name', 'asc')
            ->get();


        $result = $this->datatable->handle(
            $request,
            'mysql',
            'setup_losheet_tbl',
            [
                'conditions' => function ($query) {
                    return $query
                        ->orderBy('date', 'desc');
                },

                'searchColumns' => ['machine_num', 'ww', 'date', 'shift_time', 'package_type', 'lot_id', 'process_type', 'customer_name', 'badge', 'fill_type'],
            ]
        );



        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        $setupLogsheet = DB::connection('mysql')->table('setup_losheet_tbl')->get();

        $positiveLogsheet = DB::connection('mysql')->table('positive_losheet_tbl')->get();

        $empId = session('emp_data')['emp_id'];

        $stampNo = DB::connection('server25stamp')
            ->table('stamp_list')
            ->where('employee_id', $empId)
            ->value('stamp_no');

        // dd($stampNo);



        return Inertia::render('SetupLogsheet/SetupChecklist', [
            'tableData' => $result['data'],
            'machineList' => $machineList,
            'machine_type' => $machine_type,
            'machinePlatform' => $machinePlatform,
            'checklistItems' => $checklistItems,
            'packageType' => $packageType,
            'customerList' => $customerList,
            'positiveLogsheet' => $positiveLogsheet,
            'setupLogsheet' => $setupLogsheet,
            'stampNo' => $stampNo,
            'tableFilters' => $request->only([
                'search',
                'perPage',
                'sortBy',
                'sortDirection',
                'start',
                'end',
                'dropdownSearchValue',
                'dropdownFields',
            ]),
        ]);
    }

    public function positive($setup_log_id)
    {
        $positiveItems = DB::connection('mysql')->table('positive_losheet_tbl')
            ->where('setup_log_id', $setup_log_id)
            ->get();

        return response()->json($positiveItems);
    }

    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'machine_type' => 'required|string|max:45',
    //         'machine_model' => 'required|string|max:45',
    //         'machine_num' => 'required|string|max:45',
    //         'ww' => 'required|string|max:45',
    //         'date' => 'required|string|max:45',
    //         'shift_time' => 'required|string|max:45',
    //         'package_type' => 'required|string|max:45',
    //         'lot_id' => 'required|string|max:45',
    //         'process_type' => 'required|string|max:45',
    //         'customer_name' => 'required|string|max:45',
    //         'badge' => 'required|string|max:45',
    //         'remarks' => 'nullable|string',
    //         'fill_type' => 'required|string|max:45',
    //         'mark_type' => 'nullable|string|max:45',
    //         'answers' => 'required|string',

    //     ]);

    //     $setupId = DB::connection('mysql')->table('setup_losheet_tbl')->insertGetId($validated);

    //     // Retrieve saved data to pass to Inertia
    //     $setupData = DB::connection('mysql')->table('setup_losheet_tbl')->where('id', $setupId)->first();

    //     $positiveChecklistItems = DB::connection('mysql')->table('positive_checklist_items')
    //         ->where('machine_type', $validated['machine_type'])
    //         ->where('machine_model', $validated['machine_model'])
    //         ->get();

    //     return Inertia::render('PositiveLogsheet/PositiveChecklist', [
    //         'setupData' => $setupData, // ✅ important!
    //         'setupId' => $setupId,
    //         'positiveChecklistItems' => $positiveChecklistItems,
    //     ]);
    // }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'machine_type' => 'required|string|max:45',
            'machine_model' => 'required|string|max:45',
            'machine_num' => 'required|string|max:45',
            'ww' => 'required|string|max:45',
            'date' => 'required|string|max:45',
            'shift_time' => 'required|string|max:45',
            'package_type' => 'required|string|max:45',
            'lot_id' => 'required|string|max:45',
            'process_type' => 'required|string|max:45',
            'customer_name' => 'required|string|max:45',
            'badge' => 'required|string|max:45',
            'remarks' => 'nullable|string',
            'fill_type' => 'required|string|max:45',
            'mark_type' => 'nullable|string|max:45',
            'answers' => 'required|string',
        ]);

        // ✅ CHECK IF EXISTING (only for Start of Shift)
        if (strtolower($validated['fill_type']) === 'start of shift') {
            // Get today's date in mm/dd/yyyy format
            $today = Carbon::today()->format('m/d/Y');

            // Only check if the submitted date is today
            if ($validated['date'] === $today) {
                $existing = DB::connection('mysql')
                    ->table('setup_losheet_tbl')
                    ->where('machine_type', $validated['machine_type'])
                    ->where('machine_model', $validated['machine_model'])
                    ->where('machine_num', $validated['machine_num'])
                    ->where('ww', $validated['ww'])
                    ->where('date', $validated['date'])
                    ->where('fill_type', 'Start of Shift')
                    ->first();

                if ($existing) {
                    return back()->withErrors([
                        'duplicate' => '⚠️ This has already been filled out by: '
                            . $existing->badge .
                            ' on ' . $existing->date .
                            ' at ' . $existing->shift_time
                    ]);
                }
            }
        }


        // ✅ SAVE DATA
        $setupId = DB::connection('mysql')
            ->table('setup_losheet_tbl')
            ->insertGetId([
                ...$validated,
            ]);

        $setupData = DB::connection('mysql')
            ->table('setup_losheet_tbl')
            ->where('id', $setupId)
            ->first();

        $positiveChecklistItems = DB::connection('mysql')
            ->table('positive_checklist_items')
            ->where('machine_type', $validated['machine_type'])
            ->where('machine_model', $validated['machine_model'])
            ->get();

        return Inertia::render('PositiveLogsheet/PositiveChecklist', [
            'setupData' => $setupData,
            'setupId' => $setupId,
            'positiveChecklistItems' => $positiveChecklistItems,
        ]);
    }




    public function show($id)
    {
        $setup = DB::connection('mysql')->table('setup_losheet_tbl')->find($id);

        if (!$setup) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        return response()->json($setup);
    }

    public function verify($setup_log_id)
    {
        $empId = session('emp_data')['emp_id'];

        $stampNo = DB::connection('server25stamp')
            ->table('stamp_list')
            ->where('employee_id', $empId)
            ->value('stamp_no');

        DB::connection('mysql')
            ->table('setup_losheet_tbl')
            ->where('setup_log_id', $setup_log_id)
            ->update([
                'verify' => $stampNo,
                'date_verify' => Carbon::now(),
            ]);

        return Inertia::render('PositiveLogsheet/PositiveChecklist', [
            'message' => 'Verified successfully'
        ]);
    }
}
