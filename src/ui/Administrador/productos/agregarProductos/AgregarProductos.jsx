// src/pages/productos/AgregarProductos.jsx

import React, { useState } from 'react';
import { storeProducto } from 'services/productoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';

const AgregarProductos = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        rango_tasa: '',
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            const response = await storeProducto(formData);
            setAlert(response);
            setFormData({ nombre: '', rango_tasa: '' }); // Limpiar formulario
        } catch (error) {
            setAlert(error); // El error ya viene estandarizado de handleResponse
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Registrar Nuevo Producto</h1>

            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />

            <div className="bg-white shadow-lg rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                            Nombre del Producto
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            disabled={loading}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-600"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rango_tasa">
                            Rango de Tasa (Ej: 10%-15%)
                        </label>
                        <input
                            type="text"
                            id="rango_tasa"
                            name="rango_tasa"
                            value={formData.rango_tasa}
                            onChange={handleChange}
                            disabled={loading}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-600"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50 transition duration-150"
                        >
                            {loading ? <LoadingScreen size="sm" /> : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgregarProductos;