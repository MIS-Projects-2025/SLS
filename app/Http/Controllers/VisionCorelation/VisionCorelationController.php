<?php

namespace App\Http\Controllers\VisionCorelation;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VisionCorelationController extends Controller
{
    protected $datatable;
    protected $datatable1;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }


    public function index(Request $request)
    {
        $result = $this->datatable->handle(
            $request,
            'eeportal',
            'vision_corellation_tbt',
            [
                'conditions' => function ($query) {
                    return $query
                        ->orderBy('date_created', 'desc');
                },

                'searchColumns' => ['machine', 'date', 'due_date', 'package', 'performed_by'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        $machines = DB::connection('server25')->table('machine_list')
            ->select('machine_num', 'machine_type')
            ->where('machine_num', '!=', '')
            ->where('machine_num', '!=', 'N/A')
            ->where('machine_type', '!=', 'N/A')
            ->whereNotIn('machine_type', ['Air Ionizer', 'Granite', 'Microscope', 'NON T&R'])
            ->whereNotNull('machine_type')
            ->distinct()
            ->orderBy('machine_type', 'asc')
            ->get();

        $packages = DB::connection('server25')->table('package_list')
            ->select('package_type', 'lead_count')
            ->distinct()
            ->orderBy('package_type', 'asc')
            ->get();

        return Inertia::render('VisionCorelation/VisionCorelation', [
            'tableData' => $result['data'],
            'machines' => $machines,
            'packages' => $packages,
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'machine' => 'required',
            'date' => 'required|date',
            'due_date' => 'required|date',
            'shift' => 'required',
            'package' => 'required',
            'cop_comparator' => 'required',
            'cop_machine' => 'required',
            'cop_offset' => 'required',
            'pit_comparator' => 'required',
            'pit_machine_intrack' => 'required',
            'pit_machine_offset1' => 'required',
            'pit_machine_inpocket' => 'required',
            'pit_machine_offset2' => 'required',
            'pit_machine_otf' => 'required',
            'pit_machine_offset3' => 'required',
            'max_stand_comparator' => 'required',
            'max_stand_machine' => 'required',
            'max_stand_offset' => 'required',
            'min_stand_comparator' => 'required',
            'min_stand_machine' => 'required',
            'min_stand_offset' => 'required',
            'tip_comparator' => 'required',
            'tip_machine_intrack' => 'required',
            'tip_machine_offset1' => 'required',
            'tip_machine_inpocket' => 'required',
            'tip_machine_offset2' => 'required',
            'remarks' => 'nullable|string',
            'performed_by' => 'required',
        ]);

        DB::connection('eeportal')->table('vision_corellation_tbt')->insert($validated);

        return redirect()->back()->with('success', 'Saved successfully.');
    }
}
