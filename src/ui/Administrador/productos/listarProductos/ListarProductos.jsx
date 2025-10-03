// src/pages/productos/ListarProductos.jsx

import React, { useState, useEffect } from 'react';
import { getProductos, updateProducto } from 'services/productoService';
import Pagination from 'components/Shared/Pagination';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ListarProductos = () => {
    const [productos, setProductos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [editingId, setEditingId] = useState(null); // ID del producto que se está editando
    const [editData, setEditData] = useState({}); // Datos temporales de la edición

    const fetchProductos = async (page) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProductos(page);
            setProductos(data.data);
            setPaginationInfo({
                currentPage: data.current_page,
                totalPages: data.last_page,
                totalItems: data.total,
            });
        } catch (err) {
            setError('No se pudieron cargar los productos. Por favor, intente de nuevo más tarde.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // 1. Habilitar la edición
    const handleEditClick = (producto) => {
        setEditingId(producto.id);
        setEditData({ nombre: producto.nombre, rango_tasa: producto.rango_tasa });
        setAlert(null); // Limpiar alertas anteriores
    };

    // 2. Manejar cambios en los campos de edición
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Cancelar la edición
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    // 4. Actualizar (Guardar) el producto
    const handleUpdateSubmit = async (productoId) => {
        setLoading(true);
        setAlert(null);
        
        // Evita enviar datos vacíos
        if (!editData.nombre || !editData.rango_tasa) {
            setAlert({ type: 'error', message: 'Los campos Nombre y Rango de Tasa no pueden estar vacíos.' });
            setLoading(false);
            return;
        }

        try {
            const response = await updateProducto(productoId, editData);
            setAlert(response);
            setEditingId(null); // Cerrar modo edición
            setEditData({}); // Limpiar datos temporales
            await fetchProductos(currentPage); // Recargar datos para mostrar el cambio

        } catch (error) {
            setAlert(error); 
            // Si hay un error de validación, se mantiene en modo edición.
        } finally {
            setLoading(false);
        }
    };

    if (loading && productos.length === 0) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Listado de Productos</h1>

            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />
            
            <div className={`bg-white shadow-md rounded-lg overflow-hidden transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                            <th className="px-5 py-3">Nombre</th>
                            <th className="px-5 py-3">Rango de Tasa</th>
                            <th className="px-5 py-3">Fecha de Creación</th>
                            <th className="px-5 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map((producto) => {
                                const isEditing = editingId === producto.id;
                                return (
                                <tr key={producto.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    {/* Campo Nombre */}
                                    <td className="px-5 py-4 text-sm">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={editData.nombre || ''}
                                                onChange={handleEditChange}
                                                className="border rounded px-2 py-1 w-full"
                                                disabled={loading}
                                            />
                                        ) : (
                                            producto.nombre
                                        )}
                                    </td>

                                    {/* Campo Rango de Tasa */}
                                    <td className="px-5 py-4 text-sm">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="rango_tasa"
                                                value={editData.rango_tasa || ''}
                                                onChange={handleEditChange}
                                                className="border rounded px-2 py-1 w-full"
                                                disabled={loading}
                                            />
                                        ) : (
                                            producto.rango_tasa
                                        )}
                                    </td>
                                    
                                    {/* Fecha de Creación */}
                                    <td className="px-5 py-4 text-sm">
                                        {new Date(producto.created_at).toLocaleDateString()}
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-5 py-4 text-sm flex space-x-2">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateSubmit(producto.id)}
                                                    disabled={loading}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Guardar"
                                                >
                                                    <CheckIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    disabled={loading}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Cancelar"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleEditClick(producto)}
                                                disabled={loading}
                                                className="text-indigo-600 hover:text-indigo-900"
                                                title="Editar"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-gray-500">
                                    No se encontraron productos.
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

export default ListarProductos;