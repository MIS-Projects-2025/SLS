import Dropdown from "@/Components/sidebar/Dropdown";
import SidebarLink from "@/Components/sidebar/SidebarLink";
import { usePage } from "@inertiajs/react";

export default function NavLinks() {
    const { emp_data } = usePage().props;
    return (
        <nav
            className="flex flex-col flex-grow space-y-1 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
        >
            <SidebarLink
                href={route("dashboard")}
                label="Dashboard"
                icon={<i className="fa-solid fa-gauge-high"></i>}
            />
            {!["Quality Assurance", "Process Engineering", "Quality Management System"].includes(emp_data?.emp_dept) && (
            <div>
            <SidebarLink
                href={route("setup-new.checklist.index")}
                label="TCM Logsheets"
                icon={<i className="fa-solid fa-clipboard"></i>}
            />
            
            <SidebarLink
                href={route("go.vision.index")}
                label="Go-No-Go Vision"
                icon={<i className="fa-solid fa-bullseye"></i>}
            />

            <SidebarLink
                href={route("vision.corelation.index")}
                label="Vision Correllation"
                icon={<i className="fa-solid fa-arrows-to-eye"></i>}
            />

           
            </div>
            )}

            

            {["Quality Assurance", "Quality Management System"].includes(emp_data?.emp_dept) && (
            <div>
            
            <SidebarLink
                href={route("qa-go.vision.index")}
                label="Go-No-Go Vision"
                icon={<i className="fa-solid fa-bullseye"></i>}
            />
            </div>
            )}

            {["Quality Assurance", "Process Engineering", "Quality Management System"].includes(emp_data?.emp_dept) && (
            <div>
            
            <SidebarLink
                href={route("setup.logsheet.qape.index")}
                label="TCM Logsheets"
                icon={<i className="fa-solid fa-clipboard"></i>}
            />
            </div>
            )}

             {["Equipment Engineering", "Process Engineering"].includes(emp_data?.emp_dept) && (
            <div>
            <SidebarLink
                href={route("matrix.controllog.index")}
                label="Controll Log Matrix"
                icon={<i className="fa-solid fa-diagram-project"></i>}
            />
            </div>
            )}
            
            {["superadmin", "admin"].includes(emp_data?.emp_role) && (
            <div>

            <Dropdown
                label="Maintenance"
                icon={<i className="fa-solid fa-bars-progress"></i>}
                links={[
                    {
                        href: route("setup.checklist.index"),
                        label: "Setup Check Items",
                        notification: false,
                    },
                    {
                       href: route("positive.checklist.index"),
                        label: "Positive Check Items",
                        notification: false,
                    }
                ]}
            />
                    <SidebarLink
                        href={route("admin")}
                        label="Administrators"
                        icon={<i className="fa-solid fa-users-between-lines"></i>}
                    />
                </div>
            )}
        </nav>
    );
}
