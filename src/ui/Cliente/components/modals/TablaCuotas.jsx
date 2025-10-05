import React from 'react';

const TablaCuotas = ({ cuotas, onPagar, onViewComprobante, onCancelarTotal, onReprogramar }) => {
    const estadoCuotaMap = { 1: 'Pendiente', 2: 'Pagado', 3: 'Vencido' };
    const estadoCuotaColors = { 1: 'text-yellow-700 bg-yellow-100', 2: 'text-green-700 bg-green-100', 3: 'text-red-700 bg-red-100' };

    // Encuentra el índice de la primera cuota que no está pagada (estado diferente de 2)
    const primeraCuotaPendienteIndex = cuotas.findIndex(c => c.estado !== 2);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-700">Cronograma de Pagos</h3>
                
                <div className="flex gap-2">
                    {/* Este botón solo aparece si la función onCancelarTotal es pasada en las props */}
                    {onCancelarTotal && (
                        <button
                            onClick={onCancelarTotal}
                            className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-200"
                        >
                            Cancelar Total Préstamo
                        </button>
                    )}
                    
                    {/* Este botón solo aparece si la función onReprogramar es pasada en las props */}
                    {onReprogramar && (
                        <button
                            onClick={onReprogramar}
                            className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-yellow-200"
                        >
                            Reprogramar Préstamo
                        </button>
                    )}
                </div>
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
                            
                            // El botón de pagar solo se activa para la primera cuota pendiente
                            const isPayable = index === primeraCuotaPendienteIndex;

                            return (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium text-gray-800">{c.numero_cuota}</td>
                                    <td className="px-4 py-2 text-gray-600">{new Date(c.fecha_vencimiento).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 text-right text-gray-600">{monto.toFixed(2)}</td>
                                    <td className={`px-4 py-2 text-right ${mora > 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>{mora.toFixed(2)}</td>
                                    <td className={`px-4 py-2 text-right ${c.dias_mora > 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>{c.dias_mora || 0}</td>
                                    <td className="px-4 py-2 text-right text-blue-600">{excedente.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right font-bold bg-gray-50 text-gray-900">{montoAPagar.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${estadoCuotaColors[c.estado]}`}>
                                            {estadoCuotaMap[c.estado]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {c.estado !== 2 ? (
                                            <button
                                                onClick={() => onPagar(c.id)}
                                                disabled={!isPayable} // Deshabilitado si no es la primera cuota pendiente
                                                className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                title={!isPayable ? 'Debe pagar las cuotas anteriores primero' : 'Pagar cuota'}
                                            >
                                                Pagar
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onViewComprobante(c.comprobante_url)}
                                                disabled={!c.comprobante_url}
                                                className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                title={!c.comprobante_url ? 'No hay comprobante disponible' : 'Ver comprobante'}
                                            >
                                                Comprobante
                                            </button>
                                        )}
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