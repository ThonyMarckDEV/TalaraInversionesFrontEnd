// src/pages/clientes/ListarCliente.jsx
import React, { useState, useEffect } from 'react';
import { getClientes } from 'services/clienteService';
import Pagination from '../components/Pagination';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { Link } from 'react-router-dom';

const ListarCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // <-- NUEVO ESTADO para carga inicial

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getClientes(currentPage);
        setClientes(data.data);
        setPaginationInfo({
          currentPage: data.current_page,
          totalPages: data.last_page,
          totalItems: data.total,
        });
      } catch (err) {
        setError('No se pudieron cargar los clientes. Por favor, intente de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
        setIsInitialLoad(false); // <-- Marcamos que la carga inicial ya pasó
      }
    };

    fetchClientes();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // === CAMBIO: Usamos LoadingScreen solo en la carga inicial ===
  if (isInitialLoad && loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Listado de Clientes</h1>
      
      {/* === CAMBIO: El contenedor de la tabla ahora maneja un efecto de opacidad durante la carga === */}
      <div className={`bg-white shadow-md rounded-lg overflow-hidden transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-5 py-3">DNI</th>
              <th className="px-5 py-3">Nombre Completo</th>
              <th className="px-5 py-3">Fecha de Registro</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
                clientes.map((cliente) => (
                <tr key={cliente.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm">{cliente.datos.dni}</td>
                    <td className="px-5 py-4 text-sm">
                    {`${cliente.datos.nombre} ${cliente.datos.apellidoPaterno} ${cliente.datos.apellidoMaterno}`}
                    </td>
                    <td className="px-5 py-4 text-sm">
                    {new Date(cliente.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-sm">
                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                        cliente.estado === 1
                            ? 'text-green-700 bg-green-100'
                            : 'text-red-700 bg-red-100'
                        }`}>
                        {cliente.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <Link 
                        to={`/admin/editar-cliente/${cliente.id}`} 
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </Link>
                      <button className="text-red-600 hover:text-red-900">Ver</button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                        No se encontraron clientes.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={paginationInfo.currentPage}
        totalPages={paginationInfo.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ListarCliente;