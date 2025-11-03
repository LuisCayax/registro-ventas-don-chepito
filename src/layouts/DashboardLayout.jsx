import { NavLink, Outlet } from "react-router-dom";

function DashboardLayout() {
  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col justify-between">
        <div>
          <div className="p-4 text-2xl font-bold text-blue-600 text-center border-b">
            Don Chepito 💧🔥
          </div>
          <nav className="mt-4 space-y-1">
            <NavLink to="/" className={navLinkClass} end>
              🏠 Inicio
            </NavLink>
            <NavLink to="/ventas" className={navLinkClass}>
              🧾 Ventas
            </NavLink>
            <NavLink to="/gastos" className={navLinkClass}>
              💸 Gastos
            </NavLink>
            <NavLink to="/clientes" className={navLinkClass}>
              👤 Clientes
            </NavLink>
            <NavLink to="/resumen" className={navLinkClass}>
              📊 Resumen
            </NavLink>
          </nav>
        </div>
        <div className="text-center text-gray-500 text-sm p-3 border-t">
          v1.0 © 2025
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="md:hidden bg-blue-600 text-white p-3 text-center font-semibold">
          Don Chepito 💧🔥
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
