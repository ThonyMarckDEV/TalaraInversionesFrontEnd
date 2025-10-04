import React from 'react';

const TablaCuotas = ({ cuotas, onPagar, processingId }) => {
    const estadoCuotaMap = { 1: 'Pendiente', 2: 'Pagado', 3: 'Vencido' };
    const estadoCuotaColors = { 1: 'text-yellow-700 bg-yellow-100', 2: 'text-green-700 bg-green-100', 3: 'text-red-700 bg-red-100' };

    // --- LÓGICA AÑADIDA ---
    // 1. Encontrar el índice de la primera cuota pendiente (estado diferente de 2)
    const primeraCuotaPendienteIndex = cuotas.findIndex(c => c.estado !== 2);

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Cronograma de Pagos</h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">N° Cuota</th>
                            <th className="px-4 py-2 text-left">Vencimiento</th>
                            <th className="px-4 py-2 text-right">Monto (S/.)</th>
                            <th className="px-4 py-2 text-center">Estado</th>
                            <th className="px-4 py-2 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Pasamos el 'index' de cada cuota en el map */}
                        {cuotas.map((c, index) => (
                            <tr key={c.id} className="border-t">
                                <td className="px-4 py-2 font-medium">{c.numero_cuota}</td>
                                <td className="px-4 py-2">{new Date(c.fecha_vencimiento).toLocaleDateString()}</td>
                                <td className="px-4 py-2 text-right">{parseFloat(c.monto).toFixed(2)}</td>
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
                                        <span className="text-green-600 font-bold text-xs">Pagado</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablaCuotas;