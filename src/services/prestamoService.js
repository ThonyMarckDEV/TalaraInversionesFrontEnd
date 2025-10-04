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
 * Obtiene los detalles completos de un préstamo por su ID.
 */
export const extornarPrestamo = async (id) => {
    // ==========================================================
    // CORRECCIÓN PRINCIPAL: Usando la URL exacta que definiste
    // ==========================================================
    const response = await fetchWithAuth(`${API_BASE_URL}/api/prestamo/extornar/${id}`);
    return handleResponse(response);
};
