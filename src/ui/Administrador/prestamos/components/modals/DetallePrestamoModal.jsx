import React, { useState, useEffect, useCallback } from 'react';
import { getPrestamoById } from 'services/prestamoService';

const DetallePrestamoModal = ({ prestamoId, onClose }) => {
    const [prestamo, setPrestamo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const estadoCuotaMap = { 1: 'Pendiente', 2: 'Pagado', 3: 'Vencido' };
    const estadoCuotaColors = { 1: 'text-yellow-700 bg-yellow-100', 2: 'text-green-700 bg-green-100', 3: 'text-red-700 bg-red-100' };

    const fetchDetails = useCallback(async () => {
        if (!prestamoId) return;
        
        setLoading(true);
        setError(null);
        setPrestamo(null); 
        try {
            const response = await getPrestamoById(prestamoId);

            // ==========================================================
            // CORRECCIÓN DEFINITIVA: Accedemos a la propiedad '.data'
            // ==========================================================
            if (response && response.data) {
                setPrestamo(response.data);
            } else {
                throw new Error("La respuesta de la API no contiene la propiedad 'data'.");
            }

        } catch (err) {
            setError('No se pudieron cargar los detalles del préstamo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [prestamoId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Detalles del Préstamo #{prestamo?.id || '...'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
                </div>

                <div className="p-6">
                    {loading && <div className="text-center py-10">Cargando detalles...</div>}
                    {error && <div className="text-center py-10 text-red-600">{error}</div>}
                    
                    {prestamo && (
                        <div className="space-y-6">
                             <section>
                                 <h3 className="text-lg font-semibold text-red-800 border-b pb-2 mb-4">Datos Generales</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                     <div><strong>Cliente:</strong><p>{`${prestamo.cliente?.datos?.nombre || ''} ${prestamo.cliente?.datos?.apellidoPaterno || ''}`.trim() || 'N/A'}</p></div>
                                     <div><strong>DNI Cliente:</strong><p>{prestamo.cliente?.datos?.dni || 'N/A'}</p></div>
                                     <div><strong>Asesor:</strong><p>{`${prestamo.asesor?.datos?.nombre || ''} ${prestamo.asesor?.datos?.apellidoPaterno || ''}`.trim() || 'N/A'}</p></div>
                                     <div><strong>Producto:</strong><p>{prestamo.producto?.nombre || 'N/A'}</p></div>
                                     <div><strong>Modalidad:</strong><p>{prestamo.modalidad}</p></div>
                                     <div><strong>Frecuencia:</strong><p>{prestamo.frecuencia}</p></div>
                                 </div>
                             </section>
 
                             <section>
                                 <h3 className="text-lg font-semibold text-red-800 border-b pb-2 mb-4">Información Financiera</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                     <div><strong>Monto Préstamo:</strong><p>S/ {parseFloat(prestamo.monto).toFixed(2)}</p></div>
                                     <div><strong>Tasa Interés:</strong><p>{(parseFloat(prestamo.interes) * 100).toFixed(2)} %</p></div>
                                     <div><strong>N° Cuotas:</strong><p>{prestamo.cuotas}</p></div>
                                     <div><strong>Total a Pagar:</strong><p>S/ {parseFloat(prestamo.total).toFixed(2)}</p></div>
                                 </div>
                             </section>
 
                             <section>
                                 <h3 className="text-lg font-semibold text-red-800 border-b pb-2 mb-4">Cronograma de Pagos</h3>
                                 <div className="overflow-x-auto">
                                     <table className="min-w-full text-sm">
                                         <thead className="bg-gray-50">
                                             <tr>
                                                 <th className="px-4 py-2 text-left">N° Cuota</th>
                                                 <th className="px-4 py-2 text-left">Fecha Vencimiento</th>
                                                 <th className="px-4 py-2 text-right">Monto Cuota (S/.)</th>
                                                 <th className="px-4 py-2 text-center">Estado</th>
                                             </tr>
                                         </thead>
                                         <tbody>
                                             {prestamo.cuota && prestamo.cuota.length > 0 ? (
                                                 prestamo.cuota.map(c => (
                                                     <tr key={c.id} className="border-t">
                                                         <td className="px-4 py-2">{c.numero_cuota}</td>
                                                         <td className="px-4 py-2">{new Date(c.fecha_vencimiento).toLocaleDateString()}</td>
                                                         <td className="px-4 py-2 text-right">{parseFloat(c.monto).toFixed(2)}</td>
                                                         <td className="px-4 py-2 text-center">
                                                             <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${estadoCuotaColors[c.estado]}`}>
                                                                 {estadoCuotaMap[c.estado]}
                                                             </span>
                                                         </td>
                                                     </tr>
                                                 ))
                                             ) : (
                                                 <tr>
                                                     <td colSpan="4" className="text-center py-6 text-gray-500">
                                                         No se encontraron cuotas para este préstamo.
                                                     </td>
                                                 </tr>
                                             )}
                                         </tbody>
                                     </table>
                                 </div>
                             </section>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default DetallePrestamoModal;