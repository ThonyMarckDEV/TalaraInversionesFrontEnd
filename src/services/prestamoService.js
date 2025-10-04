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
    // 📢 Usamos el endpoint que definimos en Laravel
    const url = `${API_BASE_URL}/api/prestamo/store`;
    
    // Verificación de datos de envío (opcional, para depuración)
    console.log("Datos a enviar para Prestamo:", prestamoData);
    
    const response = await fetchWithAuth(url, {
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