import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import { useState, useEffect } from "react";
import { Select, message} from "antd";
export default function VisionCorelation({ tableData, tableFilters, emp_data, machines, packages }) {

    const today = new Date();
    const todayDate = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(
        today.getDate()
    ).padStart(2, "0")}/${today.getFullYear()}`;

    const currentShift =
    today.getHours() >= 7 && today.getHours() <= 18 ? "A" : "C";

    const { errors } = usePage().props;

    const machineOptions = machines.map((m) => ({
    label: m.machine_num,
    value: m.machine_num,
    }));

    const packageOptions = packages.map((p) => ({
    label: `${p.lead_count}L ${p.package_type}`,
    value: `${p.lead_count}L ${p.package_type}`,
    }));

    const initialForm = {
        machine: "", 
        date: todayDate || "", 
        due_date: "", 
        shift: currentShift || "", 
        package: "", 
        cop_comparator: "", 
        cop_machine: "", 
        cop_offset: "", 
        pit_comparator: "", 
        pit_machine_intrack: "", 
        pit_machine_offset1: "", 
        pit_machine_inpocket: "", 
        pit_machine_offset2: "", 
        pit_machine_otf: "", 
        pit_machine_offset3: "", 
        max_stand_comparator: "", 
        max_stand_machine: "", 
        max_stand_offset: "", 
        min_stand_comparator: "", 
        min_stand_machine: "", 
        min_stand_offset: "", 
        tip_comparator: "", 
        tip_machine_intrack: "", 
        tip_machine_offset1: "", 
        tip_machine_inpocket: "", 
        tip_machine_offset2: "", 
        remarks: "", 
        performed_by: emp_data?.emp_name,
    };  

    const [page, setPage] = useState(1);
    const totalPages = 4;

    const nextPage = () => page < totalPages && setPage(page + 1);
    const prevPage = () => page > 1 && setPage(page - 1);

        
    const [showDrawer, setShowDrawer] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [processing, setProcessing] = useState(false);

    const [selectedSetup, setSelectedSetup] = useState(null);
    const [viewDrawer, setViewDrawer] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const [step, setStep] = useState(1);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));



    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

useEffect(() => {
    if (parseInt(form.result_no_reject || 0) > parseInt(form.samp_no_reject || 0)) {
        setForm(prev => ({
            ...prev,
            result_no_reject: parseInt(form.samp_no_reject || 0),
        }));
    }
    if (parseInt(form.result_no_good || 0) > parseInt(form.samp_no_good || 0)) {
        setForm(prev => ({
            ...prev,
            result_no_good: parseInt(form.samp_no_good || 0),
        }));
    }
}, [form.samp_no_reject, form.samp_no_good]);


    const handleSave = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route("vision.corelation.store"), form, {
            preserveScroll: true,
            onSuccess: () => {
                message.success("Data saved successfully!");
                window.location.reload();
                setShowDrawer(false);
                setForm(initialForm);
            },
            onFinish: () => setProcessing(false),
        });
    };

const dataWithAction = tableData.data.map((r) => ({
    ...r,
    verifier: r.verifier ? (
        <div className="text-left w-16 h-16">
            {/* Outer Circle */}
            <div className="w-full h-full rounded-full border-2 border-indigo-800 flex items-center justify-center relative">

                {/* Top Text */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-green-500 font-bold text-xs tracking-widest">
                    {r.result === "Pass" ? "PASSED" : "FAILED"}
                </div>

                {/* Bottom Text */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-indigo-800 font-semibold text-[10px]">
                    TSPI
                </div>

                {/* Center Value */}
                <div className="text-blue-600 font-semibold text-center text-md px-1">
                    {r.verifier}
                </div>
            </div>
        </div>
    ) : null, // ✅ walang lalabas kung walang verifier

    action: (
        <button
            className="px-3 py-2 bg-stone-500 text-white rounded-md hover:bg-stone-600 border border-stone-600"
            onClick={() => {
                setSelectedSetup(r);
                setViewDrawer(true);
            }}
        >
            <i className="fa-solid fa-eye"></i> View
        </button>
    ),
}));


    const handleVerify = () => {
    if (!selectedSetup) return;

    setVerifying(true);

    router.post(
        route("go.vision.verify", selectedSetup.id),
        {},
        {
            onSuccess: () => {
                setViewDrawer(false);
            },
            onFinish: () => setVerifying(false),
        }
    );
};


    return (
        <AuthenticatedLayout>
            <Head title="Vision Corellation Logsheet" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-stone-500">
                    <i className="fa-solid fa-code-compare"></i> Vision Corellation Logsheet
                </h1>

                {["Equipment Engineering"].includes(emp_data?.emp_dept) && !["superadmin", "admin"].includes(emp_data?.emp_role) && (
                    <button
                        onClick={() => setShowDrawer(true)}
                        className="px-4 py-2 text-white bg-stone-500 rounded-md hover:bg-stone-700"
                    >
                        <i className="fa-solid fa-plus"></i> Vision Corellation
                    </button>
                )}
            </div>

            <DataTable
                columns={[
                    { key: "machine", label: "Machine #" },
                    { key: "date", label: "Date" },
                    { key: "due_date", label: "Due Date" },
                    { key: "package", label: "Package" },
                    { key: "performed_by", label: "Performed By" },
                    { key: "action", label: "Action" },
                ]}
                data={dataWithAction}
                meta={{
                    from: tableData.from,
                    to: tableData.to,
                    total: tableData.total,
                    links: tableData.links,
                    currentPage: tableData.current_page,
                    lastPage: tableData.last_page,
                }}
                routeName={route("vision.corelation.index")}
                filters={tableFilters}
                rowKey="id"
                showExport={false}
            />

            {showDrawer && (
  <div className="fixed inset-0 z-50 flex">
    
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black/40"
      onClick={() => setShowDrawer(false)}
    ></div>

    {/* Drawer */}
    <div className="relative ml-auto w-full max-w-3xl h-full bg-white shadow-xl overflow-y-auto animate-slide-in">

      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center bg-gray-100">
        <h2 className="text-lg font-semibold text-stone-700">
          <i className="fas fa-folder-plus mr-2"></i>
          New Vision Correlation Logsheet
        </h2>
        <button
          className="text-red-500 hover:text-red-600"
          onClick={() => setShowDrawer(false)}
        >
          <i className="fa fa-times"></i>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 space-y-6">

        {/* Step Indicator */}
        <div className="flex justify-between text-sm">
          {[1,2,3,4,5].map((s)=>(
            <div
              key={s}
              className={`flex-1 text-center py-2 mx-1 rounded-md ${
                step === s
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
            </div>
          ))}
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-4">

            <h3 className="text-indigo-600 font-semibold">
              <i className="fa-solid fa-cogs"></i> Machine Information
            </h3>

            <div className="grid grid-cols-2 gap-4">

            <div>
                <label className="block text-sm font-medium text-gray-600">
                     Machine
                </label>
            <Select
                showSearch
                placeholder="Select Machine..."
                options={machineOptions} 
                name="machine"
                value={form.machine}
                onChange={(value) =>
                    setForm((prev) => ({ ...prev, machine: value }))
                 }
                className="w-full border-gray-500 rounded-md p-2"
                required
            />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600">
                     Shift
                </label>
             <input
                type="text"
                name="shift"
                className="w-full border p-2 rounded-md bg-gray-100"
                value={form.shift}
                readOnly
            />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600">
                     Performed By
                </label>
            <input
                type="text"
                name="performed_by"
                className="w-full border p-2 rounded-md bg-gray-100"
                value={form.performed_by}
                readOnly
            />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600">
                     Package
                </label>
              <Select
                showSearch
                options={packageOptions} 
                name="package"
                value={form.package}
                onChange={(value) =>
                    setForm((prev) => ({ ...prev, package: value }))
                }
                className="w-full border-gray-500 rounded-md p-2"
                required
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-600">
                     Date
                </label>
              <input
                type="text"
                name="date"
                className="w-full border p-2 rounded-md bg-gray-100"
                value={form.date}
                readOnly
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600">
                     Due Date
                </label>
              <input
                type="date"
                name="due_date"
                className="w-full border p-2 rounded-md"
                value={form.due_date}
                onChange={handleChange}
                required
              />
            </div>
             
            

            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-4">

            <h3 className="text-indigo-600 font-semibold">
              <i className="fa-solid fa-cogs"></i> Coplanarity (mils)
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <input type="text" name="cop_comparator" placeholder="Comparator" className="border p-2 rounded-md" onChange={handleChange} required />
              <input type="text" name="cop_machine" placeholder="Machine" className="border p-2 rounded-md" onChange={handleChange} required />
              <input type="text" name="cop_offset" placeholder="Offset (+/-0.5)" className="border p-2 rounded-md" onChange={handleChange} required />
            </div>

            <h3 className="text-indigo-600 font-semibold">
              <i className="fa-solid fa-cogs"></i> Pitch (mils)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="pit_comparator" placeholder="Comparator" className="border p-2 rounded-md col-span-2" onChange={handleChange} required />
            </div>

             <h3 className="text-indigo-600 font-semibold">
              <i className="fa-solid fa-cogs"></i> Machine
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="pit_machine_intrack" placeholder="In-track 3D / LIS" className="border p-2 rounded-md" onChange={handleChange} required />
              <input type="text" name="pit_machine_offset1" placeholder="Offset Value (+/-0.5 mils)" className="border p-2 rounded-md" onChange={handleChange} required />
              <input type="text" name="pit_machine_inpocket" placeholder="In-pocket" className="border p-2 rounded-md" onChange={handleChange} required />
              <input type="text" name="pit_machine_offset2" placeholder="Offset Value (+/-0.5 mils)" className="border p-2 rounded-md" onChange={handleChange} required />
              <input type="text" name="pit_machine_otf" placeholder="OTF / Sided" className="border p-2 rounded-md" onChange={handleChange} required />
              <input type="text" name="pit_machine_offset3" placeholder="Offset Value (+/-0.5 mils)" className="border p-2 rounded-md" onChange={handleChange} required />
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="bg-stone-500 text-white px-4 py-2 rounded-md">
                ← Back
              </button>
              <button type="button" onClick={nextStep} className="bg-indigo-600 text-white px-4 py-2 rounded-md">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="space-y-4">

            <h3 className="text-indigo-600 font-semibold">
              <i className="fa-solid fa-cogs"></i> Maximum Standoff (mils)
            </h3>

            <input type="text" name="max_stand_comparator" placeholder="Comparator" className="border p-2 rounded-md w-full" onChange={handleChange} required />
            <input type="text" name="max_stand_machine" placeholder="Machine" className="border p-2 rounded-md w-full" onChange={handleChange} required />
            <input type="text" name="max_stand_offset" placeholder="Offset Value (+/-0.5 mils)" className="border p-2 rounded-md w-full" onChange={handleChange} required />

            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="bg-stone-500 text-white px-4 py-2 rounded-md">
                ← Back
              </button>
              <button type="button" onClick={nextStep} className="bg-indigo-600 text-white px-4 py-2 rounded-md">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <div className="space-y-4">

            <h3 className="text-indigo-600 font-semibold">
              <i className="fa-solid fa-cogs"></i> Minimum Standoff (mils)
            </h3>

            <input type="text" name="min_stand_comparator" placeholder="Comparator" className="border p-2 rounded-md w-full" onChange={handleChange} required />
            <input type="text" name="min_stand_machine" placeholder="Machine" className="border p-2 rounded-md w-full" onChange={handleChange} required />
            <input type="text" name="min_stand_offset" placeholder="Offset Value (+/-0.5 mils)" className="border p-2 rounded-md w-full" onChange={handleChange} required />

            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="bg-stone-500 text-white px-4 py-2 rounded-md">
                ← Back
              </button>
              <button type="button" onClick={nextStep} className="bg-indigo-600 text-white px-4 py-2 rounded-md">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5 ================= */}
        {step === 5 && (
          <div className="space-y-4">

            <h3 className="text-indigo-600 font-semibold">
              <i className="fa-solid fa-cogs"></i> Tip to Tip (mils)
            </h3>

            <input type="text" name="tip_comparator" placeholder="Comparator" className="border p-2 rounded-md w-full" onChange={handleChange} required />

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="tip_machine_intrack" placeholder="In-track 2D / Top Mark" className="border p-2 rounded-md" onChange={handleChange} required />
              <input type="text" name="tip_machine_offset1" placeholder="Offset Value (+/-0.5 mils)" className="border p-2 rounded-md" onChange={handleChange} required />
              <input type="text" name="tip_machine_inpocket" placeholder="In-pocket" className="border p-2 rounded-md" onChange={handleChange} required />
              <input type="text" name="tip_machine_offset2" placeholder="Offset Value (+/-0.5 mils)" className="border p-2 rounded-md" onChange={handleChange} required />
            </div>

            <textarea
              name="remarks"
              placeholder="Remarks"
              className="border p-2 rounded-md w-full"
              rows="3"
              value={form.remarks}
              onChange={handleChange}
            />

            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="bg-stone-500 text-white px-4 py-2 rounded-md">
                ← Back
              </button>
              <button
                type="submit"
                disabled={processing}
                className={`px-4 py-2 rounded-md text-white ${
                  processing
                    ? "bg-green-400"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                {processing ? (
                                     "Saving..."
                                         ) : (
                                            <>
                                                <i className="fas fa-paper-plane "></i> Submit
                                            </>
                                        )}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  </div>
)}


{viewDrawer && selectedSetup && (
  <div className="fixed inset-0 z-50 flex">

    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black/40"
      onClick={() => setViewDrawer(false)}
    />

    {/* Book Drawer */}
    <div className="relative ml-auto w-full max-w-xl h-full bg-white shadow-2xl flex flex-col">

      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-indigo-600">
            Vision Corelation Details
          </h2>
          <p className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </p>
        </div>
        <button
          className="text-red-500"
          onClick={() => setViewDrawer(false)}
        >
          <i className="fa fa-times"></i>
        </button>
      </div>

      {/* Book Page Content */}
      <div
        key={page}
        className="flex-1 px-8 py-8 text-sm transition-all duration-300 ease-in-out"
      >

        {/* ================= PAGE 1 ================= */}
        {page === 1 && (
          <div className="space-y-6">
            <h3 className="text-indigo-600 font-semibold text-base">
              <i className="fa-solid fa-cogs"></i> Machine Information
            </h3>


            <div className="grid grid-cols-1 gap-4">
                <div>
              <label className="block text-gray-500">Machine</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.machine}
              </div>
            </div>

            <div>
              <label className="block text-gray-500">Shift</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.shift}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-500">Package</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.package}
              </div>
            </div>

            <div>
              <label className="block text-gray-500">Performed By</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.performed_by}
              </div>
            </div>

            <div>
              <label className="block text-gray-500">Date</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.date}
              </div>
            </div>

            <div>
              <label className="block text-gray-500">Due Date</label>
                <div className="font-semibold text-stone-700">
                    {selectedSetup.due_date
                    ? new Date(selectedSetup.due_date).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                    })
                        : "-"}
                </div>

            </div>
            </div>
            
          </div>
        )}

        {/* ================= PAGE 2 ================= */}
        {page === 2 && (
          <div className="space-y-6">
            <h3 className="text-indigo-600 font-semibold text-base">
              <i className="fa-solid fa-cogs"></i> Coplanarity (mils)
            </h3>

            <div className="grid grid-cols-1 gap-4">
                <div>
              <label className="block text-gray-500">Comparator</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.cop_comparator}
              </div>
            </div>

            <div>
              <label className="block text-gray-500">Machine</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.cop_machine}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-500">Offset Value (+/-0.5 mils)</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.cop_offset}
              </div>
            </div>
            </div>

            <h3 className="text-indigo-600 font-semibold text-base">
              <i className="fa-solid fa-cogs"></i> Pitch (mils)
            </h3>

            <div className="grid grid-cols-1 gap-4">
                <div>
              <label className="block text-gray-500">Comparator</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.pit_comparator}
              </div>
            </div>
            </div>
            <h3 className="text-indigo-600 font-semibold text-base">
              <i className="fa-solid fa-cogs"></i> Machine
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
              <label className="block text-gray-500">In-track 3D / LIS</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.pit_machine_intrack}
              </div>
            </div>

            <div>
              <label className="block text-gray-500">Offset Value (+/-0.5 mils)</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.pit_machine_offset1}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-500">In-pocket</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.pit_machine_inpocket}
              </div>
            </div>
            <div>
              <label className="block text-gray-500">Offset Value (+/-0.5 mils)</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.pit_machine_offset2 }
              </div>
            </div>

            <div>
              <label className="block text-gray-500">OTF / Sided</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.pit_machine_otf}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-500">Offset Value (+/-0.5 mils)</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.pit_machine_offset3}
              </div>
            </div>
            </div>
          </div>
          
        )}

        {/* ================= PAGE 3 ================= */}
        {page === 3 && (
          <div className="space-y-6">
            <h3 className="text-indigo-600 font-semibold text-base">
             <i className="fa-solid fa-cogs"></i> Maximum Standoff (mils)
            </h3>

            <div className="grid grid-cols-1 gap-4">
                <div>
              <label className="block text-gray-500">Comparator</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.max_stand_comparator}
              </div>
            </div>

            <div>
              <label className="block text-gray-500">Machine</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.max_stand_machine}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-500">Offset Value (+/-0.5 mils)</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.max_stand_offset}
              </div>
            </div>
            </div>
             <h3 className="text-indigo-600 font-semibold text-base">
             <i className="fa-solid fa-cogs"></i> Minimum Standoff (mils)
            </h3>

            <div className="grid grid-cols-1 gap-4">
                <div>
              <label className="block text-gray-500">Comparator</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.min_stand_comparator}
              </div>
            </div>

            <div>
              <label className="block text-gray-500">Machine</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.min_stand_machine}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-500">Offset Value (+/-0.5 mils)</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.min_stand_offset}
              </div>
            </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 4 ================= */}
        {page === 4 && (
          <div className="space-y-6">

            <h3 className="text-indigo-600 font-semibold text-base">
             <i className="fa-solid fa-cogs"></i> Tip to Tip (mils)
            </h3>

            <div>
              <label className="block text-gray-500">Comparator</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.tip_comparator}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
              <label className="block text-gray-500">In-track 2D/ Top Mark</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.tip_machine_intrack}
              </div>
            </div>

            <div>
              <label className="block text-gray-500">Offset Value (+/-0.5 mils)</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.tip_machine_offset1}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-500">In-pocket</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.tip_machine_inpocket}
              </div>
            </div>

            <div>
              <label className="block text-gray-500">Offset Value (+/-0.5 mils)</label>
              <div className="font-semibold text-stone-700">
                {selectedSetup.tip_machine_offset2}
              </div>
            </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-2">
                Remarks
              </label>
              <div className="h-64 w-full  p-3 rounded-md">
                {selectedSetup.remarks || "—"}
              </div>
            </div>
          </div>
        )}
      </div>

<div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
  {/* Previous Button */}
  {page > 1 ? (
    <button
      onClick={prevPage}
      className="px-4 py-2 text-white bg-stone-500 rounded"
    >
      ← Previous
    </button>
  ) : (
    <div /> 
  )}

  {/* Next Button */}
  {page < totalPages && (
    <button
      onClick={nextPage}
      className="px-4 py-2 bg-indigo-600 text-white rounded"
    >
      Next →
    </button>
  )}
</div>

    </div>
  </div>
)}


        </AuthenticatedLayout>
    );
}
