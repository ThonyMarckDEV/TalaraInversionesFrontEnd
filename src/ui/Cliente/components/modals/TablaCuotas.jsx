import React from 'react';

// NOTE: The handler logic for API_BASE_URL, setAlert, and setPdfUrl 
// is assumed to be implemented and passed from the parent component via props.

const TablaCuotas = ({ 
    cuotas, 
    onPagar, 
    onViewComprobante, 
    cronogramaUrl, 
    onViewCronograma 
}) => {
    const estadoCuotaMap = { 1: 'Pendiente', 2: 'Pagado', 3: 'Vence Hoy', 4: 'Vencido', 5: 'Procesando' };
    const estadoCuotaColors = {
        1: 'text-yellow-700 bg-yellow-100',  // Pendiente
        2: 'text-green-700 bg-green-100',    // Pagado
        3: 'text-orange-700 bg-orange-100',  // Vence Hoy
        4: 'text-red-700 bg-red-100',        // Vencido
        5: 'text-blue-700 bg-blue-100'       // Virtual Prepagado (Procesando)
    };

    const primeraCuotaPendienteIndex = cuotas.findIndex(c => c.estado !== 2);
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Cronograma de Pagos</h3>
                <button
                    onClick={() => onViewCronograma(cronogramaUrl)}
                    disabled={!cronogramaUrl}
                    className="bg-sky-700 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-sky-800 transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={!cronogramaUrl ? 'Cronograma no disponible' : 'Ver el documento del cronograma de pagos'}
                >
                    Ver Cronograma
                </button>
            </div>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">N° Cuota</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Vencimiento</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Monto Cuota (S/.)</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Mora (S/.)</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Días Mora</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">Excedente Ant. (S/.)</th>
                            <th className="px-4 py-3 text-right font-bold text-gray-800">Monto a Pagar (S/.)</th>
                            <th className="px-4 py-3 text-center font-semibold text-gray-600">Estado</th>
                            <th className="px-4 py-3 text-center font-semibold text-gray-600">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {cuotas.map((c, index) => {
                            const monto = parseFloat(c.monto || 0);
                            const mora = parseFloat(c.cargo_mora || 0);
                            const excedente = parseFloat(c.excedente_anterior || 0);
                            const montoAPagar = Math.max(0, (monto + mora) - excedente);
                            
                            const isPayable = index === primeraCuotaPendienteIndex;

                            return (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium text-gray-800">{c.numero_cuota}</td>
                                    <td className="px-4 py-2 text-gray-600">{new Date(c.fecha_vencimiento).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 text-right text-gray-600">{monto.toFixed(2)}</td>
                                    
                                    {/* --- COLUMNA DE MORA MODIFICADA CON TEXTO ADICIONAL --- */}
                                    <td className="px-4 py-2 text-right">
                                        {c.reduccion_mora_aplicada ? (
                                            <div>
                                                <span className="text-red-600">
                                                    <del>
                                                        {parseFloat(c.original_mora || mora / (1 - (c.mora_reducida / 100))).toFixed(2)}
                                                    </del>
                                                    <strong className="ml-2 text-green-700">{mora.toFixed(2)}</strong>
                                                </span>
                                                {/* --- TEXTO ADICIONAL AQUÍ --- */}
                                                <div className="text-xs text-green-800 italic font-semibold">
                                                    (Reducida {c.mora_reducida}%)
                                                </div>
                                            </div>
                                        ) : (
                                            <span className={mora > 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                                                {mora.toFixed(2)}
                                            </span>
                                        )}
                                    </td>
                                    
                                    <td className={`px-4 py-2 text-right ${c.dias_mora > 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>{c.dias_mora || 0}</td>
                                    <td className="px-4 py-2 text-right text-blue-600">{excedente.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right font-bold bg-gray-50 text-gray-900">{montoAPagar.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${estadoCuotaColors[c.estado] || 'bg-gray-200'}`}>
                                            {estadoCuotaMap[c.estado] || 'Desconocido'}
                                        </span>
                                    </td>
                                    
                                    <td className="px-4 py-2 text-center">
                                        {(() => {
                                            if (c.estado === 5) {
                                                return (
                                                    <button disabled className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-bold opacity-70 cursor-not-allowed" title="Su pago está siendo verificado.">
                                                        Procesando...
                                                    </button>
                                                );
                                            }
                                            if (c.estado === 2) {
                                                return (
                                                    <button onClick={() => onViewComprobante(c.comprobante_url)} disabled={!c.comprobante_url} className="bg-sky-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-sky-700 disabled:bg-gray-400" title={!c.comprobante_url ? 'No hay comprobante disponible' : 'Ver comprobante'}>
                                                        Comprobante
                                                    </button>
                                                );
                                            }
                                            return (
                                                <button
                                                    onClick={() => onPagar(c.id)}
                                                    disabled={!isPayable}
                                                    className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    title={!isPayable ? 'Debe pagar las cuotas anteriores primero' : 'Pagar cuota'}
                                                >
                                                    Pagar
                                                </button>
                                            );
                                        })()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablaCuotas;