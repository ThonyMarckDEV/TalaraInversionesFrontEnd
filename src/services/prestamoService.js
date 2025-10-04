import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 
import { fetchWithAuth } from 'js/authToken';

/**
 * Almacena un nuevo registro de préstamo.
 */
export const createPrestamo = async (prestamoData) => {
    // Llamando a tu ruta POST /prestamo/store
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

/**
 * Obtiene una lista paginada de préstamos.
 */
export const getPrestamos = async (page = 1, search = '') => {
    // Llamando a tu ruta GET /prestamos/index
    const url = new URL(`${API_BASE_URL}/api/prestamos/index`); 
    url.searchParams.append('page', page);
    if (search) {
        url.searchParams.append('search', search);
    }

    const response = await fetchWithAuth(url.toString());
    return handleResponse(response);
};

/**
 * Obtiene los detalles completos de un préstamo por su ID.
 */
export const getPrestamoById = async (id) => {
    // ==========================================================
    // CORRECCIÓN PRINCIPAL: Usando la URL exacta que definiste
    // ==========================================================
    const response = await fetchWithAuth(`${API_BASE_URL}/api/prestamo/show/${id}`);
    return handleResponse(response);
};

/**
 * Envía una solicitud para extornar (anular) un préstamo.
 * @param {number} id - El ID del préstamo a extornar.
 */
export const extornarPrestamo = async (id) => {
    // Usaremos el método POST para esta acción
    const response = await fetchWithAuth(`${API_BASE_URL}/api/prestamo/extornar/${id}`, {
        method: 'POST', // Especificamos que es una acción de modificación
    });
    return handleResponse(response);
};

/**
 * Actualiza un préstamo existente.
 * @param {number} id - El ID del préstamo a actualizar.
 * @param {object} prestamoData - Los nuevos datos del préstamo.
 */
export const updatePrestamo = async (id, prestamoData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/prestamo/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(prestamoData),
    });
    return handleResponse(response);
};

/**
 * Envía una solicitud para reprogramar un préstamo.
 * @param {object} data - Contiene prestamo_id, nueva_tasa y nueva_frecuencia.
 */
export const reprogramarPrestamo = async (data) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/prestamo/reprogramar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};