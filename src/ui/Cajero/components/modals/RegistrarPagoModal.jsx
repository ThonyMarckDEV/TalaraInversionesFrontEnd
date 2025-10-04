import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';

const RegistrarPagoModal = ({ cuota, onConfirm, onClose, loading }) => {
    
    // Se calculan los montos una sola vez para usarlos en todo el componente.
    const excedenteAnterior = parseFloat(cuota.excedente_anterior || 0);
    const totalDeudaCuota = parseFloat(cuota.monto) + parseFloat(cuota.cargo_mora || 0);
    const montoFinalAPagar = Math.max(0, totalDeudaCuota - excedenteAnterior);

    const [formData, setFormData] = useState({
        id_Cuota: cuota.id,
        monto_pagado: montoFinalAPagar.toFixed(2),
        observaciones: '',
    });
    
    // Estado para saber si el monto ingresado es válido.
    const [montoEsValido, setMontoEsValido] = useState(true);

    // Este efecto se ejecuta cada vez que el usuario cambia el monto.
    useEffect(() => {
        // Comprueba si el monto pagado es mayor o igual al que se debe.
        const esValido = parseFloat(formData.monto_pagado) >= montoFinalAPagar;
        setMontoEsValido(esValido);
    }, [formData.monto_pagado, montoFinalAPagar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Doble validación por si acaso
        if (!montoEsValido) return;

        const dataToSend = {
            ...formData,
            monto_pagado: parseFloat(formData.monto_pagado),
            fecha_pago: new Date().toISOString().split('T')[0],
            modalidad: 'PRESENCIAL',
        };
        onConfirm(dataToSend);
    };

    // Estilos para reutilizar
    const inputStyle = `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition`;
    const btnSecondary = `px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50`;
    const btnPrimary = `px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400`;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
                <form onSubmit={handleSubmit}>
                    <div className="p-5 border-b bg-gray-50 rounded-t-lg flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-100 p-2 rounded-full"><CreditCard className="w-6 h-6 text-red-700" /></div>
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

                    <div className="p-6 space-y-5">
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-sm space-y-1">
                            <div className="flex justify-between"><span>Monto de la Cuota:</span> <span className="font-semibold">S/ {parseFloat(cuota.monto).toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Cargo por Mora:</span> <span className="font-semibold text-red-600">S/ {parseFloat(cuota.cargo_mora || 0).toFixed(2)}</span></div>
                            <div className="flex justify-between text-green-700"><span>(-) Excedente Anterior:</span> <span className="font-semibold">S/ {excedenteAnterior.toFixed(2)}</span></div>
                            <div className="flex justify-between mt-2 pt-2 border-t font-bold text-base"><span>Total a Pagar:</span> <span>S/ {montoFinalAPagar.toFixed(2)}</span></div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monto Recibido</label>
                            <input 
                                type="number" 
                                name="monto_pagado" 
                                value={formData.monto_pagado} 
                                onChange={handleChange}
                                className={`${inputStyle} ${!montoEsValido ? 'border-red-500 ring-2 ring-red-300' : ''}`}
                                step="0.01" 
                                required 
                            />
                            {!montoEsValido && <p className="text-xs text-red-600 mt-1">El monto no puede ser menor al total a pagar.</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones (Opcional)</label>
                            <textarea 
                                name="observaciones" 
                                value={formData.observaciones} 
                                onChange={handleChange} 
                                className={inputStyle} 
                                rows="3"
                                placeholder="Ej: Pago adelantado, acuerdo de pago, etc."
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onClose} disabled={loading} className={btnSecondary}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading || !montoEsValido} className={btnPrimary}>
                            {loading ? 'Procesando...' : 'Confirmar Pago'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrarPagoModal;