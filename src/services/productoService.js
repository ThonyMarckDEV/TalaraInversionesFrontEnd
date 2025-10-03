// src/services/productoService.js

import API_BASE_URL  from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; // Ajusta la ruta a tus helpers
import {fetchWithAuth} from 'js/authToken';

/**
 * Obtiene la lista paginada de productos.
 * @param {number} page - Número de página.
 * @returns {Promise<object>} - Objeto de paginación de Laravel.
 */
export const getProductos = async (page = 1) => {
    const url = `${API_BASE_URL}/api/productos/index?page=${page}`;
    
    const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });
    
    // Asumimos que handleResponse devuelve el objeto de paginación completo
    return handleResponse(response);
};

/**
 * Almacena un nuevo producto.
 * @param {object} productoData - { nombre, rango_tasa }
 * @returns {Promise<object>} - Objeto de éxito/error estandarizado.
 */
export const storeProducto = async (productoData) => {
    const url = `${API_BASE_URL}/api/producto/store`;
    
    const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(productoData),
    });
    
    return handleResponse(response);
};

/**
 * Actualiza un producto existente.
 * @param {number} id - ID del producto.
 * @param {object} productoData - { nombre, rango_tasa }
 * @returns {Promise<object>} - Objeto de éxito/error estandarizado.
 */
export const updateProducto = async (id, productoData) => {
    const url = `${API_BASE_URL}/api/producto/update/${id}`;
    
    const response = await fetchWithAuth(url, {
        method: 'PUT', // Laravel usa PUT o PATCH para actualizar
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(productoData),
    });
    
    // Si la actualización es exitosa, Laravel devuelve un objeto con 'type' y 'message'
    return handleResponse(response); 
};