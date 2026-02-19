<?php

namespace App\Http\Controllers\SetupLogsheet;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SetupChecklistItemController extends Controller
{
    protected $datatable;
    protected $datatable1;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }


    public function index(Request $request)
    {


        $machineType = DB::connection('mysql')->table('machine_list')
            ->select('machine_type', 'machine_platform')
            ->whereNotNull('machine_type')
            ->whereNotIn('machine_num', ['N/A', ''])
            ->whereNotIn('machine_type', ['N/A', '', 'NON T&R', 'granite', 'air ionizer', 'microscope'])
            ->whereNotIn('machine_platform', ['N/A', ''])
            ->orderBy('machine_type', 'asc')
            ->get();

        $machinePlatform = DB::connection('mysql')->table('machine_list')
            ->select('machine_type', 'machine_platform')
            ->whereNotNull('machine_type')
            ->whereNotIn('machine_num', ['N/A', ''])
            ->whereNotIn('machine_type', ['N/A', '', 'NON T&R', 'granite', 'air ionizer', 'microscope'])
            ->whereNotIn('machine_platform', ['N/A', '19at28', '19at128', '14at128'])
            ->orderBy('machine_platform', 'asc')
            ->get();


        $checklistItems = DB::connection('mysql')
            ->table('setup_checklist_items')
            ->whereNotNull('machine_type')
            ->whereNotNull('machine_model')
            ->whereNotIn('machine_type', ['N/A', ''])
            ->whereNotIn('machine_model', ['N/A', ''])
            ->get();

        $result = $this->datatable->handle(
            $request,
            'mysql',
            'setup_checklist_items',
            [
                'conditions' => function ($query) {
                    return $query
                        ->select('machine_type', 'machine_model')
                        ->whereNotNull('machine_type')
                        ->whereNotNull('machine_model')
                        ->whereNotIn('machine_type', ['N/A', ''])
                        ->whereNotIn('machine_model', ['N/A', ''])
                        ->groupBy('machine_type', 'machine_model');
                },

                'searchColumns' => ['machine_type', 'machine_model'],
            ]
        );



        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        return Inertia::render('SetupLogsheet/SetupChecklistItems', [
            'tableData' => $result['data'],
            'checklistItems' => $checklistItems,
            'machineType' => $machineType,
            'machinePlatform' => $machinePlatform,
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
        $items = array_map(function ($item) {
            $item['created_by'] = session('emp_data')['emp_name'] ?? null;
            return $item;
        }, $request->items);

        DB::connection('mysql')->table('setup_checklist_items')->insert($items);

        return redirect()->back()->with('success', 'Checklist items saved!');
    }

    public function update(Request $request, $id)
    {
        $affected = DB::connection('mysql')
            ->table('setup_checklist_items')
            ->where('id', $id)
            ->update(array_merge(
                $request->only([
                    'item_check',
                    'frequency',
                    'responsible',
                    'fill_type',
                    'tolerance'
                ]),
                ['updated_by' => session('emp_data')['emp_name'] ?? null]
            ));

        if ($affected) {
            return redirect()->back()->with('success', 'Checklist item updated!');
        }


        return redirect()->back()->with('error', 'Checklist item not found.');
    }

    public function destroy($id)
    {
        $deleted = DB::connection('mysql')
            ->table('setup_checklist_items')
            ->where('id', $id)
            ->delete();

        if ($deleted) {
            return redirect()->back()->with('success', 'Checklist item deleted!');
        }

        return redirect()->back()->with('error', 'Checklist item not found.');
    }
}
