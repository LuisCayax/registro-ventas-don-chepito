import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <ul className="flex justify-center gap-6 font-semibold">
        <li><Link to="/">Ventas</Link></li>
        <li><Link to="/gastos">Gastos</Link></li>
        <li><Link to="/clientes">Clientes</Link></li>
        <li><Link to="/resumen">Resumen</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
