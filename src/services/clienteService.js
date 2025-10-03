import { fetchWithAuth } from 'js/authToken'; // Asumo que tienes estas utilidades
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

/**
 * Envía los datos de un nuevo cliente al backend para su creación.
 * @param {object} clienteData - El objeto anidado con todos los datos del formulario.
 * @returns {Promise<object>} - El resultado de la operación desde el backend.
 */
export const createCliente = async (clienteData) => {
  // El endpoint que crearemos en Laravel
  const url = `${API_BASE_URL}/api/cliente/create`;

  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // Convertimos el objeto de JS a una cadena JSON
    body: JSON.stringify(clienteData)
  });

  return handleResponse(response);
};


/**
 * Obtiene una lista paginada de clientes desde el backend.
 * @param {number} page - El número de página a solicitar.
 * @returns {Promise<object>} - La respuesta paginada del backend.
 */
export const getClientes = async (page = 1) => {
  const url = `${API_BASE_URL}/api/clientes/index?page=${page}`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
  });

  return handleResponse(response);
};


/**
 * Obtiene toda la información de un cliente por su ID.
 */
export const showCliente = async (id) => {
  const url = `${API_BASE_URL}/api/cliente/show/${id}`;
  const response = await fetchWithAuth(url, { method: 'GET' });
  return handleResponse(response);
};

/**
 * Envía los datos actualizados de un cliente al backend.
 */
export const updateCliente = async (id, clienteData) => {
  const url = `${API_BASE_URL}/api/cliente/update/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(clienteData)
  });
  return handleResponse(response);
};