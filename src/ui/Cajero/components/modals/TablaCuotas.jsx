import React from 'react';

const TablaCuotas = ({ cuotas, onPagar, processingId }) => {
    const estadoCuotaMap = { 1: 'Pendiente', 2: 'Pagado', 3: 'Vencido' };
    const estadoCuotaColors = { 1: 'text-yellow-700 bg-yellow-100', 2: 'text-green-700 bg-green-100', 3: 'text-red-700 bg-red-100' };

    const primeraCuotaPendienteIndex = cuotas.findIndex(c => c.estado !== 2);

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Cronograma de Pagos</h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* --- CABECERAS DE TABLA ACTUALIZADAS --- */}
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
                            // Calculamos el monto total a pagar para esta cuota
                            const montoAPagar = parseFloat(c.monto) + parseFloat(c.cargo_mora); // Asumiendo que el excedente se maneja por separado
                            
                            return (
                                <tr key={c.id} className="border-t">
                                    {/* --- CELDAS DE TABLA ACTUALIZADAS --- */}
                                    <td className="px-4 py-2 font-medium">{c.numero_cuota}</td>
                                    <td className="px-4 py-2">{new Date(c.fecha_vencimiento).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 text-right">{parseFloat(c.monto).toFixed(2)}</td>
                                    <td className={`px-4 py-2 text-right ${c.cargo_mora > 0 ? 'text-red-600 font-semibold' : ''}`}>{parseFloat(c.cargo_mora || 0).toFixed(2)}</td>
                                    <td className={`px-4 py-2 text-right ${c.dias_mora > 0 ? 'text-red-600 font-semibold' : ''}`}>{c.dias_mora || 0}</td>
                                    <td className="px-4 py-2 text-right text-blue-600">{parseFloat(c.excedente_anterior || 0).toFixed(2)}</td>
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
                                            <span className="text-green-600 font-bold text-xs">Pagado</span>
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