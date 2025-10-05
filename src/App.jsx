//import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

//Contextos


//Componentes Globales
import { ToastContainer } from 'react-toastify';

// Layout
import SidebarLayout from 'layouts/SidebarLayout';

// UIS AUTH
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';
import Login from 'ui/auth/Login/Login';

//UI HOME
import Home from 'ui/home/Home';


// UIS ADMIN
import AgregarCliente from 'ui/Administrador/clientes/agregarClientes/AgregarCliente';
import ListarClientes from 'ui/Administrador/clientes/listarClientes/ListarClientes';
import EditarCliente from 'ui/Administrador/clientes/editarCliente/EditarCliente';

import AgregarProducto from 'ui/Administrador/productos/agregarProductos/AgregarProductos';
import ListarProductos from 'ui/Administrador/productos/listarProductos/ListarProductos';

import AgregarEmpleado from 'ui/Administrador/empleados/agregarEmpleados/AgregarEmpleado';
import ListarEmpleados from 'ui/Administrador/empleados/listarEmpleados/ListarEmpleados';
import EditarEmpleado from 'ui/Administrador/empleados/editarEmpleados/EditarEmpleado';

import AgregarPrestamo from 'ui/Administrador/prestamos/agregarPrestamo/AgregarPrestamo';
import ListarPrestamos from 'ui/Administrador/prestamos/listarPrestamo/ListarPrestamo';
import EditarPrestamo from 'ui/Administrador/prestamos/editarPrestamo/EditarPrestamo';

// UIS CLIENTE
import RegistrarPagoCliente from 'ui/Cliente/pagos/RegistrarPago';

//UIS ASESOR

//UIS CAJERO
import RegistrarPago from 'ui/Cajero/pagos/RegistrarPago';


// Utilities
import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
import ProtectedRouteCliente from 'utilities/ProtectedRoutes/ProtectedRouteCliente';
import ProtectedRouteAsesor from 'utilities/ProtectedRoutes/ProtectedRouteAsesor';
import ProtectedRouteAdmin from 'utilities/ProtectedRoutes/ProtectedRouteAdmin';
import ProtectedRouteCajero from 'utilities/ProtectedRoutes/ProtectedRouteCajero';


function AppContent() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/"
        element={<ProtectedRouteHome element={<Login />} />}
      />

      {/* RUTAS ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRouteAdmin element={<SidebarLayout />} />
        }
      >
        {/* Ruta Home (cuando solo pones /admin) */}
        <Route index element={<Home />} />

      {/* RUTAS CLIENTE */}
        {/* Ruta Agregar Cliente */}
        <Route path="agregar-cliente" element={<AgregarCliente />} />
        {/* Ruta Listar Cliente */}
        <Route path="listar-clientes" element={<ListarClientes />} />
        {/* Ruta Editar Cliente */}
        <Route path="editar-cliente/:id" element={<EditarCliente />} />

      {/* RUTAS EMPLEADO */}
        {/* Ruta Agregar Empleado */}
        <Route path="agregar-empleado" element={<AgregarEmpleado />} />
        {/* Ruta Listar Empleado */}
        <Route path="listar-empleados" element={<ListarEmpleados />} />
        {/* Ruta Editar Empleado */}
        <Route path="editar-empleado/:id" element={<EditarEmpleado />} />


      {/* RUTAS PRODUCTO */}
        {/* Ruta Agregar Producto */}
        <Route path="agregar-producto" element={<AgregarProducto />} />
        {/* Ruta Listar Cliente */}
        <Route path="listar-productos" element={<ListarProductos />} />

      {/* RUTAS PRESTAMOS */}
        {/* Ruta Agregar Prestamo */}
        <Route path="agregar-prestamo" element={<AgregarPrestamo />} />
        {/* Ruta Listar Prestamo */}
        <Route path="listar-prestamos" element={<ListarPrestamos />} />
        {/* Ruta Editar Prestamo */}
        <Route path="editar-prestamo/:id" element={<EditarPrestamo />} />

      </Route>



      {/* RUTAS CLIENTE */}
      <Route
        path="/cliente"
        element={
          <ProtectedRouteCliente element={<SidebarLayout />} />
        }
      >
        {/* Ruta Home (cuando solo pones /cliente) */}
        <Route index element={<Home />} />

        <Route path="pagar-prestamo" element={<RegistrarPagoCliente />} />
        

        {/* Aquí agregas más módulos */}

      </Route>


      {/* RUTAS ASESOR */}
      <Route
        path="/asesor"
        element={
          <ProtectedRouteAsesor element={<SidebarLayout />} />
        }
      >
        {/* Ruta Home (cuando solo pones /asesor) */}
        <Route index element={<Home />} />


      </Route>


      {/* RUTAS CAJERO */}
      <Route
        path="/cajero"
        element={
          <ProtectedRouteCajero element={<SidebarLayout />} />
        }
      >
        {/* Ruta Home (cuando solo pones /cajero) */}
        <Route index element={<Home />} />

      {/* RUTAS Pagos */}
        {/* Ruta Registrar Pagos */}
        <Route path="registrar-pago" element={<RegistrarPago/>} />

      </Route>


      {/* Ruta de error */}
      <Route path="/*" element={<ErrorPage404 />} />
      <Route path="/401" element={<ErrorPage401 />} />
    </Routes>
  );
}


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AppContent />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;