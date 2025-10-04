// src/services/prestamoService.js

import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 
import { fetchWithAuth } from 'js/authToken';

/**
 * Almacena un nuevo registro de préstamo.
 * * @param {object} prestamoData - Datos del préstamo (id_Cliente, monto, total, etc.)
 * @returns {Promise<object>} - Objeto de éxito/error estandarizado.
 */
export const createPrestamo = async (prestamoData) => {

    const response = await fetchWithAuth(`${API_BASE_URL}/api/prestamo/store`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(prestamoData),
    });
    
    return handleResponse(response);
};

// Puedes añadir aquí otras funciones (getPrestamos, updatePrestamo, etc.) si es necesario.