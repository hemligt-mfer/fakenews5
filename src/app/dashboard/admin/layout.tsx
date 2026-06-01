import AdminNavbar from "./_components/admin-navbar";


export default function DashboardLayout({children}: {children : React.ReactNode}){
    return (
        <div className="w-full">
            <AdminNavbar/>
            <div>{children}</div>
        </div>
    )
}