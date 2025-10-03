// src/services/ClienteService.js

import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';

import { handleResponse } from 'utilities/Responses/handleResponse'; 

export const create = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/cliente/create`, {
    method: 'GET',
  });
  return handleResponse(response);
};

export default create;
