import { useState } from "react";
import { useData } from "../context/DataContext";
import ClientesForm from "../components/ClientesForm";

function Clientes() {
  const { clientes, editarCliente, eliminarCliente } = useData();
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});

  const iniciarEdicion = (cliente) => {
    setEditandoId(cliente.id);
    setFormData({ ...cliente });
  };

  const guardarEdicion = () => {
    editarCliente(editandoId, {
      nombre: formData.nombre,
      telefono: formData.telefono,
      direccion: formData.direccion,
    });
    setEditandoId(null);
  };

  return (
    <div className="p-6">
      <ClientesForm />

      <h3 className="text-xl font-semibold mt-6 mb-2 text-blue-600">
        Clientes registrados
      </h3>

      <ul className="bg-white shadow rounded p-4 mb-4">
        {clientes.length === 0 && <p>No hay clientes registrados.</p>}

        {clientes.map((c) => (
          <li
            key={c.id}
            className="border-b py-3 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            {editandoId === c.id ? (
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
                  type="text"
                  value={formData.telefono || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  className="border p-1 rounded w-32"
                />
                <input
                  type="text"
                  value={formData.direccion || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  className="border p-1 rounded w-48"
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
                  <span className="font-semibold">{c.nombre}</span>
                  {c.telefono && (
                    <span className="text-sm text-gray-500">
                      {" "}
                      | 📞 {c.telefono}
                    </span>
                  )}
                  {c.direccion && (
                    <div className="text-sm text-gray-500">
                      📍 {c.direccion}
                    </div>
                  )}
                </div>

                <div className="mt-2 md:mt-0 flex gap-2">
                  <button
                    onClick={() => iniciarEdicion(c)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarCliente(c.id)}
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

export default Clientes;
