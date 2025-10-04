import React, { useState, useEffect, useCallback } from 'react';
import { getEmpleados, toggleEmpleadoEstado } from 'services/empleadoService'; 
import Pagination from 'components/Shared/Pagination';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { Link } from 'react-router-dom';

import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';

const ListarEmpleados = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [alert, setAlert] = useState(null);
    const [empleadoToToggle, setEmpleadoToToggle] = useState(null);

    const [empleados, setEmpleados] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0 
    });
    
    // Estados para filtros
    const [currentPage, setCurrentPage] = useState(1);
    const [rolFilter, setRolFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // Usado para el debounce

    // Mapeo de roles para la tabla
    const roleMap = { 3: 'Asesor', 4: 'Cajero' };

    // Función de búsqueda estabilizada con useCallback
    const fetchEmpleados = useCallback(async (page, rol, search) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEmpleados(page, rol, search);

            setEmpleados(data.data);
            setPaginationInfo({
                currentPage: data.current_page,
                totalPages: data.last_page,
                totalItems: data.total,
            });
        } catch (err) {
            setError('No se pudieron cargar los empleados. Por favor, intente de nuevo más tarde.');
            console.error(err);
        } finally {
            setLoading(false);
            if (isInitialLoad) setIsInitialLoad(false); 
        }
    }, [isInitialLoad]); 

    // useEffect para filtros y paginación
    useEffect(() => {
        fetchEmpleados(currentPage, rolFilter, searchQuery);
    }, [currentPage, rolFilter, searchQuery, fetchEmpleados]);

    // Debounce para la búsqueda
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setCurrentPage(1); // Resetear a la página 1 al buscar
            setSearchQuery(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (e) => {
        const newRol = e.target.value;
        setRolFilter(newRol);
        setCurrentPage(1);
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleToggleEstado = (empleadoId, currentEstado) => {
        setEmpleadoToToggle({ id: empleadoId, estado: currentEstado });
    };

    const executeToggleEstado = async () => {
        if (!empleadoToToggle) return;

        const { id } = empleadoToToggle;
        
        setEmpleadoToToggle(null);
        setLoading(true);

        try {
            // toggleEmpleadoEstado se encarga de cambiar el estado en el backend
            const response = await toggleEmpleadoEstado(id);
            setAlert(response);
            await fetchEmpleados(currentPage, rolFilter, searchQuery);
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            setAlert(err); 
            setLoading(false);
        }
    };

    if (isInitialLoad && loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Listado de Empleados</h1>

            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />
            
            <div className="flex justify-between items-center mb-4 space-x-4">
                {/* Filtro de Rol */}
                <select
                    value={rolFilter}
                    onChange={handleFilterChange}
                    className="p-2 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Todos los Roles</option>
                    <option value={3}>Asesor</option>
                    <option value={4}>Cajero</option>
                </select>
                
                {/* Barra de Búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar por DNI, nombre o apellido..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-grow p-2 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            {/* Modal de Confirmación */}
            {empleadoToToggle && (
                <ConfirmModal
                    message={`¿Desea cambiar el estado de este empleado a ${empleadoToToggle.estado === 1 ? 'INACTIVO' : 'ACTIVO'}?`}
                    onConfirm={executeToggleEstado}
                    onCancel={() => setEmpleadoToToggle(null)}
                />
            )}
            
            <div className={`bg-white shadow-md rounded-lg overflow-hidden transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                            <th className="px-5 py-3">DNI</th>
                            <th className="px-5 py-3">Nombre Completo</th>
                            <th className="px-5 py-3">Rol</th>
                            <th className="px-5 py-3">Estado</th>
                            <th className="px-5 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empleados.length > 0 ? (
                            empleados.map((empleado) => (
                            <tr key={empleado.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm">{empleado.datos.dni}</td>
                                <td className="px-5 py-4 text-sm">
                                {`${empleado.datos.nombre} ${empleado.datos.apellidoPaterno} ${empleado.datos.apellidoMaterno}`}
                                </td>
                                <td className="px-5 py-4 text-sm">
                                {roleMap[empleado.id_Rol] || 'N/A'}
                                </td>
                                
                                <td className="px-5 py-4 text-sm">
                                    <button 
                                        onClick={() => handleToggleEstado(empleado.id, empleado.estado)}
                                        disabled={loading}
                                        className={`px-3 py-1 font-semibold leading-tight rounded-full text-sm transition-colors duration-150 ${
                                            empleado.estado === 1
                                                ? 'text-green-700 bg-green-100 hover:bg-red-100 hover:text-red-700'
                                                : 'text-red-700 bg-red-100 hover:bg-green-100 hover:text-green-700'
                                        }`}
                                    >
                                        {empleado.estado === 1 ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                                
                                <td className="px-5 py-4 text-sm">
                                    <Link 
                                        to={`/admin/editar-empleado/${empleado.id}`} 
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500">
                                    No se encontraron empleados con los filtros aplicados.
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

export default ListarEmpleados;