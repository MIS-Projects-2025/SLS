<?php

namespace App\Http\Controllers\Matrix;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ControlLogMatrixController extends Controller
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
            'server26',
            'tcmatrix_tbl',
            [
                'conditions' => function ($query) {
                    return $query
                        ->orderBy('platform', 'asc');
                },

                'searchColumns' => ['platform', 'category', 'document_title', 'machine_model', 'attach_file_name'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        $machines = DB::connection('server25')->table('machine_list')
            ->select('machine_platform', 'model')
            ->get();
        return Inertia::render('Matrix/ControlLogMatrix', [
            'tableData' => $result['data'],
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
        // dd($request->all());

        $request->validate([
            'platform'        => 'required|string|max:255',
            'category'        => 'required|string|max:255',
            'document_title'  => 'required|string|max:255',
            'machine_model'   => 'required|string|max:255',
            'pdf_file'        => 'required|mimes:pdf|max:20480',
            'pdf_file_name'   => 'required|string|max:255',
        ]);



        $file = $request->file('pdf_file');

        // Slugify the user-entered file name (without extension)
        $cleanFileName = Str::slug(pathinfo($request->pdf_file_name, PATHINFO_FILENAME), '_');

        $counter = 1;
        $originalName = $cleanFileName;

        // Make sure both folder and DB are unique
        while (
            DB::connection('server26')->table('tcmatrix_tbl')->where('attach_file_name', $cleanFileName)->exists() ||
            file_exists(public_path("images/tcmatrix/{$cleanFileName}.pdf"))
        ) {
            $cleanFileName = $originalName . '_' . $counter;
            $counter++;
        }

        $finalFileName = $cleanFileName . '.pdf';

        // Move file to public/images/tcmatrix
        $file->move(public_path('images/tcmatrix'), $finalFileName);

        // Insert into DB
        DB::connection('server26')->table('tcmatrix_tbl')->insert([
            'platform'           => $request->platform,
            'category'           => $request->category,
            'document_title'     => $request->document_title,
            'machine_model'      => $request->machine_model,
            'attach_file_name'   => $cleanFileName,   // WITHOUT extension
            'pdf_file_name'      => $finalFileName,   // WITH extension
        ]);


        return redirect()->back()->with('success', 'Control Log Matrix saved successfully.');
    }

    // Update
    public function update(Request $request, $id)
    {
        $request->validate([
            'platform' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'document_title' => 'required|string|max:255',
            'machine_model' => 'required|string|max:255',
            'pdf_file' => 'nullable|mimes:pdf|max:20480',
            'pdf_file_name' => 'required|string|max:255',
        ]);

        $record = DB::connection('server26')->table('tcmatrix_tbl')->where('id', $id)->first();

        $cleanFileName = Str::slug(pathinfo($request->pdf_file_name, PATHINFO_FILENAME), '_');
        $finalFileName = $record->pdf_file_name; // default: keep old

        // If new file uploaded, delete old file and save new
        if ($request->hasFile('pdf_file')) {
            $file = $request->file('pdf_file');

            // Delete old file
            if (file_exists(public_path("images/tcmatrix/{$record->pdf_file_name}"))) {
                unlink(public_path("images/tcmatrix/{$record->pdf_file_name}"));
            }

            $counter = 1;
            $originalName = $cleanFileName;

            while (file_exists(public_path("images/tcmatrix/{$cleanFileName}.pdf"))) {
                $cleanFileName = $originalName . '_' . $counter;
                $counter++;
            }

            $finalFileName = $cleanFileName . '.pdf';
            $file->move(public_path('images/tcmatrix'), $finalFileName);
        }

        DB::connection('server26')->table('tcmatrix_tbl')->where('id', $id)->update([
            'platform' => $request->platform,
            'category' => $request->category,
            'document_title' => $request->document_title,
            'machine_model' => $request->machine_model,
            'attach_file_name' => $cleanFileName,
            'pdf_file_name' => $finalFileName,
        ]);

        return back()->with('success', 'Record updated successfully!');
    }

    // Delete
    public function destroy($id)
    {
        $record = DB::connection('server26')->table('tcmatrix_tbl')->where('id', $id)->first();

        if ($record) {
            // Delete file from folder
            if (file_exists(public_path("images/tcmatrix/{$record->pdf_file_name}"))) {
                unlink(public_path("images/tcmatrix/{$record->pdf_file_name}"));
            }

            DB::connection('server26')->table('tcmatrix_tbl')->where('id', $id)->delete();
        }

        return back()->with('success', 'Record deleted successfully!');
    }
}
