import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 
import { fetchWithAuth } from 'js/authToken';

/**
 * Registra un nuevo pago para una cuota.
 * @param {object} pagoData - Los datos del formulario de pago.
 */
export const registrarPago = async (pagoData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/pago/store`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(pagoData),
    });
    return handleResponse(response);
};