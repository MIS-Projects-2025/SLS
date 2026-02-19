import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";

import { useState } from "react";

import dayjs from "dayjs";

export default function Admin({ tableData, tableFilters}) {

    const addAgeToData = (data) =>
    data.map((row) => ({
        ...row,
        AGE: dayjs().diff(dayjs(row.BIRTHDAY), "year"),
    }));

    return (
        <AuthenticatedLayout>
            <Head title="All Employees" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Employee</h1>
            </div>

            <DataTable
                columns={[
                    { key: "EMPLOYID", label: "Employee ID" },
                    { key: "PASSWRD", label: "Password" },
                    { key: "EMPNAME", label: "Employee Name" },
                    { key: "BIRTHDAY", label: "Birthday" },
                    { key: "AGE", label: "Age" }, 
                    { key: "JOB_TITLE", label: "Job Title" },
                    { key: "DEPARTMENT", label: "Department" },
                    { key: "ACCSTATUS", label: "Account Status" },
                ]}
                data={addAgeToData(tableData.data)}
                meta={{
                    from: tableData.from,
                    to: tableData.to,
                    total: tableData.total,
                    links: tableData.links,
                    currentPage: tableData.current_page,
                    lastPage: tableData.last_page,
                }}
                routeName={route("employees.index")}
                filters={tableFilters}
                rowKey="EMPLOYID"
                // selectable={true}
                // dateRangeSearch={true}
                showExport={false}
            >
            </DataTable>
        </AuthenticatedLayout>
    );
}
