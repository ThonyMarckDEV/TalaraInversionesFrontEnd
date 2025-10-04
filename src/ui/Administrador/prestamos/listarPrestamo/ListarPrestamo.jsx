import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPrestamos, extornarPrestamo } from 'services/prestamoService'; // 1. Importar el nuevo servicio
import Pagination from 'components/Shared/Pagination';
import LoadingScreen from 'components/Shared/LoadingScreen';
import DetallePrestamoModal from '../components/modals/DetallePrestamoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const ListarPrestamos = () => {
    const [loading, setLoading] = useState(true);
    const [prestamos, setPrestamos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null); // Para los mensajes

    // Estados para filtros y búsqueda
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Estados para ordenamiento
    const [sortBy, setSortBy] = useState('id'); // Por defecto ordenar por ID
    const [sortOrder, setSortOrder] = useState('desc');

    // Estados para el modal de detalles
    const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 3. Nuevos estados para el modal de extorno
    const [prestamoToExtornar, setPrestamoToExtornar] = useState(null);

    // Mapeo de estados para la tabla
    const estadoMap = { 1: 'Vigente', 2: 'Pagado', 3: 'Liquidado', 4: 'Anulado' };
    const estadoColors = { 1: 'text-green-700 bg-green-100', 2: 'text-blue-700 bg-blue-100', 3: 'text-gray-700 bg-gray-100', 4: 'text-red-700 bg-red-100' };

    const fetchPrestamos = useCallback(async ({ page, search, sortBy: sortByParam, sortOrder: sortOrderParam }) => {
        setLoading(true);
        setError(null);
        try {
            // Asumiendo que el servicio getPrestamos soporta parámetros de ordenamiento (sort_by, sort_order)
            const data = await getPrestamos(page, search, sortByParam, sortOrderParam);
            setPrestamos(data.data);
            setPaginationInfo({
                currentPage: data.current_page,
                totalPages: data.last_page,
                totalItems: data.total,
            });
        } catch (err) {
            setError('No se pudieron cargar los préstamos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrestamos({ page: currentPage, search: searchQuery, sortBy, sortOrder });
    }, [currentPage, searchQuery, sortBy, sortOrder, fetchPrestamos]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            setSearchQuery(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSort = useCallback((column) => {
        setCurrentPage(1);
        if (sortBy === column) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    }, [sortBy, sortOrder]);

    const getSortIndicator = (column) => {
        if (sortBy !== column) return null;
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    const isEditable = (fechaGeneracion) => {
        // La fecha de hoy a medianoche
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // La fecha de generación del préstamo a medianoche
        const fechaPrestamo = new Date(fechaGeneracion);
        fechaPrestamo.setHours(0, 0, 0, 0);
        
        // Comparamos los timestamps
        return hoy.getTime() === fechaPrestamo.getTime();
    };

    const handleViewDetails = (prestamoId) => {
        setSelectedPrestamoId(prestamoId);
        setIsModalOpen(true);
    };

    // 4. Funciones para manejar el extorno
    const handleExtornar = (prestamoId) => {
        setPrestamoToExtornar(prestamoId);
    };

    const executeExtornar = async () => {
        if (!prestamoToExtornar) return;

        setLoading(true);
        const id = prestamoToExtornar;
        setPrestamoToExtornar(null); // Cierra el modal

        try {
            const response = await extornarPrestamo(id);
            setAlert({ type: 'success', message: response.message || 'Préstamo extornado con éxito.' });
            // Refrescar la lista para ver el cambio de estado
            fetchPrestamos({ page: currentPage, search: searchQuery, sortBy, sortOrder });
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al extornar el préstamo.' });
            setLoading(false);
        }
    };

    if (loading && prestamos.length === 0) return <LoadingScreen />;
    if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Listado de Préstamos</h1>

            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                onClose={() => setAlert(null)}
            />

            <div className="flex justify-end items-center mb-4">
                <input
                    type="text"
                    placeholder="Buscar por ID de Préstamo o DNI/Nombre de Cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 p-2 border rounded shadow-sm"
                />
            </div>

            {/* 5. Añadir el modal de confirmación para extornar */}
            {prestamoToExtornar && (
                <ConfirmModal
                    message={`¿Estás seguro de que deseas extornar (anular) el préstamo ID: ${prestamoToExtornar}? Esta acción no se puede deshacer.`}
                    onConfirm={executeExtornar}
                    onCancel={() => setPrestamoToExtornar(null)}
                />
            )}

            <div className={`bg-white shadow-md rounded-lg overflow-x-auto transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-100">
                        <tr className="text-left text-gray-600 uppercase text-sm">
                            <th className="px-5 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort('id')}>
                                ID{getSortIndicator('id')}
                            </th>
                            <th className="px-5 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort('cliente')}>
                                Cliente{getSortIndicator('cliente')}
                            </th>
                            <th className="px-5 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort('monto')}>
                                Monto (S/.){getSortIndicator('monto')}
                            </th>
                            <th className="px-5 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort('frecuencia')}>
                                Frecuencia{getSortIndicator('frecuencia')}
                            </th>
                            <th className="px-5 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort('fecha_generacion')}>
                                Fecha Creación{getSortIndicator('fecha_generacion')}
                            </th>
                            <th className="px-5 py-3 cursor-pointer hover:bg-gray-200" onClick={() => handleSort('estado')}>
                                Estado{getSortIndicator('estado')}
                            </th>
                            <th className="px-5 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prestamos.length > 0 ? prestamos.map((p) => (
                            <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm font-semibold">{p.id}</td>
                                <td className="px-5 py-4 text-sm">
                                    <p className="font-bold">
                                        {`${p.cliente?.datos?.nombre || 'Sin'} ${p.cliente?.datos?.apellidoPaterno || 'Nombre'}`}
                                    </p>
                                    <p className="text-gray-500">DNI: {p.cliente?.datos?.dni || 'N/A'}</p>
                                </td>
                                <td className="px-5 py-4 text-sm">{parseFloat(p.monto).toFixed(2)}</td>
                                <td className="px-5 py-4 text-sm">{p.frecuencia}</td>
                                <td className="px-5 py-4 text-sm">{new Date(p.fecha_generacion).toLocaleDateString()}</td>
                                <td className="px-5 py-4 text-sm">
                                    <span className={`px-3 py-1 font-semibold leading-tight rounded-full text-xs ${estadoColors[p.estado] || 'bg-gray-100'}`}>
                                        {estadoMap[p.estado] || 'Desconocido'}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-sm">
                                    {/* 6. Añadir botón "Extornar" con la misma condición de fecha */}
                                    {isEditable(p.fecha_generacion) && (
                                        <>
                                            <Link to={`/admin/editar-prestamo/${p.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold">
                                                Editar
                                            </Link>
                                            <button onClick={() => handleExtornar(p.id)} className="text-red-600 hover:text-red-900 mr-4 font-semibold">
                                                Extornar
                                            </button>
                                        </>
                                    )}
                                    <button onClick={() => handleViewDetails(p.id)} className="text-blue-600 hover:text-blue-900 font-semibold">
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500">No se encontraron préstamos.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={paginationInfo.currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />

            {isModalOpen && (
                <DetallePrestamoModal
                    prestamoId={selectedPrestamoId}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ListarPrestamos;