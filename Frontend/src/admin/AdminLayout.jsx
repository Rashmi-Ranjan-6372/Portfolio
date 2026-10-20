
import { Outlet, Navigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

function AdminLayout() {
    const accessToken = localStorage.getItem('access')

    if (!accessToken) {
        return <Navigate to="/admin/login" replace />
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white md:flex">
            <AdminSidebar />

            <main className="min-w-0 flex-1 p-5 sm:p-8">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
