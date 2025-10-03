import { fetchWithAuth } from 'js/authToken'; // Utilidad para incluir token de autenticación
import API_BASE_URL from 'js/urlHelper';       // URL base de tu API (e.g., http://localhost:8000)
import { handleResponse } from 'utilities/Responses/handleResponse'; // Utilidad para manejar la respuesta y errores JSON


/**
 * Crea un nuevo empleado en el backend.
 * @param {object} data - Los datos del empleado (datos personales + acceso).
 * @returns {Promise<object>} - El resultado de la operación (ej. {type: 'success', message: '...'}).
 */
export const createEmpleado = async (data) => {
    const url = `${API_BASE_URL}/api/empleado/store`; // POST /api/empleados

    const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // handleResponse manejará tanto el éxito (response.data) como el error (throw error.response.data)
    return handleResponse(response);
};

/**
 * Obtiene una lista paginada de empleados, con filtros opcionales.
 * @param {number} page - Número de página.
 * @param {string} rol - ID de rol para filtrar (4 o 5).
 * @param {string} search - Término de búsqueda (DNI, nombre, etc.).
 * @returns {Promise<object>} - La respuesta paginada del backend (Laravel pagination object).
 */
export const getEmpleados = async (page = 1, rol = '', search = '') => {
    // Construir los parámetros de consulta
    const params = new URLSearchParams({
        page: page,
        rol: rol,
        search: search
    }).toString();
    
    const url = `${API_BASE_URL}/api/empleados/index?${params}`; // GET /api/empleados?page=X&rol=Y&search=Z

    const response = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    });

    return handleResponse(response);
};

/**
 * Obtiene los datos de un empleado por su ID.
 * @param {number} id - ID del empleado.
 * @returns {Promise<object>} - Datos del empleado anidado con su info personal.
 */
export const getEmpleadoById = async (id) => {
    const url = `${API_BASE_URL}/api/empleado/show/${id}`; // GET /api/empleados/{id}
    
    const response = await fetchWithAuth(url, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    });

    return handleResponse(response);
};

/**
 * Actualiza los datos personales y el rol de un empleado.
 * @param {number} id - ID del empleado a actualizar.
 * @param {object} data - Datos a enviar para la actualización.
 * @returns {Promise<object>} - El resultado de la operación.
 */
export const updateEmpleado = async (id, data) => {
    const url = `${API_BASE_URL}/api/empleado/update/${id}`; // PUT /api/empleados/{id}
    
    const response = await fetchWithAuth(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    return handleResponse(response);
};

/**
 * Cambia el estado (Activo/Inactivo) de un empleado.
 * @param {number} id - ID del empleado.
 * @returns {Promise<object>} - El resultado de la operación (ej. {type: 'success', message: '...'}).
 */
export const toggleEmpleadoEstado = async (id) => {
    const url = `${API_BASE_URL}/api/empleado/toggleEstado/${id}`; // PATCH /api/empleados/{id}/estado

    // Usamos PATCH para actualizar solo un campo (el estado, que el controller maneja internamente)
    const response = await fetchWithAuth(url, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json'
        },
        // No se envía body, ya que el backend se encarga de alternar el estado
    });

    return handleResponse(response);
};