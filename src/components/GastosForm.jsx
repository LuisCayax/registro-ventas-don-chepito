import { useState } from "react";
import { useData } from "../context/DataContext";

function GastosForm() {
  const { agregarGasto } = useData();
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !monto) {
      return alert("Por favor, completa todos los campos requeridos.");
    }

    const gasto = {
      nombre,
      categoria,
      monto: Number(monto),
      fecha: new Date().toLocaleDateString(),
    };

    agregarGasto(gasto);

    // limpiar formulario
    setNombre("");
    setCategoria("");
    setMonto("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md max-w-md mx-auto"
    >
      <h3 className="text-xl font-semibold mb-3 text-blue-600">
        Nuevo Gasto
      </h3>

      {/* Nombre libre del gasto */}
      <label className="block mb-1 font-medium">Nombre del gasto</label>
      <input
        type="text"
        placeholder="Ejemplo: Gasolina camioneta, mantenimiento, etc."
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      {/* Categoría general (opcional) */}
      <label className="block mb-1 font-medium">Categoría (opcional)</label>
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      >
        <option value="">-- Seleccionar categoría --</option>
        <option value="Gasolina">Gasolina</option>
        <option value="Mantenimiento">Mantenimiento</option>
        <option value="Insumos">Insumos</option>
        <option value="Otros">Otros</option>
      </select>

      {/* Monto */}
      <label className="block mb-1 font-medium">Monto (Q)</label>
      <input
        type="number"
        min="0"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Guardar Gasto
      </button>
    </form>
  );
}

export default GastosForm;
