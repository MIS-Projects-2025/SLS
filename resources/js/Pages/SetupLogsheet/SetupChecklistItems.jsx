import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import { useState } from "react";
import { Select, message} from "antd";


export default function SetupChecklistItems({ tableData, tableFilters, emp_data, checklistItems, machineType, machinePlatform }) {

    const machineTypeOptions = [
  ...new Map(
    machineType.map(item => [
      item.machine_type,
      { value: item.machine_type, label: item.machine_type }
    ])
  ).values()
];


    const machinePlatformOptions = [
  ...new Map(
    machinePlatform.map(item => [
      item.machine_platform,
      { value: item.machine_platform, label: item.machine_platform }
    ])
  ).values()
];


    const frequencyOptions = [
    { value: "N/A", label: "N/A" },
    { value: "Start of Shift", label: "Start of Shift" },
    { value: "Start of shift /every set-up", label: "Start of shift /every set-up" },
    { value: "Start of shift/ every set-up/hang-up", label: "Start of shift/ every set-up/hang-up" },
    { value: "Every Set-up", label: "Every Set-up" },
    { value: "Every set-up/ hang-up", label: "Every set-up/ hang-up" },
    { value: "Every change of package type/lead count/hang-up", label: "Every change of package type/lead count/hang-up" },
    { value: "Every set-up/Every change of Material", label: "Every set-up/Every change of Material" },
    { value: "Daily / Every detape set up", label: "Daily / Every detape set up" },
    ];

    const responsibleOptions = [
    { value: "Operator/Technician", label: "Operator/Technician" },
    { value: "Operator", label: "Operator" },
    { value: "Technician", label: "Technician" },
    ];

    const fillTypeOptions = [
    { value: "Start of Shift", label: "Start of Shift" },
    { value: "Setup", label: "Setup" },
    { value: "Start of Shift/ Setup", label: "Start of Shift/ Setup" },
    ];


    


    const [showDrawer, setShowDrawer] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState({ machine_type: "", machine_model: "" });
    const [editingRow, setEditingRow] = useState(null);
    const [editableChecklistItems, setEditableChecklistItems] = useState([]);
    



    const handleView = (machine_type, machine_model) => {
    const filtered = checklistItems.filter(
        (item) =>
            item.machine_type === machine_type &&
            item.machine_model === machine_model
    );
    setSelectedMachine({ machine_type, machine_model });
    setEditableChecklistItems(filtered);
    setShowViewModal(true);
};

const saveRow = (item, index) => {
    router.put(route("setup.checklist.edit", item.id), item, {
        onSuccess: () => {
            setEditingRow(null);
            message.success("Checklist item updated successfully!");
        },
        onError: () => {
            message.error("Failed to update checklist item.");
        },
    });
};




const emptyForm = {
    machine_type: "",
    machine_model: "",
    item_check: "",
    frequency: "",
    responsible: "",
    fill_type: "",
    tolerance: "",
};

const [form, setForm] = useState(emptyForm);
const [cart, setCart] = useState([]);


// Action buttons kasama ang Edit
const dataWithAction = tableData.data.map((r) => ({
  ...r,
  action: (
    <div className="flex gap-2">
      {/* View Button */}
      <button
  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
 onClick={() => handleView(r.machine_type, r.machine_model)}
>
  <i className="fas fa-eye"></i> View
</button>


    </div>
  ),
}));
    
    return (
        <AuthenticatedLayout>
            <Head title="Setup Checklist Items" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-600"><i className="fa-solid fa-list-check"></i> Setup Checklist Items</h1>
                    <button
                        className="p-2 rounded-md text-blue-600 border border-blue-600 hover:bg-blue-100"
                        onClick={() => setShowDrawer(true)}
                    >
                       <i className="fa-solid fa-plus"></i> New Item
                    </button>
            </div>

            <DataTable
                columns={[
                    { key: "machine_type", label: "Machine Type" },
                    { key: "machine_model", label: "Machine Model" },
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
                routeName={route("setup.checklist.index")}
                filters={tableFilters}
                rowKey="id"
                // selectable={true}
                // onSelectionChange={setSelectedRows}
                // dateRangeSearch={true}
                showExport={false}
            />


                {/* Add New Checklist Item Drawer */}
            {showDrawer && (
    <div className="fixed inset-0 z-50 flex">
        {/* backdrop */}
        <div
            className="flex-1 bg-black/40"
            onClick={() => setShowDrawer(false)}
        />

        {/* drawer */}
        <div className="w-[950px] bg-white h-full p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-emerald-500"><i className="fa-solid fa-plus"></i> Setup Checklist Item</h2>
                <button className="text-1xl text-red-500 font-bold" onClick={() => setShowDrawer(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

        {/* FORM */}
<div className="grid grid-cols-3 gap-4">
    {Object.keys(emptyForm).map((key) => (
        <div key={key}>
            <label className="block text-sm font-medium capitalize text-gray-500">
                {key.replace("_", " ")}
            </label>

            {key === "machine_type" ? (
                <Select
                    showSearch
                    className="w-full border border-gray-500 p-2 rounded-md text-gray-500"
                    placeholder="Select Machine Type..."
                    options={machineTypeOptions}
                    value={form.machine_type || undefined}
                    onChange={(value) =>
                        setForm({ ...form, machine_type: value })
                    }
                />
            ) : key === "machine_model" ? (
                <Select
                    showSearch
                    className="w-full border border-gray-500 p-2 rounded-md text-gray-500"
                    placeholder="Select Machine Model..."
                    options={machinePlatformOptions}
                    value={form.machine_model || undefined}
                    onChange={(value) =>
                        setForm({ ...form, machine_model: value })
                    }
                />
             ) : key === "frequency" ? (
                <Select
                    showSearch
                    className="w-full border border-gray-500 p-2 rounded-md text-gray-500"
                    placeholder="Select Frequency..."
                    options={frequencyOptions}
                    value={form.frequency || undefined}
                    onChange={(value) =>
                        setForm({ ...form, frequency: value })
                    }
                />
             ) : key === "responsible" ? (
                <Select
                    showSearch
                    className="w-full border border-gray-500 p-2 rounded-md text-gray-500"
                    placeholder="Select Responsible..."
                    options={responsibleOptions}
                    value={form.responsible || undefined}
                    onChange={(value) =>
                        setForm({ ...form, responsible: value })
                    }
                />
             ) : key === "fill_type" ? (
                <Select
                    showSearch
                    className="w-full border border-gray-500 p-2 rounded-md text-gray-500"
                    placeholder="Select Fill Type..."
                    options={fillTypeOptions}
                    value={form.fill_type || undefined}
                    onChange={(value) =>
                        setForm({ ...form, fill_type: value })
                    }
                />
            ) : (
                <input
                    className="w-full border rounded p-2 text-gray-500"
                    value={form[key]}
                    onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                    }
                />
            )}
        </div>
    ))}
</div>


            {/* ADD TO CART */}
            <div className="flex justify-end">
            <button
                className="w-1/4 mt-4 bg-blue-600 text-white p-2 rounded"
                onClick={() => {
                    setCart([...cart, form]);
                    setForm(emptyForm);
                }}
            >
                <i className="fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
            </div>
            {/* CART LIST */}
            {cart.length > 0 && (
    <div className="mt-6">
        <h3 className="font-semibold mb-2 text-lg text-emerald-600">
            Cart Items ({cart.length})
        </h3>

        <div className="overflow-x-auto border rounded">
            <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2 text-gray-500">Machine Type</th>
                        <th className="border p-2 text-gray-500">Machine Model</th>
                        <th className="border p-2 text-gray-500">Item Check</th>
                        <th className="border p-2 text-gray-500">Frequency</th>
                        <th className="border p-2 text-gray-500">Responsible</th>
                        <th className="border p-2 text-gray-500">Fill Type</th>
                        <th className="border p-2 text-gray-500">Tolerance</th>
                        <th className="border p-2 text-gray-500">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {cart.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 text-gray-500">
                            <td className="border p-2">{item.machine_type}</td>
                            <td className="border p-2">{item.machine_model}</td>
                            <td className="border p-2">{item.item_check}</td>
                            <td className="border p-2">{item.frequency}</td>
                            <td className="border p-2">{item.responsible}</td>
                            <td className="border p-2">{item.fill_type}</td>
                            <td className="border p-2">{item.tolerance}</td>
                            <td className="border p-2 text-center">
                                <button
                                    className="text-red-600 hover:font-bold"
                                    onClick={() =>
                                        setCart(cart.filter((_, i) => i !== index))
                                    }
                                >
                                    <i className="fa-solid fa-trash"></i> Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)}


            {/* SAVE */}
            <div className="flex justify-end">
                {cart.length !== 0 && (
            <button
    className="w-1/4 mt-6 bg-green-600 text-white p-2 rounded disabled:opacity-50"
    onClick={() =>
        router.post(route("setup.checklist.store"), { items: cart }, {
            onSuccess: () => {
                alert("Checklist items saved successfully!");
                setCart([]); // optional: clear cart after save
                setShowDrawer(false); // optional: close drawer
            },
            onError: (errors) => {
                alert("Failed to save checklist items. Please try again.");
            },
        })
    }
>
    <i className="fa-solid fa-save"></i> Save All
</button>

                )}
            </div>
        </div>
    </div>
)}

                {/* edit Checklist Item Drawer */}
                {showViewModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* backdrop */}
        <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowViewModal(false)}
        />

        {/* modal */}
        <div className="relative bg-white w-[90%] max-w-6xl rounded-lg p-4 z-10 overflow-y-auto max-h-[100vh]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-indigo-600">
                    <i className="fa-solid fa-list-check mr-2"></i>
                    Setup Checklist Items – {selectedMachine.machine_type} /{" "}
                    {selectedMachine.machine_model}
                </h2>
                <button className="text-1xl text-red-500 font-bold" onClick={() => setShowViewModal(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div className="overflow-x-auto border rounded">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-stone-200">
                        <tr>
                            <th className="border p-2 text-gray-500">Item Check</th>
                            <th className="border p-2 text-gray-500">Frequency</th>
                            <th className="border p-2 text-gray-500">Responsible</th>
                            <th className="border p-2 text-gray-500">Fill Type</th>
                            <th className="border p-2 text-gray-500">Tolerance</th>
                            <th className="border p-2 text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody>
    {editableChecklistItems.length > 0 ? (
        editableChecklistItems.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-gray-50 text-gray-500">
                {/* Item Check */}
                <td className="border p-2">
                    {editingRow === index ? (
                        <input
                            className="w-full border rounded p-1"
                            value={item.item_check}
                            onChange={(e) => {
                                const newItems = [...editableChecklistItems];
                                newItems[index].item_check = e.target.value;
                                setEditableChecklistItems(newItems);
                            }}
                        />
                    ) : (
                        item.item_check
                    )}
                </td>

                {/* Frequency */}
                <td className="border p-2">
                    {editingRow === index ? (
                        <Select
                            showSearch
                            className="w-full"
                            options={frequencyOptions}
                            value={item.frequency || undefined}
                            onChange={(value) => {
                                const newItems = [...editableChecklistItems];
                                newItems[index].frequency = value;
                                setEditableChecklistItems(newItems);
                            }}
                        />
                    ) : (
                        item.frequency
                    )}
                </td>

                {/* Responsible */}
                <td className="border p-2">
                    {editingRow === index ? (
                        <Select
                            showSearch
                            className="w-full"
                            options={responsibleOptions}
                            value={item.responsible || undefined}
                            onChange={(value) => {
                                const newItems = [...editableChecklistItems];
                                newItems[index].responsible = value;
                                setEditableChecklistItems(newItems);
                            }}
                        />
                    ) : (
                        item.responsible
                    )}
                </td>

                {/* Fill Type */}
                <td className="border p-2">
                    {editingRow === index ? (
                        <Select
                            showSearch
                            className="w-full"
                            options={fillTypeOptions}
                            value={item.fill_type || undefined}
                            onChange={(value) => {
                                const newItems = [...editableChecklistItems];
                                newItems[index].fill_type = value;
                                setEditableChecklistItems(newItems);
                            }}
                        />
                    ) : (
                        item.fill_type
                    )}
                </td>

                {/* Tolerance */}
                <td className="border p-2">
                    {editingRow === index ? (
                        <input
                            className="w-full border rounded p-1"
                            value={item.tolerance}
                            onChange={(e) => {
                                const newItems = [...editableChecklistItems];
                                newItems[index].tolerance = e.target.value;
                                setEditableChecklistItems(newItems);
                            }}
                        />
                    ) : (
                        item.tolerance
                    )}
                </td>

                <td className="border p-2 text-center">
  {editingRow === index ? (
    <div className="flex justify-center gap-2">
      <button
        className="px-2 py-1 bg-green-600 text-white rounded"
        onClick={() => saveRow(item, index)}
      >
        Save
      </button>
      <button
        className="px-2 py-1 bg-gray-400 text-white rounded"
        onClick={() => setEditingRow(null)}
      >
        Cancel
      </button>
    </div>
  ) : (
    <div className="flex justify-center gap-2">
      <button
        className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-amber-500"
        onClick={() => setEditingRow(index)}
      >
        <i className="fa-solid fa-pen-to-square"></i>
      </button>
      <button
        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => {
          if (
            confirm("Are you sure you want to delete this item?")
          ) {
            router.delete(
              route("setup.checklist.delete", item.id),
              {
                onSuccess: () => {
                  const newItems =
                    editableChecklistItems.filter(
                      (_, i) => i !== index
                    );
                  setEditableChecklistItems(newItems);
                  message.success(
                    "Checklist item deleted successfully!"
                  );
                },
                onError: () => {
                  message.error(
                    "Failed to delete checklist item."
                  );
                },
              }
            );
          }
        }}
      >
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  )}
</td>

            </tr>
        ))
    ) : (
        <tr>
            <td colSpan={7} className="border p-4 text-center text-gray-500">
                No checklist items found.
            </td>
        </tr>
    )}
</tbody>

                </table>
            </div>
        </div>
    </div>
)}






        </AuthenticatedLayout>
    );
}
