// src/components/Shared/ProductoSelect.jsx (CORREGIDO - SIN SelectSimple)

import React, { useState, useEffect } from 'react';
import { getProductos } from 'services/productoService'; 

/**
 * Componente que carga la lista de productos al inicio y la presenta en un select simple.
 * @param {string} value - El ID del producto seleccionado (form.id_Producto).
 * @param {function} onChange - Función de manejo de cambios del formulario padre.
 * @param {object} errors - Objeto de errores del formulario padre.
 * @returns {JSX.Element}
 */
const ProductoSelect = ({ value, onChange, errors }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const error = errors.id_Producto; // Error específico para este campo

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await getProductos(1); 
                // La data que viene del backend
                setProductos(response.data || []); 

            } catch (err) {
                console.error("Error al cargar productos:", err);
                setErrorMsg('Error al cargar la lista de productos.');
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    if (loading) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <div className="p-2 border border-gray-300 bg-gray-100 rounded-md text-gray-500">
                    Cargando productos...
                </div>
            </div>
        );
    }

    // El errorMsg es solo para errores de CARGA, no de validación del formulario.
    if (errorMsg) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
            </div>
        );
    }

    return (
        <div>
            <label htmlFor="id_Producto" className="block text-sm font-medium text-gray-700 mb-1">
                Producto
            </label>
            <select
                id="id_Producto"
                name="id_Producto"
                value={value}
                onChange={onChange}
                className={`w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${error ? 'border-red-500' : ''}`}
            >
                <option value="" disabled>Seleccione Producto</option>
                {productos.map((producto) => (
                    // Usamos id como valor y nombre + rango_tasa como etiqueta
                    <option key={producto.id} value={producto.id}>
                        {`${producto.nombre} (Tasa: ${producto.rango_tasa})`} 
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default ProductoSelect;