import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import ProtectedAdminRoute from "@/admin/components/ProtectedAdminRoute";
import { ToastProvider } from "@/admin/components/Toasts";
import AdminLayout from "@/admin/layouts/AdminLayout";
import Dashboard from "@/admin/pages/Dashboard";
import Login from "@/admin/pages/Login";
import Productos from "@/admin/pages/Productos";
import ProductoEditar from "@/admin/pages/ProductoEditar";
import Categorias from "@/admin/pages/Categorias";
import Lineas from "@/admin/pages/Lineas";
import { AuthProvider } from "@/lib/auth";

/**
 * `/` sigue siendo la tienda tal cual estaba: una sola página con anclas,
 * catálogo por estado, carrito y favoritos. El router solo agrega `/admin`.
 *
 * AuthProvider envuelve únicamente el subárbol del panel, para no sumarle una
 * verificación de sesión a cada visita pública.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route
          path="/admin/login"
          element={
            <AuthProvider>
              <Login />
            </AuthProvider>
          }
        />

        <Route
          path="/admin"
          element={
            <AuthProvider>
              <ToastProvider>
                <ProtectedAdminRoute />
              </ToastProvider>
            </AuthProvider>
          }
        >
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/nuevo" element={<ProductoEditar />} />
            <Route path="productos/:slug" element={<ProductoEditar />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="lineas" element={<Lineas />} />
          </Route>
        </Route>

        {/* Cualquier otra ruta vuelve a la tienda. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
