import React from 'react';
import API_BASE_URL from 'js/urlHelper';

/**
 * Modal reutilizable para mostrar una captura de pago virtual y permitir la acción de aceptación/rechazo.
 * @param {object} props
 * @param {object} props.cuota - Objeto de cuota que contiene los datos.
 * @param {function} props.onClose - Función para cerrar el modal.
 * @param {function} props.onAceptar - Función a ejecutar al aceptar la captura.
 * @param {function} props.onRechazar - Función a ejecutar al rechazar la captura.
 * @param {boolean} props.isProcessing - Indica si una acción está en curso.
 */
const ModalVerCaptura = ({ cuota, onClose, onAceptar, onRechazar, isProcessing }) => {
    // Si la cuota es null o undefined, el modal no se renderiza.
    if (!cuota) return null;

    // --- INICIO DE LA CORRECCIÓN 1 ---
    // La ruta que viene del backend ya incluye "/storage/", por lo que solo unimos la base con la ruta.
    const imageUrl = `${API_BASE_URL}${cuota.captura_pago_url}`;
    
    // Calcula el monto neto a pagar
    const montoNeto = parseFloat(cuota.monto || 0) + parseFloat(cuota.cargo_mora || 0) - parseFloat(cuota.excedente_anterior || 0);
    
    // Deshabilitar botones si ya se está procesando una acción
    const isActionDisabled = isProcessing;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
                {/* Encabezado */}
                <div className="p-5 border-b flex justify-between items-center flex-shrink-0">
                    <h4 className="text-xl font-bold text-gray-800">Ver Comprobante de Pago Virtual (Cuota N° {cuota.numero_cuota})</h4>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-light leading-none">&times;</button>
                </div>
                
                {/* Contenido (Scrollable) */}
                <div className="p-5 overflow-y-auto flex-grow">
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-semibold text-blue-800">Monto Neto a Pagar: <span className="text-lg">S/. {montoNeto.toFixed(2)}</span></p>
                        <p className="text-xs text-blue-700">Estado actual: Procesando (5)</p>
                    </div>
                    
                    {/* --- INICIO DE LA CORRECCIÓN 2 --- */}
                    {/* Aquí también se corrige el nombre de la propiedad a 'captura_pago_url' */}
                    {cuota.captura_pago_url ? (
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Captura de Pago (Click para ver en tamaño completo):</p>
                            <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block border-2 border-gray-200 hover:border-blue-500 rounded-md overflow-hidden">
                                <img 
                                    src={imageUrl} 
                                    alt={`Comprobante Cuota ${cuota.numero_cuota}`} 
                                    className="w-full h-auto max-h-96 object-contain" 
                                />
                            </a>
                        </div>
                    ) : (
                        <p className="text-red-500 font-medium">❌ Error: No se encontró URL para la captura de pago.</p>
                    )}
                </div>

                {/* Pie de página (Acciones) */}
                <div className="p-5 border-t flex justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={() => onRechazar(cuota.id)}
                        disabled={isActionDisabled}
                        className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150"
                    >
                        {isProcessing ? 'Rechazando...' : 'Rechazar Pago'}
                    </button>
                    <button
                        onClick={() => onAceptar(cuota.id)}
                        disabled={isActionDisabled}
                        className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150"
                    >
                        {isProcessing ? 'Aceptando...' : 'Aceptar Pago'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalVerCaptura;