import { useRef, useState } from "react";
import { useData } from "../context/DataContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Resumen() {
  const { ventas, gastos } = useData();
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const resumenRef = useRef(null);

  // Convertir dd/mm/yyyy a Date
  const parseFecha = (fechaStr) => {
    const [dia, mes, año] = fechaStr.split("/").map(Number);
    return new Date(año, mes - 1, dia);
  };

  // --- Filtros de fecha ---
  const ventasFiltradas = ventas.filter((v) => {
    if (!fechaInicio && !fechaFin) return true;
    const f = parseFecha(v.fecha);
    if (fechaInicio && f < new Date(fechaInicio)) return false;
    if (fechaFin && f > new Date(fechaFin)) return false;
    return true;
  });

  const gastosFiltrados = gastos.filter((g) => {
    if (!fechaInicio && !fechaFin) return true;
    const f = parseFecha(g.fecha);
    if (fechaInicio && f < new Date(fechaInicio)) return false;
    if (fechaFin && f > new Date(fechaFin)) return false;
    return true;
  });

  // --- Totales ---
  const totalVentas = ventasFiltradas.reduce((s, v) => s + v.total, 0);
  const totalGastos = gastosFiltrados.reduce((s, g) => s + g.monto, 0);
  const ganancia = totalVentas - totalGastos;

  const totalAgua = ventasFiltradas
    .filter((v) => v.producto === "Agua")
    .reduce((s, v) => s + v.total, 0);
  const totalGas = ventasFiltradas
    .filter((v) => v.producto === "Gas")
    .reduce((s, v) => s + v.total, 0);

  // --- Agrupar ventas por fecha ---
  const ventasPorDia = ventasFiltradas.reduce((acc, v) => {
    const fecha = v.fecha;
    if (!acc[fecha]) acc[fecha] = { fecha, ventas: 0, gastos: 0 };
    acc[fecha].ventas += v.total;
    return acc;
  }, {});

  gastosFiltrados.forEach((g) => {
    const fecha = g.fecha;
    if (!ventasPorDia[fecha]) ventasPorDia[fecha] = { fecha, ventas: 0, gastos: 0 };
    ventasPorDia[fecha].gastos += g.monto;
  });

  const dataBarras = Object.values(ventasPorDia).sort(
    (a, b) => parseFecha(a.fecha) - parseFecha(b.fecha)
  );

  // --- Gráfico circular ---
  const dataPie = [
    { name: "Ventas", value: totalVentas },
    { name: "Gastos", value: totalGastos },
  ];
  const COLORS = ["#2563eb", "#ef4444"];

  // --- Exportar PDF ---
  const exportarPDF = async () => {
    const element = resumenRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save("resumen-financiero.pdf");
  };

  return (
    <div className="p-6" ref={resumenRef}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600">Resumen Financiero</h2>
        <button
          onClick={exportarPDF}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 mt-3 md:mt-0"
        >
          📄 Exportar PDF
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded p-4 mb-6 flex flex-col md:flex-row gap-4 justify-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha inicio:
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha fin:
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Ventas</h3>
          <p className="text-2xl font-bold text-green-600">Q{totalVentas}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Gastos</h3>
          <p className="text-2xl font-bold text-red-600">Q{totalGastos}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Ganancia Neta</h3>
          <p
            className={`text-2xl font-bold ${
              ganancia >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            Q{ganancia}
          </p>
        </div>
      </div>

      {/* Detalle por producto */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Ganancias por tipo de producto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div className="border p-3 rounded">
            <h4 className="font-medium text-blue-600">Agua</h4>
            <p className="text-xl font-bold text-green-600">Q{totalAgua}</p>
          </div>
          <div className="border p-3 rounded">
            <h4 className="font-medium text-orange-600">Gas</h4>
            <p className="text-xl font-bold text-green-600">Q{totalGas}</p>
          </div>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">
          Evolución de Ventas y Gastos
        </h3>
        {dataBarras.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataBarras}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip formatter={(v) => `Q${v}`} />
              <Legend />
              <Bar dataKey="ventas" fill="#2563eb" name="Ventas" />
              <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">
            No hay datos disponibles para el rango seleccionado.
          </p>
        )}
      </div>

      {/* Gráfico circular */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">
          Distribución de Ingresos y Gastos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataPie}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {dataPie.map((entry, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `Q${v}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Resumen;
