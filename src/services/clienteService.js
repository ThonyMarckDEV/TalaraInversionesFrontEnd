// // src/services/ClienteService.js

// import { fetchWithAuth } from 'js/authToken';
// import API_BASE_URL from 'js/urlHelper';

// import { handleResponse } from 'utilities/Responses/handleResponse'; 

// export const create = async (dni) => {
//   const response = await fetchWithAuth(`${API_BASE_URL}/api/cliente/create`, {
//     method: 'GET',
//   });
//   return handleResponse(response);
// };

// export default create;

// src/services/ClienteService.js

/**
 * Simula la creación de un nuevo cliente en el backend.
 * @param {object} clienteData - El objeto anidado con todos los datos del cliente.
 * @returns {Promise<object>} - Una promesa que resuelve con una respuesta simulada.
 */
export const createCliente = async (clienteData) => {
  console.log("🚀 Enviando al backend (simulado):");
  console.log(JSON.stringify(clienteData, null, 2)); // Muestra el JSON bonito en consola

  // Simulación de una llamada a la API con un pequeño retraso
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Aquí iría la lógica real de fetchWithAuth que me pasaste
  /*
  const response = await fetchWithAuth(`${API_BASE_URL}/api/clientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clienteData),
  });
  return handleResponse(response);
  */

  // Devolvemos una respuesta simulada exitosa
  return { success: true, message: "Cliente registrado exitosamente (simulado)." };
};

// Puedes agregar más funciones de servicio aquí (update, get, delete, etc.)