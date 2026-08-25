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
import Inicio from "@/admin/pages/Inicio";
import HeroEditar from "@/admin/pages/HeroEditar";
import LookbookEditar from "@/admin/pages/LookbookEditar";
import Redes from "@/admin/pages/Redes";
import Configuracion from "@/admin/pages/Configuracion";
import PoliticaPrivacidad from "@/pages/PoliticaPrivacidad";
import { AuthProvider } from "@/lib/auth";
import { DatosProvider } from "@/lib/datos";

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

        {/* Página legal, sin enlace desde el sitio: se llega solo por la URL.
            Va dentro de DatosProvider para que el WhatsApp y la ubicación que
            muestra sean los que estén cargados en el panel. */}
        <Route
          path="/politicadeprivacidad"
          element={
            <DatosProvider>
              <PoliticaPrivacidad />
            </DatosProvider>
          }
        />

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
            <Route path="inicio" element={<Inicio />} />
            <Route path="hero" element={<HeroEditar />} />
            <Route path="lookbook" element={<LookbookEditar />} />
            <Route path="redes" element={<Redes />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Route>

        {/* Cualquier otra ruta vuelve a la tienda. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
