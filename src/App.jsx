import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Ventas from "./pages/Ventas";
import Gastos from "./pages/Gastos";
import Clientes from "./pages/Clientes";
import Resumen from "./pages/Resumen";
import Home from "./pages/Home"; // si tienes una página inicial
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/gastos" element={<Gastos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/resumen" element={<Resumen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
