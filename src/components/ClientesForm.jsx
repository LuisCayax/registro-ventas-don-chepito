import { useState } from "react";
import { useData } from "../context/DataContext";

function ClientesForm() {
  const { agregarCliente } = useData();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert("El nombre es obligatorio");

    agregarCliente({
      nombre,
      telefono,
      direccion,
      fechaRegistro: new Date().toLocaleDateString(),
    });

    setNombre("");
    setTelefono("");
    setDireccion("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md max-w-md mx-auto"
    >
      <h3 className="text-xl font-semibold mb-3 text-blue-600">Nuevo Cliente</h3>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      <input
        type="text"
        placeholder="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Guardar Cliente
      </button>
    </form>
  );
}

export default ClientesForm;
