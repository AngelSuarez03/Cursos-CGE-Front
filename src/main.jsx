import './index.css';
import Principal from './Principal/Principal.jsx';
import Login from './Login/Login.jsx';
import AdminPrincipal from './RegistroCursos/AdminPrincipal.jsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {  createBrowserRouter, RouterProvider} from "react-router-dom";
import ConsultaRegistros from './Componentes/ConsultaRegistros.jsx';
import CatalogoCursos from './Componentes/CatalogoCursos.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import { AuthProvider } from './routes/AuthContext.jsx'; 

const router = createBrowserRouter([
  { path: "/", element: <Principal /> },
  { path: "/Login", element: <Login /> },
  {
    path: "/RegistroCurso",
    element: (
      <ProtectedRoute>
        <AdminPrincipal />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ConsultaRegistros",
    element: (
      <ProtectedRoute>
        <ConsultaRegistros />
      </ProtectedRoute>
    ),
  },
  {
    path: "/CatalogoCursos",
    element: (
      <ProtectedRoute>
        <CatalogoCursos />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);