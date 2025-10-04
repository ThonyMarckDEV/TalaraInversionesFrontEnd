import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';

const RegistrarPagoModal = ({ cuota, onConfirm, onClose, loading }) => {
    
    // 1. Calculamos el monto final a pagar, restando el excedente anterior.
    const excedenteAnterior = parseFloat(cuota.excedente_anterior || 0);
    const totalDeudaCuota = parseFloat(cuota.monto) + parseFloat(cuota.cargo_mora || 0);
    const montoFinalAPagar = Math.max(0, totalDeudaCuota - excedenteAnterior); // Asegura que el monto no sea negativo.

    // 2. El estado del formulario se inicializa con el monto final calculado.
    const [formData, setFormData] = useState({
        id_Cuota: cuota.id,
        monto_pagado: montoFinalAPagar.toFixed(2),
        numero_operacion: '',
        observaciones: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Al confirmar, añadimos la fecha y modalidad fijas a los datos a enviar.
        const dataToSend = {
            ...formData,
            fecha_pago: new Date().toISOString().split('T')[0],
            modalidad: 'PRESENCIAL',
        };
        onConfirm(dataToSend);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
                <form onSubmit={handleSubmit}>
                    {/* --- HEADER MEJORADO --- */}
                    <div className="p-5 border-b bg-gray-50 rounded-t-lg flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                                <CreditCard className="w-6 h-6 text-green-700" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Registrar Pago de Cuota #{cuota.numero_cuota}</h2>
                                <p className="text-sm text-gray-500">Préstamo ID: {cuota.id_Prestamo}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">PRESENCIAL</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* --- CUERPO DEL FORMULARIO --- */}
                    <div className="p-6 space-y-5">
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-sm space-y-1">
                            <div className="flex justify-between">
                                <span>Monto de la Cuota:</span> 
                                <span className="font-semibold">S/ {parseFloat(cuota.monto).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Cargo por Mora:</span> 
                                <span className="font-semibold text-red-600">S/ {parseFloat(cuota.cargo_mora || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-700">
                                <span>(-) Excedente Anterior:</span> 
                                <span className="font-semibold">S/ {excedenteAnterior.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mt-2 pt-2 border-t font-bold text-base">
                                <span>Total a Pagar:</span> 
                                <span>S/ {montoFinalAPagar.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monto Recibido</label>
                            <input 
                                type="number" 
                                name="monto_pagado" 
                                value={formData.monto_pagado} 
                                onChange={handleChange} 
                                className="input-style" 
                                step="0.01" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones (Opcional)</label>
                            <textarea 
                                name="observaciones" 
                                value={formData.observaciones} 
                                onChange={handleChange} 
                                className="input-style" 
                                rows="3"
                                placeholder="Ej: Pago adelantado, acuerdo de pago, etc."
                            ></textarea>
                        </div>
                    </div>

                    {/* --- FOOTER CON BOTONES --- */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onClose} disabled={loading} className="btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary bg-green-600 hover:bg-green-700">
                            {loading ? 'Procesando...' : 'Confirmar Pago'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrarPagoModal;