/**
 * Procesa la respuesta de fetch y la ESTANDARIZA.
 * Siempre devuelve o lanza un objeto con un formato predecible.
 */
export const handleResponse = async (response) => {
    const result = await response.json();

    if (!response.ok) {
        // Lógica de error (se mantiene igual, funciona bien)
        const error = {
            type: 'error',
            message: result.message || 'Ocurrió un error inesperado.',
            details: result.errors ? Object.values(result.errors).flat() : undefined,
        };
        throw error;
    }

    // =========================================================================
    // 💡 CAMBIO CLAVE: DETECTAR Y DEVOLVER RESPUESTAS DE PAGINACIÓN DE LARAVEL
    // =========================================================================
    
    // Si la respuesta contiene 'current_page' (indicador de paginación de Laravel),
    // la devolvemos TAL CUAL está, sin envolverla en 'type'/'message'.
    if (result.current_page !== undefined) {
        return result; 
    }

    // ÉXITO para las demás llamadas (creación, actualización, etc.):
    const success = {
        type: 'success',
        // Si el backend no envía un mensaje, usamos uno por defecto.
        message: result.message || 'Operación realizada con éxito.',
        data: result.data || result, // Devuelve 'data' si existe, o el objeto completo si no.
    };
    return success;
};