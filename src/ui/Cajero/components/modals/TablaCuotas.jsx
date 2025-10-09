// src/components/modals/TablaCuotas.jsx
import React from 'react';

const TablaCuotas = ({ 
    cuotas, 
    onPagar, 
    onViewComprobante, 
    onCancelarTotal, 
    onReprogramar, 
    onViewCaptura,
    onReducirMora, // Prop to open the reduction modal
    processingId 
}) => {
    const estadoCuotaMap = { 
        1: 'Pendiente', 
        2: 'Pagado', 
        3: 'Vence Hoy', 
        4: 'Vencido', 
        5: 'Procesando' // Virtual State
    };
    const estadoCuotaColors = {
        1: 'text-yellow-700 bg-yellow-100',  
        2: 'text-green-700 bg-green-100',    
        3: 'text-orange-700 bg-orange-100',  
        4: 'text-red-700 bg-red-100',        
        5: 'text-blue-700 bg-blue-100'       
    };
    
    // Logic to disable the Pay button for non-consecutive installments
    const primeraCuotaPendienteIndex = cuotas.findIndex(c => c.estado !== 2);

    return (
        <div>
            {/* --- GLOBAL LOAN BUTTONS --- */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-700">Cronograma de Pagos</h3>
                
                <div className="flex gap-2">
                    <button
                        onClick={onCancelarTotal}
                        className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-200 transition"
                    >
                        Cancelar Total Préstamo
                    </button>
                    <button
                        onClick={onReprogramar}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-yellow-200 transition"
                    >
                        Reprogramar Préstamo
                    </button>
                </div>
            </div>
            
            {/* --- INSTALLMENTS TABLE --- */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm">
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
                            
                            const cuotaData = { ...c, montoAPagarSinExcedente: montoAPagar };
                            
                            const puedeReducirMora = cuotaData.dias_mora > 0 && cuotaData.estado !== 2 && !cuotaData.reduccion_mora_aplicada;

                            return (
                                <tr key={c.id} className="border-t hover:bg-gray-50 transition">
                                    <td className="px-4 py-2 font-medium">{cuotaData.numero_cuota}</td>
                                    <td className="px-4 py-2">{new Date(cuotaData.fecha_vencimiento).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 text-right">{monto.toFixed(2)}</td>
                                    
                                    {/* --- MODIFIED LATE FEE COLUMN WITH TEXT --- */}
                                    <td className="px-4 py-2 text-right">
                                        {cuotaData.reduccion_mora_aplicada ? (
                                            <div>
                                                <span className="text-red-600">
                                                    <del title={`Reducido en ${cuotaData.mora_reducida}%`}>
                                                        {parseFloat(cuotaData.original_mora || mora / (1 - (cuotaData.mora_reducida / 100))).toFixed(2)}
                                                    </del>
                                                    <strong className="ml-2 text-green-700">{mora.toFixed(2)}</strong>
                                                </span>
                                                {/* --- ADDITIONAL TEXT HERE --- */}
                                                <div className="text-xs text-green-800 italic font-semibold">
                                                    (Reducida {cuotaData.mora_reducida}%)
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-red-600">{mora.toFixed(2)}</span>
                                        )}
                                    </td>
                                    
                                    <td className="px-4 py-2 text-right text-red-600">{cuotaData.dias_mora || 0}</td>
                                    <td className="px-4 py-2 text-right text-blue-600">{excedente.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right font-bold bg-gray-100">{montoAPagar.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${estadoCuotaColors[cuotaData.estado]}`}>
                                            {estadoCuotaMap[cuotaData.estado]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <div className="flex gap-1 justify-center flex-wrap">
                                            {cuotaData.estado === 5 ? (
                                                <button onClick={() => onViewCaptura(cuotaData)} className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-700 transition">Ver Pago</button>
                                            ) : cuotaData.estado !== 2 ? ( 
                                                <>
                                                    {puedeReducirMora && (
                                                        <button
                                                            onClick={() => onReducirMora(cuotaData)}
                                                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-xs font-bold hover:bg-purple-200 transition"
                                                            title="Aplicar descuento a la mora"
                                                        >
                                                            Reducir Mora
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => onPagar(cuotaData.id)}
                                                        disabled={processingId === cuotaData.id || index !== primeraCuotaPendienteIndex}
                                                        className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                                    >
                                                        {processingId === cuotaData.id ? 'Pagando...' : 'Pagar'}
                                                    </button>
                                                </>
                                            ) : ( 
                                                <button onClick={() => onViewComprobante(cuotaData.comprobante_url)} disabled={!cuotaData.comprobante_url} className="bg-indigo-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">Comprobante</button>
                                            )}
                                        </div>
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