import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PositiveChecklist from "@/Components/PositiveChecklist";
import { Head, usePage, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import { Steps, Select } from "antd";
import { useState } from "react";
import { Badge } from "lucide-react";
import ViewChecklistModal from "@/Components/ViewChecklistModal";
export default function SetupChecklist({
  tableData,
  tableFilters,
  emp_data,
  machineList,
  machine_type,
  machinePlatform,
  checklistItems = [],
  packageType,
  customerList,
  positiveLogsheet,
  stampNo,
}) {



  const employeeId = emp_data.EMPLOYID;
  const employeeName = emp_data.EMPNAME;
  const employeeJobTitle = emp_data.JOB_TITLE;
  const employeeDepartment = emp_data.DEPARTMENT;
  const qaEmpTampNumber = stampNo;
 





  

    /* =========================
      DATE / SHIFT / WW
  ========================== */
 const getCurrentWorkweek = () => {
  const start = new Date("2024-11-03"); // starting reference
  const today = new Date();

  // total weeks passed since start
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(diffDays / 7);

  // each cycle is 52 weeks
  const cycle = Math.floor(totalWeeks / 52); // 0,1,2,...
  const weekInCycle = (totalWeeks % 52) + 1; // 1..52

  // base number per cycle (601, 701, 801,...)
  const base = 501 + cycle * 100;

  return `WW${base + (weekInCycle - 1)}`; // e.g., 601..652, 701..752, 801..852
};



 const today = new Date();
  const todayDate = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(
    today.getDate()
  ).padStart(2, "0")}/${today.getFullYear()}`;

 const currentShift =
  today.getHours() >= 7 && today.getHours() <= 18 ? "A" : "C";

const currentTime = `${String(today.getHours()).padStart(2, "0")}:${String(
  today.getMinutes()
).padStart(2, "0")}`;

const value = `${currentShift}/ ${currentTime}`;


  // ---------- Stepper States ----------
  const [showStepper, setShowStepper] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create"); // create | view
  const [selectedRow, setSelectedRow] = useState(null);

  const processTypeOptions = [
    { value: "TNR", label: "TNR" },
    { value: "Tube", label: "Tube" },
    { value: "Tray", label: "Tray" },
    { value: "Canister", label: "Canister" },
    { value: "Segregation", label: "Segregation" },
    { value: "Detape", label: "Detape" },
    { value: "Manual", label: "Manual" },
    ];

    const markTypeOptions = [
    { value: "INK", label: "INK" },
    { value: "LASER", label: "LASER" },
    ];

  const [formData, setFormData] = useState({
    machine_num: "",
    ww: getCurrentWorkweek(),
    fill_type: "",
    machine_type: "",
    machine_model: "",

    date: todayDate || "",
    shift_time: value || "",
    package_type: "",
    lot_id: "",
    process_type: "",
    customer_name: "",
    badge: emp_data?.emp_id || "",
    mark_type: "",
    remarks: "",
  });

 const packageTypeOptions = [
  ...new Map(
    packageType.map((item) => {
      const lead = item.lead_count?.toString().endsWith('L')
        ? item.lead_count
        : `${item.lead_count}L`; // siguraduhin may L
      const label = `${lead} ${item.package_type}`; // 24L DODU
      return [label, { value: label, label }];
    })
  ).values(),
];


  const customerOptions = [
    ...new Map(
      customerList.map((item) => [
        item.customer_name,
        { value: item.customer_name, label: item.customer_name },
      ])
    ).values(),
  ];

    const machine_Options = [
    ...new Map(
      machineList.map((item) => [
        item.machine_num,
        { value: item.machine_num, label: item.machine_num },
      ])
    ).values(),
  ];

  // ---------- Machine Options ----------
  const machine_typeOptions = [
    ...new Map(
      machine_type.map((item) => [
        item.machine_type,
        { value: item.machine_type, label: item.machine_type },
      ])
    ).values(),
  ];

 const filteredMachinePlatform = formData.machine_type
  ? machinePlatform.filter(
      (item) => item.machine_type === formData.machine_type
    )
  : machinePlatform;

const machinePlatformOptions = [
  ...new Map(
    filteredMachinePlatform.map((item) => [
      item.machine_model,
      { value: item.machine_model, label: item.machine_model },
    ])
  ).values(),
];


  // ---------- Filter machine_Options based on selected machine_model ----------




  // ---------- Filter Checklist Items for Modal ----------
const filteredItems = checklistItems.filter(
  (item) =>
    item.machine_type === formData.machine_type &&
    item.machine_model &&
    item.machine_model.toLowerCase().includes(formData.machine_model.toLowerCase().trim())
);

const filteredMachineOptions = machineList
  .filter((m) => {
    if (!formData.machine_model) return false; // walang napiling model/platform
    if (!m.machine_platform) return false;    // walang platform info sa machine
    return m.machine_platform
      .toLowerCase()
      .includes(formData.machine_model.toLowerCase().trim());
  })
  .map((m) => ({
    value: m.machine_num,
    label: m.machine_num,
  }));







  const answers = filteredItems.map((item) => ({
  item_check: item.item_check,
  frequency: item.frequency,
  responsible: item.responsible,
  result: item.fill_type.toLowerCase().includes(formData.fill_type.toLowerCase()) ? "✔" : "N/A",
}));

const payload = {
  machine_type: formData.machine_type,
  machine_model: formData.machine_model,
  machine_num: formData.machine_num,
  ww: formData.ww,
  date: formData.date,
  shift_time: formData.shift_time,
  package_type: formData.package_type,
  lot_id: formData.lot_id,
  process_type: formData.process_type,
  customer_name: formData.customer_name,
  badge: formData.badge,
  remarks: formData.remarks || "",
  answers: JSON.stringify(answers), // serialized answers array
};


  // ---------- DataTable Action ----------
const dataWithAction = tableData.data.map((r) => ({
  ...r,
  fill_type: (
  <span
    className={`px-2 py-1 text-xs font-semibold border-2 rounded-md ${
      r.fill_type === "Setup"
        ? "text-blue-600 bg-blue-200 border-blue-400"
        : r.fill_type === "Start of Shift"
        ? "text-green-600 bg-green-200 border-green-400"
        : "text-red-600 bg-red-200 border-red-400"
    }`}
  >
    {r.fill_type || "-"}
  </span>
),

  action: (
    <div className="flex gap-2">
      <button
        className="px-3 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 border-2 border-white"
        onClick={() => {
          setSelectedRow(r);
          setMode("view");
          setShowModal(true);
        }}
      >
        <i className="fas fa-eye"></i> View
      </button>
    </div>
    
  ),
}));

  
  return (
    <AuthenticatedLayout>
      <Head title="Setup Checklist" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-stone-500">
        <h1 className="text-2xl font-bold">
          <i className="fa-solid fa-clipboard"></i> Control Logsheet List
        </h1>
      {["Equipment Engineering"].includes(emp_data?.emp_dept) && !["superadmin", "admin"].includes(emp_data?.emp_role) && (
        <button
          className="p-2 rounded-md text-white bg-stone-500 border border-stone-500 hover:bg-stone-600"
          onClick={() => {
            setShowStepper(true);
            setCurrentStep(0);
          }}
        >
          <i className="fa-solid fa-plus"></i> New Checklist
        </button>
      )}
      </div>

      {/* Existing DataTable */}
      <DataTable
        columns={[
          { key: "machine_num", label: "Machine #" },
          { key: "ww", label: "Workweek" },
          { key: "date", label: "Date" },
          { key: "shift_time", label: "Shift/Time" },
          { key: "package_type", label: "Package" },
          { key: "lot_id", label: "Lot ID" },
          { key: "process_type", label: "Process" },
          { key: "customer_name", label: "Customer" },
          { key: "badge", label: "Badge" },
          { key: "fill_type", label: "Fillup Type" },
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
        routeName={route("setup-new.checklist.index")}
        filters={tableFilters}
        rowKey="id"
        showExport={false}
      />

      {/* ---------- Stepper Panel ---------- */}
      {showStepper && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setShowStepper(false)}
          />

          <div className="w-[400px] bg-white h-full p-6 overflow-y-auto">
            <h2 className="text-lg font-bold text-emerald-600 mb-4">
              <i className="fa-solid fa-clipboard"></i>
              New Checklist Setup
            </h2>

            <Steps
              current={currentStep}
              orientation="vertical"
              items={[
                { title: "Checklist Type" },
                { title: "Machine" },
              ]}
              className="mb-6"
            />

            {/* ---------- STEP 1: Checklist Type ---------- */}
            {currentStep === 0 && (
              <div className="space-y-3">
                <button
                  className={`w-full border p-2 rounded text-stone-500 border-2 border-stone-500 font-semibold hover:bg-emerald-200 hover:border-emerald-500 ${
                    formData.fill_type === "Start of Shift"
                      ? "bg-emerald-200 border-2 border-emerald-500"
                      : ""
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, fill_type: "Start of Shift" })
                  }
                >
                  Start of the Shift
                </button>

                <button
                  className={`w-full border p-2 rounded text-stone-500 border-2 border-stone-500 font-semibold hover:bg-indigo-200 hover:border-indigo-500 ${
                    formData.fill_type === "Setup"
                      ? "bg-indigo-200 border-2 border-indigo-500"
                      : ""
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, fill_type: "Setup" })
                  }
                >
                  Setup Checklist
                </button>

                <div className="flex justify-end pt-4">
                  <button
                    disabled={!formData.fill_type}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={() => setCurrentStep(1)}
                  >
                    Next <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            )}

            {/* ---------- STEP 2: Machine Type & Model ---------- */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Select
                  showSearch
                  className="w-full border border-gray-500 p-2 rounded-md text-gray-500"
                  placeholder="Select Machine Type..."
                  options={machine_typeOptions}
                  value={formData.machine_type || undefined}
                  onChange={(value) =>
                    setFormData({ ...formData, machine_type: value })
                  }
                />

                <Select
                  showSearch
                  className="w-full border border-gray-500 p-2 rounded-md text-gray-500"
                  placeholder="Select Machine Model..."
                  options={machinePlatformOptions}
                  value={formData.machine_model || undefined}
                  onChange={(value) =>
                    setFormData({ ...formData, machine_model: value })
                  }
                />

                {formData.machine_type === "GRAVITY" && (
  <Select
    showSearch
    className="w-full border border-gray-500 p-2 rounded-md text-gray-500"
    placeholder="Select Mark Type..."
    options={markTypeOptions}
    value={formData.mark_type || undefined}
    onChange={(value) =>
      setFormData({ ...formData, mark_type: value })
    }
  />
)}


                <div className="flex justify-between pt-4">
                  <button
                    className="bg-stone-500 text-white border px-4 py-2 rounded"
                    onClick={() => setCurrentStep(0)}
                  >
                    <i className="fas fa-arrow-left mr-2"></i>Back
                  </button>

                  <button
                    disabled={!formData.machine_type || !formData.machine_model || (formData.machine_type === "GRAVITY" && !formData.mark_type)}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={() => {
                      setShowModal(true); // Open modal with Step 3 content
                      setShowStepper(false);
                    }}
                  >
                    Next <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- Modal for Step 3 ---------- */}
      {showModal && (
  <div className="fixed inset-0 z-50 flex">
    <div
      className="flex-1 bg-black/40"
      onClick={() => setShowModal(false)}
    />
    <div className="w-[1300px] bg-white h-full p-6 overflow-y-auto">
      <h1 className="text-lg font-bold text-emerald-600 mb-4">
        Setup Checklist Form
      </h1>

      <table className="w-full border border-gray-300 table-auto mb-6">
  <thead>
    <tr>
      <th colSpan="4" className="border px-2 py-1">
        <div className="items-center">
           <Select
          showSearch
          className="w-1/7 border border-gray-500 p-2 rounded-md text-gray-500"
          placeholder="Select Machine..."
          options={filteredMachineOptions}
          value={formData.machine_num || undefined}
          onChange={(value) =>
            setFormData({ ...formData, machine_num: value })
          }
        />
        </div>
      </th>
    </tr>
    <tr>
        <th rowSpan={7} colSpan={2} className="border px-2 py-1">
          <div>
          <label className="text-stone-500">Workweek: </label>
          <input
            type="text"
            className="border-none p-2 rounded w-24 text-center text-gray-500"
            value={formData.ww || ""}
            readOnly
          />
          </div>
        </th>
        <th className="text-left border px-2 py-1"><label className="text-stone-500">Date:</label></th>
        <th className="text-left border px-2 py-1"><input type="text" className="border-none p-2 rounded w-full text-gray-500" value={formData.date || ""} readOnly /></th>
    </tr>
    <tr>
        <th className="text-left border px-2 py-1"><label className="text-stone-500">Shift/ Time:</label></th>
        <th className="text-left border px-2 py-1"><input type="text" className="border-none p-2 rounded w-full text-gray-500" value={formData.shift_time || ""} readOnly /></th>
      </tr>
    <tr>
        <th className="text-left border px-2 py-1"><label className="text-stone-500">Package Type:</label></th>
        <th className="text-left border px-2 py-1">
          <Select 
  showSearch
  className="w-full border border-gray-500 p-2 rounded-md text-gray-500 items-center"
  placeholder="Select Package Type..."
  options={packageTypeOptions}
  value={formData.package_type || undefined}
  onChange={(value) =>
    setFormData({ ...formData, package_type: value })
  }
/>

        </th>
    </tr>
    <tr>
        <th className="text-left border px-2 py-1"><label className="text-stone-500">Lot ID:</label></th>
        <th className="text-left border px-2 py-1"><input type="text" className="border-gray-500 p-2 rounded w-full text-gray-500 uppercase" onChange={(e) => setFormData({ ...formData, lot_id: e.target.value })} value={formData.lot_id || ""} /></th>
    </tr>
    <tr>
        <th className="text-left border px-2 py-1"><label className="text-stone-500">Process Type:</label></th>
        <th className="text-left border px-2 py-1">
          <Select
            showSearch
            className="w-full border border-gray-500 p-2 rounded-md text-gray-500 items-center"
            placeholder="Select Process Type..."
            options={processTypeOptions}
            value={formData.process_type || undefined}
            onChange={(value) =>
              setFormData({ ...formData, process_type: value })
            }
          />
        </th>
    </tr>
    <tr>
        <th className="text-left border px-2 py-1"><label className="text-stone-500">Customer:</label></th>
        <th className="text-left border px-2 py-1">
          <Select
            showSearch
            className="w-full border border-gray-500 p-2 rounded-md text-gray-500 items-center"
            placeholder="Select Customer..."
            options={customerOptions}
            value={formData.customer_name || undefined}
            onChange={(value) =>
              setFormData({ ...formData, customer_name: value })
            }
          />
        </th>
    </tr>
    <tr>
        <th className="text-left border px-2 py-1"><label className="text-stone-500">Badge:</label></th>
        <th className="text-left border px-2 py-1"><input type="text" className="border-gray-400 p-2 rounded w-full text-gray-500" value={formData.badge || ""} readOnly /></th>
    </tr>
    <tr className="bg-gray-100 text-stone-500">
      <th className="border px-2 py-1">Item to Check</th>
      <th className="border px-2 py-1">Frequency</th>
      <th className="border px-2 py-1">Responsible</th>
      <th className="border px-2 py-1"></th>
    </tr>
  </thead>
  <tbody className="text-stone-500">
  {filteredItems.length > 0 ? (
    filteredItems.map((item) => (
      <tr key={item.id}>
        <td className="border px-2 py-1">{item.item_check}</td>
        <td className="border px-2 py-1">{item.frequency}</td>
        <td className="border px-2 py-1">{item.responsible}</td>
        <td className="border px-2 py-1 text-center">
          <select
            className="border-none w-20 text-center"
            value={
              item.fill_type
                .toLowerCase()
                .includes(formData.fill_type.toLowerCase())
                ? "✔"
                : "N/A"
            }
            readOnly
  //           onChange={(e) => {
  //   const newAnswers = [...answers];
  //   newAnswers[index].result = e.target.value;
  //   setAnswers(newAnswers);
  // }}
          >
            <option value="✔">✔</option>
            <option value="N/A">N/A</option>
          </select>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="text-center py-4 text-red-500 font-medium">
        No checklist available. Please check the selected Machine Type and
        Machine Model.
      </td>
    </tr>
  )}
  <tr>
      <td className="border px-2 py-1 text-right"><label>Remarks:</label></td>
      <td colSpan={3} className="border px-2 py-1"><textarea cols="30" rows="3" className="border-gray-400 p-2 rounded w-full text-gray-500" onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} value={formData.remarks || ""}></textarea></td>
  </tr>
  
</tbody>
</table>


      <div className="flex justify-end">
<button
  disabled={!formData.machine_type || !formData.machine_model}
  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
  onClick={async () => {
    try {
      const payload = {
        machine_type: formData.machine_type,
        machine_model: formData.machine_model,
        machine_num: formData.machine_num,
        ww: formData.ww,
        date: formData.date,
        shift_time: formData.shift_time,
        package_type: formData.package_type,
        lot_id: formData.lot_id,
        process_type: formData.process_type,
        customer_name: formData.customer_name,
        badge: formData.badge,
        fill_type: formData.fill_type,
        remarks: formData.remarks || "",
        mark_type: formData.mark_type,
        answers: JSON.stringify(answers),
      };

  router.post(route("setup.checklist.store"), payload, {
    onError: (errors) => {
      if (errors.duplicate) {
        alert(errors.duplicate); // show duplicate message
        window.location.reload();
      } else {
        alert("Failed to save setup checklist. Please check your inputs.");
      }
    },
    onSuccess: () => {
      alert("✅ Checklist saved successfully!");
    },
  });
} catch (error) {
  console.error("Failed to save setup checklist:", error);
}

  }}
>
  Next <i className="fas fa-arrow-right ml-2"></i>
</button>




      </div>
    </div>
  </div>
)}

{showModal && mode === "view" && selectedRow && (
  <ViewChecklistModal
    data={selectedRow}
    setShowModal={setShowModal}
  />
)}


    </AuthenticatedLayout>
  );
}
