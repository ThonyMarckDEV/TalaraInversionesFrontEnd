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

/**
 * Registra el pago para la cancelación total de un préstamo.
 * @param {object} pagoData - Los datos del formulario de pago.
 */
export const cancelarTotalPrestamo = async (pagoData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/pago/cancelar-total`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(pagoData),
    });
    return handleResponse(response);
};


/**
 * Registra un nuevo pago que INCLUYE un archivo de comprobante.
 * @param {FormData} formData - Los datos del pago como FormData.
 */
export const registrarPagoConArchivo = async (formData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/pago/store`, {
        method: 'POST',
        // SIN headers y SIN JSON.stringify. El navegador lo hará automáticamente.
        body: formData,
    });
    return handleResponse(response);
};

/**
 * Cancela un préstamo que INCLUYE un archivo de comprobante.
 * @param {FormData} formData - Los datos del pago como FormData.
 */
export const cancelarTotalConArchivo = async (formData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/pago/cancelar-total`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse(response);
};