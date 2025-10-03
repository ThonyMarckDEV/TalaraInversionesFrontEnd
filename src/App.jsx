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


// UIS CLIENTE


//UIS ASESOR


// Utilities
import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
import ProtectedRouteCliente from 'utilities/ProtectedRoutes/ProtectedRouteCliente';
import ProtectedRouteAsesor from 'utilities/ProtectedRoutes/ProtectedRouteAsesor';
import ProtectedRouteAdmin from 'utilities/ProtectedRoutes/ProtectedRouteAdmin';


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

        {/* Ruta Agregar Cliente */}
        <Route path="agregar-cliente" element={<AgregarCliente />} />

      

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