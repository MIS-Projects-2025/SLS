import { useState } from "react";
import axios from "axios";
import ViewPositiveChecklistModal from "@/Components/ViewPositiveChecklistModal";

export default function ViewChecklistModal({ data, setShowModal, employeeId, qaEmpTampNumber, employeeDepartment }) {
  const answers = data.answers ? JSON.parse(data.answers) : [];
  const [showPositiveModal, setShowPositiveModal] = useState(false);
  const [positiveData, setPositiveData] = useState([]);



  const fetchPositiveChecklist = async () => {
    try {
      const response = await axios.get(
        route("setup.checklist.positive", data.setup_log_id)
      );
      setPositiveData(response.data);
      setShowPositiveModal(true);
    } catch (error) {
      console.error("Failed to fetch positive checklist:", error);
      alert("No positive checklist data available.");
    }
  };

  const handleVerify = async () => {
  try {
    await axios.put(route("setup.checklist.verify", data.setup_log_id), {
    });

    window.location.reload(); // or better: refetch data
  } catch (error) {
    console.error("Verification failed:", error);
    alert("Failed to verify.");
  }
};


  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div
          className="flex-1 bg-black/40"
          onClick={() => setShowModal(false)}
        />
        <div className="w-[1300px] bg-white h-full p-6 overflow-y-auto">
          <div className="flex justify-end mb-2">
             <button
              className="px-4 py-2 text-red-600 hover:text-red-700"
              onClick={() => setShowModal(false)}
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
            <div className="flex justify-between text-stone-500">
                <h2 className="text-lg font-bold text-emerald-600 mb-4">
            Setup Control Logsheet
          </h2>
          Reference ID: {data.setup_log_id}
            </div>
            <div className="flex justify-end mb-2 text-stone-500">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={fetchPositiveChecklist}
            >
              <i className="fa fa-eye"></i> View Positive Log..
            </button>
            </div>
          <table className="w-full border border-gray-300 table-auto mb-6 text-stone-500">
            <thead>
              <tr>
                <td colSpan={4} className="border px-2 py-1 text-center">
                  
                  <label>Machine #: </label>{data.machine_num}
                </td>
              </tr>
              <tr>
                <td colSpan={2} rowSpan={7} className="border px-2 py-1 text-center">
                  <label>Workweek: </label>{data.ww}
                </td>
                <td className="border px-2 py-1 font-semibold">Date</td>
                <td className="border px-2 py-1">{data.date}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1 font-semibold">Shift</td>
                <td className="border px-2 py-1">{data.shift_time}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1 font-semibold">Package Type</td>
                <td className="border px-2 py-1">{data.package_type}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1 font-semibold">Lot ID</td>
                <td className="border px-2 py-1">{data.lot_id}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1 font-semibold">Process Type</td>
                <td className="border px-2 py-1">{data.process_type}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1 font-semibold">Customer</td>
                <td className="border px-2 py-1">{data.customer_name}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1 font-semibold">Badge</td>
                <td className="border px-2 py-1">{data.badge}</td>
              </tr>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Item to Check</th>
                <th className="border px-2 py-1">Frequency</th>
                <th className="border px-2 py-1">Responsible</th>
                <th className="border px-2 py-1">Answer</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((item, index) => (
                <tr key={index}>

                  <td className="border px-2 py-1">{item.item_check}</td>
                  <td className="border px-2 py-1">{item.frequency}</td>
                  <td className="border px-2 py-1">{item.responsible}</td>
                  <td className="border px-2 py-1 text-center">{item.result}</td>
                </tr>
              ))}
              <tr>
                <td className="border p-4 font-semibold text-right">Remarks:</td>
                <td colSpan={3} className="p-4  border">{data.remarks}</td>
              </tr>
             {data.fill_type === "Setup" && (
  <tr>
    <td className="border p-4 font-semibold text-right">
      Setup Verifier:
    </td>
  <td colSpan={3} className="p-4 border">
  {data.verifier ? (
    <div className="text-left w-16 h-16">
      {/* Outer Circle */}
      <div className="w-full h-full rounded-full border-2 border-indigo-800 flex items-center justify-center relative">
        
        {/* Top Text */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-green-500 font-bold text-xs tracking-widest">
          {data.verify_status}
        </div>
        
        {/* Bottom Text (optional) */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-indigo-800 font-semibold text-[10px]">
          TSPI
        </div>
        
        {/* Center Value */}
        <div className="text-blue-600 font-semibold text-center text-md px-1">
          {data.verifier}
        </div>
      </div>
    </div>
  ) : (
    <span className="font-semibold text-red-400 cursor-not-allowed">
      Pending Verification. Kindly call the attention of QA personnel.
    </span>
  )}
</td>



  </tr>
)}

            </tbody>
          </table>

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              onClick={() => setShowModal(false)}
            >
              <i className="fa fa-close"></i> Close
            </button>

            
          </div>
        </div>
      </div>

      {showPositiveModal && (
        <ViewPositiveChecklistModal
          positiveData={positiveData}
          setShowModal={setShowPositiveModal}
        />
      )}
    </>
  );
}
