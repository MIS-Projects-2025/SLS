import { m } from "framer-motion";
import { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Steps, Select } from "antd";
export default function PositiveChecklist({ setupData, setupId, onClose, emp_data, positiveChecklistItems }) {
  const [positiveChecklistItemsState, setPositiveChecklistItems] = useState(positiveChecklistItems || []);
  const [loading, setLoading] = useState(false); // no more API call, so false

  if (!setupData) return <div>Loading setup details...</div>;

  const {
    id,
    machine_num,
    ww,
    date,
    shift_time,
    package_type,
    lot_id,
    process_type,
    customer_name,
    badge,
    machine_type,
    machine_model,
    fill_type,
    mark_type
  } = setupData;



  

 

  const [formData, setFormData] = useState({
    setup_log_id: id || "",
    machine_num: machine_num || "",
    ww: ww || "",
    fill_type: fill_type || "",
    machine_type: machine_type || "",
    machine_model: machine_model || "",
    date: date || "",
    shift_time: shift_time || "",
    package_type: package_type || "",
    lot_id: lot_id || "",
    process_type: process_type || "",
    customer_name: customer_name || "",
    badge: badge || "",
    mark_type: mark_type || "",
    remarks: "",
  });

  // Filter checklist items by machine_type & machine_model
   const filteredItems = positiveChecklistItemsState.filter((item) => {
    const itemType = (item.machine_type || "").trim().toLowerCase();
    const itemModel = (item.machine_model || "").trim().toLowerCase();
    const setupType = (formData.machine_type || "").trim().toLowerCase();
    const setupModel = (formData.machine_model || "").trim().toLowerCase();

    const typeModelMatch = itemType === setupType && itemModel === setupModel;

    // Kung GRAVITY, filter din by selected mark_type
    if (setupType === "gravity" && formData.mark_type) {
      return typeModelMatch && (item.mark_type || "").toLowerCase() === (formData.mark_type || "").toLowerCase();
    }

    return typeModelMatch;
  });

  console.log("formData", setupData);

  

  // Manual change updates only one row
  const handleAnswerChange = (inputVariable, value) => {
    setAnswers(prev =>
      prev.map(a =>
        a.input_variable === inputVariable ? { ...a, result: value } : a
      )
    );
  };
 // Initialize answers once
 
  // -------------------------------
  // Check if item fill_type matches formData.fill_type
  const checkFillTypeMatch = (itemFillType) => {
    if (!formData.fill_type || !itemFillType) return false;

    // kapag Setup ang selected
    if (formData.fill_type.toLowerCase() === "setup") {
      return itemFillType.toLowerCase().includes("setup");
    }

    // kapag Start of Shift ang selected
    if (formData.fill_type.toLowerCase() === "start of shift") {
      return itemFillType.toLowerCase().includes("start of shift");
    }

    return false;
  };

   const [answers, setAnswers] = useState(() => {
    return filteredItems.map(item => {
      let result = checkFillTypeMatch(item.fill_type) ? item.tolerance : "N/A";
      return {
        input_variable : item.input_variable,
        vision_system : item.vision_system,
        control_item : item.control_item,
        frequency : item.frequency,
        responsible : item.responsible,
        result,
      };
    });
  });
 

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="w-[1300px] bg-white h-full p-6 overflow-y-auto">
        <h1 className="text-lg font-bold text-blue-600 mb-4">Positive Checklist</h1>

        {/* Header Info */}
        <table className="w-full border border-gray-300 table-auto mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th colSpan={6} className="border px-2 py-1 text-center">
                <label className="text-gray-500">Machine #: </label>
                <input
                  type="text"
                  value={formData.machine_num || undefined}
                  readOnly
                  className="w-[200px] border-none bg-transparent text-left text-stone-500"
                />
              </th>
            </tr>

            <tr className="bg-gray-50">
              <th rowSpan={8} colSpan={4} className="border px-2 py-1 text-center">
                <label className="text-gray-500">Workweek: </label>
                <input
                  type="text"
                  value={formData.ww || undefined}
                  readOnly
                  className="w-[100px] border-none bg-transparent text-left text-stone-500"
                />
              </th>
            </tr>

            <tr>
              <th className="border px-2 py-1 text-left text-gray-500">Date</th>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={formData.date || undefined}
                  readOnly
                  className="w-[150px] border-none bg-transparent text-left text-stone-500"
                />
              </td>
            </tr>

            <tr>
              <th className="border px-2 py-1 text-left text-gray-500">Shift / Time</th>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={formData.shift_time || undefined}
                  readOnly
                  className="w-[120px] border-none bg-transparent text-left text-stone-500"
                />
              </td>
            </tr>

            <tr>
              <th className="border px-2 py-1 text-left text-gray-500">Package Type</th>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={formData.package_type || undefined}
                  readOnly
                  className="border-none bg-transparent text-left w-full text-stone-500"
                />
              </td>
            </tr>

            <tr>
              <th className="border px-2 py-1 text-left text-gray-500">Lot ID</th>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={formData.lot_id || undefined}
                  readOnly
                  className="border-none bg-transparent text-left w-full uppercase text-stone-500"
                />
              </td>
            </tr>

            <tr>
              <th className="border px-2 py-1 text-left text-gray-500">Process Type</th>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={formData.process_type || undefined}
                  readOnly
                  className="border-none bg-transparent text-left w-full text-stone-500"
                />
              </td>
            </tr>

            <tr>
              <th className="border px-2 py-1 text-left text-gray-500">Customer</th>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={formData.customer_name || undefined}
                  readOnly
                  className="border-none bg-transparent text-left w-full text-stone-500"
                />
              </td>
            </tr>

            <tr>
              <th className="border px-2 py-1 text-left text-gray-500">Badge</th>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={formData.badge || undefined}
                  readOnly
                  className="border-none bg-transparent text-left w-full text-stone-500"
                />
              </td>
            </tr>

            <tr className="bg-gray-100 text-stone-500">
              <th className="border px-2 py-1">Input Variable</th>
              <th className="border px-2 py-1">Vision System/MC/Part/MC Feature</th>
              <th className="border px-2 py-1">Control Item</th>
              <th className="border px-2 py-1">Frequency</th>
              <th className="border px-2 py-1">Responsible</th>
              <th className="border px-2 py-1">Result</th>
            </tr>

            {formData.machine_type === 'GRAVITY' && (
              <tr className="bg-white text-stone-500">
                <td colSpan={5} className="border px-2 py-1 text-right text-gray-800"><p>Type of Mark Attribute (Laser/ Ink)</p></td>
                <td className="border px-2 py-1 text-center">
                  <input
                    type="text"
                    value={formData.mark_type || undefined}
                    readOnly
                    className="w-32 border-none bg-transparent text-center"
                  />
                </td>
              </tr>
            )}
          </thead>

          <tbody className="text-stone-500">
{filteredItems.map((item, index) => {
  const answer = answers.find(a => a.input_variable === item.input_variable);

  return (
    <tr key={`${item.input_variable}-${index}`}>
      <td className="border p-2 text-center">{item.input_variable}</td>
      <td className="border p-2 text-center">{item.vision_system}</td>
      <td className="border p-2">{item.control_item}</td>
      <td className="border p-2">{item.frequency}</td>
      <td className="border p-2">{item.responsible}</td>
      <td className="border p-2 text-center">
        {checkFillTypeMatch(item.fill_type) ? (
          <input
            type="text"
            className="w-16 border-none rounded-md text-center"
            value={item.tolerance || ""}
            onChange={(e) =>
              handleAnswerChange(item.input_variable, e.target.value)
            }
          />
        ) : (
          <input
            type="text"
            className="w-16 border-none rounded-md text-center"
            value="N/A"
            disabled
          />
        )}
      </td>
    </tr>
  );
})}

<tr>
  <td colSpan={3} className="border px-2 py-1 text-right text-gray-800"><p>Remarks</p></td>
  <td colSpan={3} className="border px-2 py-1 text-center">
    <textarea
  value={formData.remarks || ""}
  placeholder="Place your Remarks here..."
  className="w-full h-32 bg-transparent rounded-md resize-none outline-none"
  onChange={(e) =>
    setFormData({ ...formData, remarks: e.target.value })
  }
/>

  </td>
</tr>

          </tbody>
        </table>

        {/* Footer Buttons */}
        <div className="flex justify-end mt-6">
          <button
  className="bg-green-600 text-white px-4 py-2 rounded"
  onClick={() => {
    const payload = {
      setup_log_id: id,
      machine_type: machine_type,
      machine_model: machine_model,
      machine_num: machine_num,
      ww: ww,
      date: date,
      shift_time: shift_time,
      package_type: package_type,
      lot_id: lot_id,
      process_type: process_type,
      customer_name: customer_name,
      badge: badge,
      fill_type: formData.fill_type,
      remarks: formData.remarks || "",
      mark_type: formData.mark_type || "",
      answers: JSON.stringify(answers),
    };

    router.post(route("positive.checklist.store"), payload, {
      onSuccess: () => {
        alert("✅ Checklist saved successfully!");
        window.location.reload();
      },
      onError: (errors) => {
        alert("Failed to save checklist. Please check your inputs.");
        console.error(errors);
      },
    });
  }}
>
  <i className="fas fa-paper-plane mr-2"></i>
  Submit
</button>

        </div>
      </div>
    </div>
  );
}
