import { useState } from "react";
import { useData } from "../context/DataContext";
import GastosForm from "../components/GastosForm";

function Gastos() {
  const { gastos, editarGasto, eliminarGasto } = useData();
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);

  const iniciarEdicion = (gasto) => {
    setEditandoId(gasto.id);
    setFormData({ ...gasto });
  };

  const guardarEdicion = () => {
    editarGasto(editandoId, {
      nombre: formData.nombre,
      monto: Number(formData.monto),
      categoria: formData.categoria,
      fecha: formData.fecha,
    });
    setEditandoId(null);
  };

  // 👉 Conversión de fechas
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

  // 🔍 Filtrar gastos por rango de fecha
  const gastosFiltrados = gastos.filter((g) => {
    if (!fechaInicio && !fechaFin) return true;

    // Convertir formato dd/mm/yyyy → yyyy-mm-dd
    const [d, m, y] = g.fecha.split("/");
    const fechaGasto = new Date(`${y}-${m}-${d}`);
    const desde = fechaInicio ? new Date(fechaInicio) : null;
    const hasta = fechaFin ? new Date(fechaFin) : null;

    if (desde && fechaGasto < desde) return false;
    if (hasta && fechaGasto > hasta) return false;
    return true;
  });

  // 🧮 Total filtrado
  const totalFiltrado = gastosFiltrados.reduce((sum, g) => sum + g.monto, 0);

  return (
    <div className="p-6">
      <GastosForm />

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
        Gastos registrados
      </h3>

      <ul className="bg-white shadow rounded p-4 mb-4">
        {gastosFiltrados.length === 0 && (
          <p>No hay gastos registrados en el rango seleccionado.</p>
        )}

        {gastosFiltrados.map((g) => (
          <li
            key={g.id}
            className="border-b py-3 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            {editandoId === g.id ? (
              // 📝 Modo edición
              <div className="w-full md:flex md:items-center md:justify-between gap-2">
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="border p-1 rounded w-32"
                />
                <input
                  type="number"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: e.target.value })
                  }
                  className="border p-1 rounded w-24"
                />
                <input
                  type="text"
                  placeholder="Categoría"
                  value={formData.categoria || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  className="border p-1 rounded w-32"
                />

                {/* 📅 Fecha editable */}
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
                  <span className="font-semibold">{g.nombre}</span> —{" "}
                  <span className="text-green-700">Q{g.monto}</span>
                  {g.categoria && (
                    <span className="text-sm text-gray-500">
                      {" "}
                      ({g.categoria})
                    </span>
                  )}
                  <br />
                  <span className="text-sm text-gray-500">{g.fecha}</span>
                </div>

                <div className="mt-2 md:mt-0 flex gap-2">
                  <button
                    onClick={() => iniciarEdicion(g)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarGasto(g.id)}
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

      <p className="text-right font-bold text-lg text-blue-700">
        Total de gastos: Q{totalFiltrado.toFixed(2)}
      </p>
    </div>
  );
}

export default Gastos;
