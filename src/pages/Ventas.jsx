import { useState } from "react";
import { useData } from "../context/DataContext";
import VentasForm from "../components/VentasForm";

function Ventas() {
  const { ventas, clientes, editarVenta, eliminarVenta } = useData();
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const getClienteNombre = (id) => {
    const cliente = clientes.find((c) => c.id === id);
    return cliente ? cliente.nombre : "Sin cliente";
  };

  const iniciarEdicion = (venta) => {
    setEditandoId(venta.id);
    setFormData({ ...venta });
  };

  const guardarEdicion = () => {
    editarVenta(editandoId, {
      producto: formData.producto,
      cantidad: Number(formData.cantidad),
      precioUnitario: Number(formData.precioUnitario),
      total: Number(formData.cantidad) * Number(formData.precioUnitario),
      clienteId: Number(formData.clienteId),
      fecha: formData.fecha,
    });
    setEditandoId(null);
  };

  // 👉 Convertir dd/mm/yyyy ↔ yyyy-mm-dd
  const convertirFechaAInput = (fecha) => {
    if (!fecha) return "";
    if (fecha.includes("/")) {
      const [d, m, y] = fecha.split("/");
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    return fecha;
  };

  const convertirFechaAMostrar = (fecha) => {
    if (!fecha) return "";
    if (fecha.includes("-")) {
      const [y, m, d] = fecha.split("-");
      return `${d}/${m}/${y}`;
    }
    return fecha;
  };

  // 🔍 Filtrado por fecha
  const ventasFiltradas = ventas.filter((v) => {
    if (!fechaInicio && !fechaFin) return true;

    // Convertir fecha de la venta (dd/mm/yyyy → yyyy-mm-dd)
    const [d, m, y] = v.fecha.split("/");
    const fechaVenta = new Date(`${y}-${m}-${d}`);
    const desde = fechaInicio ? new Date(fechaInicio) : null;
    const hasta = fechaFin ? new Date(fechaFin) : null;

    if (desde && fechaVenta < desde) return false;
    if (hasta && fechaVenta > hasta) return false;
    return true;
  });

  return (
    <div className="p-6">
      <VentasForm />

      {/* 🗓️ Filtro de fechas */}
      <div className="flex flex-col md:flex-row gap-2 items-center mb-4 mt-6">
        <label className="font-semibold text-gray-600">Filtrar por fecha:</label>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border p-1 rounded"
          />
          <span className="text-gray-500">a</span>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
        {(fechaInicio || fechaFin) && (
          <button
            onClick={() => {
              setFechaInicio("");
              setFechaFin("");
            }}
            className="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300"
          >
            Limpiar
          </button>
        )}
      </div>

      <h3 className="text-xl font-semibold mb-2 text-blue-600">
        Ventas registradas
      </h3>

      <ul className="bg-white shadow rounded p-4">
        {ventasFiltradas.length === 0 && (
          <p>No hay ventas registradas en el rango seleccionado.</p>
        )}

        {ventasFiltradas.map((v) => (
          <li
            key={v.id}
            className="border-b py-3 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            {editandoId === v.id ? (
              // 📝 Modo edición
              <div className="w-full md:flex md:items-center md:justify-between gap-2">
                <input
                  type="text"
                  value={formData.producto}
                  onChange={(e) =>
                    setFormData({ ...formData, producto: e.target.value })
                  }
                  className="border p-1 rounded w-24"
                />
                <input
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) =>
                    setFormData({ ...formData, cantidad: e.target.value })
                  }
                  className="border p-1 rounded w-20"
                />
                <input
                  type="number"
                  value={formData.precioUnitario}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      precioUnitario: e.target.value,
                    })
                  }
                  className="border p-1 rounded w-24"
                />
                <select
                  value={formData.clienteId}
                  onChange={(e) =>
                    setFormData({ ...formData, clienteId: e.target.value })
                  }
                  className="border p-1 rounded"
                >
                  <option value="">Sin cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>

                {/* 📅 Campo editable de fecha */}
                <input
                  type="date"
                  value={convertirFechaAInput(formData.fecha)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha: convertirFechaAMostrar(e.target.value),
                    })
                  }
                  className="border p-1 rounded w-36"
                />

                <button
                  onClick={guardarEdicion}
                  className="bg-green-600 text-white px-2 py-1 rounded ml-2"
                >
                  💾 Guardar
                </button>
                <button
                  onClick={() => setEditandoId(null)}
                  className="bg-gray-400 text-white px-2 py-1 rounded ml-1"
                >
                  ❌ Cancelar
                </button>
              </div>
            ) : (
              // 🔍 Vista normal
              <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                <div>
                  <span className="font-semibold">{v.producto}</span> —{" "}
                  {v.cantidad} × Q{v.precioUnitario} ={" "}
                  <span className="font-bold text-green-600">Q{v.total}</span>
                  <br />
                  <span className="text-sm text-gray-500">
                    Cliente: {getClienteNombre(v.clienteId)} | {v.fecha}
                  </span>
                </div>

                <div className="mt-2 md:mt-0 flex gap-2">
                  <button
                    onClick={() => iniciarEdicion(v)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarVenta(v.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ventas;
