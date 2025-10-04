// src/pages/Prestamos/ListarPrestamos.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPrestamos } from 'services/prestamoService';
import Pagination from 'components/Shared/Pagination';
import LoadingScreen from 'components/Shared/LoadingScreen';
import DetallePrestamoModal from '../components/modals/DetallePrestamoModal';

const ListarPrestamos = () => {
    const [loading, setLoading] = useState(true);
    const [prestamos, setPrestamos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [error, setError] = useState(null);

    // Estados para filtros y búsqueda
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // Para el debounce

    // Estados para el modal
    const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mapeo de estados para la tabla
    const estadoMap = { 1: 'Vigente', 2: 'Pagado', 3: 'Liquidado', 4: 'Anulado' };
    const estadoColors = { 1: 'text-green-700 bg-green-100', 2: 'text-blue-700 bg-blue-100', 3: 'text-gray-700 bg-gray-100', 4: 'text-red-700 bg-red-100' };

    const fetchPrestamos = useCallback(async (page, search) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPrestamos(page, search);
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
        fetchPrestamos(currentPage, searchQuery);
    }, [currentPage, searchQuery, fetchPrestamos]);

    // Debounce para la búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            setSearchQuery(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Lógica para mostrar el botón de Editar
    const isEditable = (fechaGeneracion) => {
        const hoy = new Date();
        const fechaPrestamo = new Date(fechaGeneracion);
        return hoy.toDateString() === fechaPrestamo.toDateString();
    };

    const handleViewDetails = (prestamoId) => {
        setSelectedPrestamoId(prestamoId);
        setIsModalOpen(true);
    };

    if (loading && prestamos.length === 0) return <LoadingScreen />;
    if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Listado de Préstamos</h1>

            <div className="flex justify-end items-center mb-4">
                <input
                    type="text"
                    placeholder="Buscar por ID de Préstamo o DNI/Nombre de Cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 p-2 border rounded shadow-sm"
                />
            </div>

            <div className={`bg-white shadow-md rounded-lg overflow-x-auto transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-100">
                        <tr className="text-left text-gray-600 uppercase text-sm">
                            <th className="px-5 py-3">ID</th>
                            <th className="px-5 py-3">Cliente</th>
                            <th className="px-5 py-3">Monto (S/.)</th>
                            <th className="px-5 py-3">Frecuencia</th>
                            <th className="px-5 py-3">Fecha Creación</th>
                            <th className="px-5 py-3">Estado</th>
                            <th className="px-5 py-3">Acciones</th>
                        </tr>
                    </thead>
                   <tbody>
                        {prestamos.length > 0 ? prestamos.map((p) => (
                            <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm font-semibold">{p.id}</td>
                                <td className="px-5 py-4 text-sm">
                                    {/* Usando encadenamiento opcional para máxima seguridad */}
                                    <p className="font-bold">
                                        {`${p.cliente?.datos?.nombre || 'Sin'} ${p.cliente?.datos?.apellidoPaterno || 'Nombre'}`}
                                    </p>
                                    <p className="text-gray-500">
                                        DNI: {p.cliente?.datos?.dni || 'N/A'}
                                    </p>
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
                                    {isEditable(p.fecha_generacion) && (
                                        <Link to={`/admin/editar-prestamo/${p.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold">
                                            Editar
                                        </Link>
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