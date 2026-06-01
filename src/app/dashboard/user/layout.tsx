import UserNavbar from "./_components/user-navbar";


export default function DashboardLayout({children}: {children : React.ReactNode}){
    return (
        <div className="w-full">
            <UserNavbar/>
            <div>{children}</div>
        </div>
    )
}