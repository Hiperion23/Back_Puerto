import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { Login } from "./components/Auth/Login";
import { AdminLayout } from "./components/Layout/AdminLayout";

import { PlatosList } from "./components/Platos/PlatosList";
import { PlatoForm } from "./components/Platos/PlatoForm";

import { Configuracion } from "./components/Catalogo/Configuracion";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="platos" replace />} />
        <Route path="platos" element={<PlatosList />} />
        <Route path="platos/nuevo" element={<PlatoForm />} />
        <Route path="platos/:id/editar" element={<PlatoForm />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/admin" replace />}
      />
    </Routes>
  );
}
export default App;