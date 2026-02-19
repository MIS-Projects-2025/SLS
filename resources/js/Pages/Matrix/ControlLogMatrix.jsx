import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import { useState } from "react";

export default function ControlLogMatrix({ tableData, tableFilters, emp_data }) {

    const [showDrawer, setShowDrawer] = useState(false);
    const [viewDrawer, setViewDrawer] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [data, setData] = useState({
        platform: "",
        category: "",
        document_title: "",
        machine_model: "",
        pdf_file: null,
        pdf_file_name: "",
    });

const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.pdf_file_name) {
        alert("❌ Please enter a new file name for the PDF!");
        return;
    }

    const formData = new FormData();
    formData.append("platform", data.platform);
    formData.append("category", data.category);
    formData.append("document_title", data.document_title);
    formData.append("machine_model", data.machine_model);
    formData.append("pdf_file_name", data.pdf_file_name);

    if (data.pdf_file) {
        const renamedFile = new File(
            [data.pdf_file],
            data.pdf_file_name + ".pdf",
            { type: "application/pdf" }
        );
        formData.append("pdf_file", renamedFile);
    }

    if (selectedRow) {
        // ✅ Update existing
        router.post(route("matrix.controllog.update", selectedRow.id), formData, {
            forceFormData: true,
            headers: { "X-HTTP-Method-Override": "PUT" }, // Needed if Laravel only accepts PUT
            onSuccess: () => {
                alert("✅ Record updated successfully!");
                setShowDrawer(false);
                setSelectedRow(null);
                setData({
                    platform: "",
                    category: "",
                    document_title: "",
                    machine_model: "",
                    pdf_file: null,
                    pdf_file_name: "",
                });
            },
            onError: (errors) => {
                console.log(errors);
                alert("❌ Validation failed!");
            },
        });
    } else {
        // ✅ Create new
        router.post(route("matrix.controllog.store"), formData, {
            forceFormData: true,
            onSuccess: () => {
                alert("✅ Data saved successfully!");
                setShowDrawer(false);
                setData({
                    platform: "",
                    category: "",
                    document_title: "",
                    machine_model: "",
                    pdf_file: null,
                    pdf_file_name: "",
                });
            },
            onError: (errors) => {
                console.log(errors);
                alert("❌ Validation failed!");
            },
        });
    }
};


const handleDelete = (id, fileName) => {
  if (!confirm("Are you sure you want to delete this record? This will also remove the PDF file.")) return;

  router.delete(route("matrix.controllog.destroy", id), {
    onSuccess: () => {
      alert("✅ Record deleted successfully!");
      window.location.reload();
    },
    onError: (errors) => {
      console.error(errors);
      alert("Failed to delete record.");
    },
  });
};


const dataWithAction = tableData.data.map((r) => ({
  ...r,
  action: (
    <div className="flex space-x-2">
      {/* View */}
      <button
        className="px-3 py-2 bg-stone-500 text-white rounded-md hover:bg-stone-600 border border-stone-600"
        onClick={() => {
          setSelectedRow(r);
          setViewDrawer(true);
        }}
      >
        <i className="fa-solid fa-eye"></i> View
      </button>

      {/* Update */}
      {["Process Engineering"].includes(emp_data?.emp_dept) && (
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 border border-blue-700"
          onClick={() => {
            setSelectedRow(r);
            setData({
              platform: r.platform,
              category: r.category,
              document_title: r.document_title,
              machine_model: r.machine_model,
              pdf_file: null,
              pdf_file_name: r.attach_file_name,
            });
            setShowDrawer(true);
          }}
        >
          <i className="fa-solid fa-edit"></i> Update
        </button>
      )}

      {/* Delete */}
      {["Process Engineering"].includes(emp_data?.emp_dept) && (
        <button
          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 border border-red-700"
          onClick={() => handleDelete(r.id, r.pdf_file_name)}
        >
          <i className="fa-solid fa-trash"></i> Delete
        </button>
      )}
    </div>
  ),
}));




    return (
        <AuthenticatedLayout>
            <Head title="Control Log Matrix" />

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-stone-500">
                    <i className="fa-solid fa-table-cells"></i> Control Log Matrix
                </h1>

                {["Process Engineering"].includes(emp_data?.emp_dept) && (
                    <button
                        className="text-sky-600 bg-sky-100 border border-sky-600 px-4 py-2 rounded hover:bg-sky-600 hover:text-white"
                        onClick={() => setShowDrawer(true)}
                    >
                        <i className="fa-solid fa-plus mr-1"></i> New Matrix
                    </button>
                )}
            </div>

            {/* TABLE */}
            <DataTable
                columns={[
                    { key: "platform", label: "Platform" },
                    { key: "category", label: "Category" },
                    { key: "document_title", label: "Title" },
                    { key: "machine_model", label: "Model" },
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
                routeName={route("matrix.controllog.index")}
                filters={tableFilters}
                rowKey="id"
                showExport={false}
            />

            {/* DRAWER */}
            {showDrawer && (
                <div className="fixed inset-0 z-50 flex">

                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setShowDrawer(false)}
                    ></div>

                    {/* Drawer */}
                    <div className="relative ml-auto w-full max-w-3xl h-full bg-white shadow-xl overflow-y-auto">

                        {/* Header */}
                        <div className="p-6 border-b flex justify-between items-center bg-gray-100">
                            <h2 className="text-lg font-semibold text-stone-700">
                                {selectedRow ? "Update Control Log Matrix" : "New Control Log Matrix"}
                            </h2>

                            <button
                                className="text-red-500 hover:text-red-600"
                                onClick={() => setShowDrawer(false)}
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        </div>

                        {/* FORM */}
                        <form className="p-6 space-y-6" onSubmit={handleSubmit}>

                            {/* Platform / Category / Model */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                <div>
                                    <label className="block text-sm mb-1">Platform</label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={data.platform}
                                        onChange={(e) =>
                                            setData({ ...data, platform: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Select Platform...</option>
                                        <option value="Turret Based">Turret Based</option>
                                        <option value="Tray Based">Tray Based</option>
                                        <option value="Forming">Forming</option>
                                        <option value="Branding">Branding</option>
                                        <option value="Oven">Oven</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm mb-1">Category</label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={data.category}
                                        onChange={(e) =>
                                            setData({ ...data, category: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Select Category...</option>
                                        <option value="Positive Control Log">Positive Control Log</option>
                                        <option value="Set-Up Control Log">Set-Up Control Log</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm mb-1">Machine Model</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        value={data.machine_model}
                                        onChange={(e) =>
                                            setData({ ...data, machine_model: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            {/* Document Title */}
                            <div>
                                <label className="block text-sm mb-1">Document Title</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    value={data.document_title}
                                    onChange={(e) =>
                                        setData({ ...data, document_title: e.target.value })
                                    }
                                />
                            </div>

                            {/* Upload Section */}
                            <div className="bg-sky-50 border border-sky-200 p-4 rounded space-y-4">

                                {/* File Input */}
                                <div>
                                    <label className="block text-sm mb-1">Upload PDF</label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="w-full border rounded px-3 py-2"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setData({
                                                    ...data,
                                                    pdf_file: file,
                                                    pdf_file_name: file.name.replace(".pdf", "")
                                                });
                                            }
                                        }}
                                        required
                                    />

                                    {data.pdf_file && (
                                        <p className="text-sm text-green-600 mt-2">
                                            Selected File: <strong>{data.pdf_file.name}</strong>
                                        </p>
                                    )}
                                </div>

                                {/* Rename Field */}
                                <div>
                                    <label className="block text-sm mb-1">
                                        Rename PDF File
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        value={data.pdf_file_name}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                pdf_file_name: e.target.value
                                            })
                                        }
                                        required
                                    />
                                </div>

                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                            >
                                <i className="fas fa-save mr-2"></i>
                                {selectedRow ? "Update" : "Save"}
                            </button>

                        </form>
                    </div>
                </div>
            )}

{viewDrawer && selectedRow && (
  <div className="fixed inset-0 z-50 flex">

    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black/40"
      onClick={() => setViewDrawer(false)}
    />

    {/* Drawer */}
    <div className="relative ml-auto w-full max-w-[1500px] h-full bg-white shadow-2xl flex flex-col">

      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-indigo-600">
          <i className="fas fa-sheet-plastic"></i> Control Log Matrix Details
        </h2>
        <button
          className="text-red-500"
          onClick={() => setViewDrawer(false)}
        >
          <i className="fa fa-times"></i>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto flex-1 space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label>Platform:</label>
                <p className="text-stone-600 text-[14pt] font-semibold"><strong>{selectedRow.platform}</strong></p>
            </div>
            <div>
                <label>Category:</label>
                <p className="text-stone-600 text-[14pt] font-semibold"><strong>{selectedRow.category}</strong></p>
            </div>
            <div>
                <label>Document Title:</label>
                <p className="text-stone-600 text-[14pt] font-semibold"><strong>{selectedRow.document_title}</strong></p>
            </div>
            <div>
                <label>Machine Model:</label>
                <p className="text-stone-600 text-[14pt] font-semibold"><strong>{selectedRow.machine_model}</strong></p>
            </div>
        </div>

        {/* PDF Viewer */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-lg text-red-800">{selectedRow.pdf_file_name}</h3>
          <iframe
            src={`/images/tcmatrix/${selectedRow.pdf_file_name}#toolbar=0`}
            className="w-full h-[500px] border rounded"
            title={selectedRow.pdf_file_name}
          ></iframe>
        </div>

      </div>

    </div>
  </div>
)}

        </AuthenticatedLayout>
    );
}
