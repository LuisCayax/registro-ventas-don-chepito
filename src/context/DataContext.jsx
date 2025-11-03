import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export function DataProvider({ children }) {
  // Función segura para leer localStorage
  const getLocalData = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error leyendo ${key} desde localStorage`, error);
      return [];
    }
  };

  // Estado inicial cargado desde localStorage
  const [ventas, setVentas] = useState(() => getLocalData("ventas"));
  const [gastos, setGastos] = useState(() => getLocalData("gastos"));
  const [clientes, setClientes] = useState(() => getLocalData("clientes"));

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }, [ventas]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);

  // 🧾 --- Funciones para VENTAS ---
  const agregarVenta = (venta) => {
    setVentas((prev) => [...prev, { id: Date.now(), ...venta }]);
    toast.success("Venta registrada correctamente");
  };

  const editarVenta = (id, nuevosDatos) => {
    setVentas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...nuevosDatos } : v))
    );
    toast.success("✏️ Venta actualizada");
  };

  const eliminarVenta = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta venta?")) {
      setVentas((prev) => prev.filter((v) => v.id !== id));
      toast.error("🗑️ Venta eliminada");
    }
  };

  // 💸 --- Funciones para GASTOS ---
  const agregarGasto = (gasto) => {
    setGastos((prev) => [...prev, { id: Date.now(), ...gasto }]);
    toast.success("💸 Gasto agregado");
  };

  const editarGasto = (id, nuevosDatos) => {
    setGastos((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...nuevosDatos } : g))
    );
    toast.success("✏️ Gasto actualizado");
  };

  const eliminarGasto = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este gasto?")) {
      setGastos((prev) => prev.filter((g) => g.id !== id));
      toast.error("🗑️ Gasto eliminado");
    }
  };

  // 👤 --- Funciones para CLIENTES ---
  const agregarCliente = (cliente) => {
    setClientes((prev) => [...prev, { id: Date.now(), ...cliente }]);
    toast.success("👤 Cliente agregado");
  };

  const editarCliente = (id, nuevosDatos) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...nuevosDatos } : c))
    );
    toast.success("✏️ Cliente actualizado");
  };

  const eliminarCliente = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      setClientes((prev) => prev.filter((c) => c.id !== id));
      toast.error("🗑️ Cliente eliminado");
    }
  };

  return (
    <DataContext.Provider
      value={{
        ventas,
        gastos,
        clientes,
        agregarVenta,
        editarVenta,
        eliminarVenta,
        agregarGasto,
        editarGasto,
        eliminarGasto,
        agregarCliente,
        editarCliente,
        eliminarCliente,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
