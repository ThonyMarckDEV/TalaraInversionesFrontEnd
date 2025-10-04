import React from 'react';

// 1. Añadimos las nuevas props para los botones
const TablaCuotas = ({ cuotas, onPagar, onViewComprobante, onCancelarTotal, onReprogramar, processingId }) => {
    const estadoCuotaMap = { 1: 'Pendiente', 2: 'Pagado', 3: 'Vencido' };
    const estadoCuotaColors = { 1: 'text-yellow-700 bg-yellow-100', 2: 'text-green-700 bg-green-100', 3: 'text-red-700 bg-red-100' };

    const primeraCuotaPendienteIndex = cuotas.findIndex(c => c.estado !== 2);

    return (
        <div>
            {/* --- INICIO DE LA MODIFICACIÓN --- */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-700">Cronograma de Pagos</h3>
                
                {/* 2. Contenedor para los nuevos botones */}
                <div className="flex gap-2">
                    <button
                        onClick={onCancelarTotal}
                        className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-200"
                    >
                        Cancelar Total Préstamo
                    </button>
                    <button
                        onClick={onReprogramar}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-yellow-200"
                    >
                        Reprogramar Préstamo
                    </button>
                </div>
            </div>
            {/* --- FIN DE LA MODIFICACIÓN --- */}
            
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm">
                    {/* ... (el resto de la tabla no necesita cambios) ... */}
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">N° Cuota</th>
                            <th className="px-4 py-2 text-left">Vencimiento</th>
                            <th className="px-4 py-2 text-right">Monto Cuota (S/.)</th>
                            <th className="px-4 py-2 text-right">Mora (S/.)</th>
                            <th className="px-4 py-2 text-right">Días Mora</th>
                            <th className="px-4 py-2 text-right">Excedente Ant. (S/.)</th>
                            <th className="px-4 py-2 text-right font-bold">Monto a Pagar (S/.)</th>
                            <th className="px-4 py-2 text-center">Estado</th>
                            <th className="px-4 py-2 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuotas.map((c, index) => {
                            const monto = parseFloat(c.monto || 0);
                            const mora = parseFloat(c.cargo_mora || 0);
                            const excedente = parseFloat(c.excedente_anterior || 0);
                            const montoAPagar = Math.max(0, (monto + mora) - excedente);
                            
                            return (
                                <tr key={c.id} className="border-t">
                                    <td className="px-4 py-2 font-medium">{c.numero_cuota}</td>
                                    <td className="px-4 py-2">{new Date(c.fecha_vencimiento).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 text-right">{monto.toFixed(2)}</td>
                                    <td className={`px-4 py-2 text-right ${mora > 0 ? 'text-red-600 font-semibold' : ''}`}>{mora.toFixed(2)}</td>
                                    <td className={`px-4 py-2 text-right ${c.dias_mora > 0 ? 'text-red-600 font-semibold' : ''}`}>{c.dias_mora || 0}</td>
                                    <td className="px-4 py-2 text-right text-blue-600">{excedente.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right font-bold bg-gray-50">{montoAPagar.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${estadoCuotaColors[c.estado]}`}>
                                            {estadoCuotaMap[c.estado]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {c.estado !== 2 ? (
                                            <button
                                                onClick={() => onPagar(c.id)}
                                                disabled={processingId === c.id || index !== primeraCuotaPendienteIndex}
                                                className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                {processingId === c.id ? 'Pagando...' : 'Pagar'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => onViewComprobante(c.comprobante_url)}
                                                disabled={!c.comprobante_url}
                                                className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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