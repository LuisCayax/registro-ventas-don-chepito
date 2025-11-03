import { useState } from "react";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";

function VentasForm() {
  const { clientes, agregarVenta } = useData();
  const navigate = useNavigate();

  const [producto, setProducto] = useState("Agua");
  const [cantidad, setCantidad] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [clienteFiltro, setClienteFiltro] = useState("");
  const [clienteId, setClienteId] = useState("");

  // Filtrar clientes por nombre o teléfono
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(clienteFiltro.toLowerCase()) ||
      c.telefono?.includes(clienteFiltro)
  );

  const total = cantidad && precioUnitario ? cantidad * precioUnitario : 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cantidad || !precioUnitario) {
      return alert("Completa todos los campos de la venta");
    }

    const venta = {
      producto,
      cantidad: Number(cantidad),
      precioUnitario: Number(precioUnitario),
      total,
      clienteId: clienteId ? Number(clienteId) : null,
      fecha: new Date().toLocaleDateString(),
    };

    agregarVenta(venta);

    // Limpiar campos
    setCantidad("");
    setPrecioUnitario("");
    setClienteFiltro("");
    setClienteId("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md max-w-md mx-auto"
    >
      <h3 className="text-xl font-semibold mb-3 text-blue-600">
        Nueva Venta
      </h3>

      {/* Producto */}
      <label className="block mb-1 font-medium">Producto</label>
      <select
        value={producto}
        onChange={(e) => setProducto(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      >
        <option value="Agua">Agua</option>
        <option value="Gas">Gas</option>
      </select>

      {/* Cantidad */}
      <label className="block mb-1 font-medium">Cantidad</label>
      <input
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      {/* Precio unitario */}
      <label className="block mb-1 font-medium">Precio Unitario (Q)</label>
      <input
        type="number"
        min="0"
        value={precioUnitario}
        onChange={(e) => setPrecioUnitario(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      {/* Cliente con búsqueda */}
      <label className="block mb-1 font-medium">Cliente</label>
      <input
        type="text"
        placeholder="Buscar cliente por nombre o teléfono..."
        value={clienteFiltro}
        onChange={(e) => {
          setClienteFiltro(e.target.value);
          setClienteId("");
        }}
        className="border p-2 w-full mb-2 rounded"
      />

      {/* Lista filtrada */}
      {clienteFiltro && clientesFiltrados.length > 0 && (
        <ul className="border rounded bg-white mb-2 max-h-40 overflow-y-auto">
          {clientesFiltrados.map((c) => (
            <li
              key={c.id}
              onClick={() => {
                setClienteId(c.id);
                setClienteFiltro(c.nombre);
              }}
              className={`p-2 cursor-pointer hover:bg-blue-100 ${
                clienteId === c.id ? "bg-blue-200" : ""
              }`}
            >
              {c.nombre} <span className="text-sm text-gray-500">({c.telefono || "sin teléfono"})</span>
            </li>
          ))}
        </ul>
      )}

      {/* Sin resultados */}
      {clienteFiltro && clientesFiltrados.length === 0 && (
        <p className="text-sm text-gray-500 mb-2">No se encontraron clientes.</p>
      )}

      {/* Enlace para agregar nuevo */}
      <button
        type="button"
        onClick={() => navigate("/clientes")}
        className="text-sm text-blue-600 underline mb-3"
      >
        + Agregar nuevo cliente
      </button>

      {/* Total */}
      <p className="text-right text-gray-700 mb-2">
        Total: <span className="font-bold text-green-600">Q{total}</span>
      </p>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Guardar Venta
      </button>
    </form>
  );
}

export default VentasForm;
