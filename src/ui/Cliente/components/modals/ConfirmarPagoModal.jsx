import React, { useState } from 'react';
import { CreditCard, Upload, Landmark } from 'lucide-react';

const ConfirmarPagoModal = ({ cuota, onConfirm, onClose, loading }) => {
    
    const [paymentMethod, setPaymentMethod] = useState('yape');
    const [comprobanteFile, setComprobanteFile] = useState(null);
    const [error, setError] = useState('');

    const excedenteAnterior = parseFloat(cuota.excedente_anterior || 0);
    const totalDeudaCuota = parseFloat(cuota.monto) + parseFloat(cuota.cargo_mora || 0);
    const montoFinalAPagar = Math.max(0, totalDeudaCuota - excedenteAnterior);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setComprobanteFile(file);
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comprobanteFile) {
            setError('Por favor, adjunte su comprobante de pago.');
            return;
        }

        const formData = new FormData();
        formData.append('id_Cuota', cuota.id);
        formData.append('monto_pagado', montoFinalAPagar.toFixed(2));
        formData.append('metodo_pago', paymentMethod.toUpperCase());
        formData.append('comprobante', comprobanteFile);
        
        onConfirm(formData);
    };

    // Style constants
    const btnSecondary = `px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50`;
    const btnPrimary = `px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400`;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl animate-fadeIn">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="p-6 border-b bg-gray-50 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-100 p-3 rounded-full"><CreditCard className="w-7 h-7 text-red-700" /></div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Realizar Pago en Línea
                                </h2>
                                <p className="text-sm text-gray-500">Préstamo ID: {cuota.id_Prestamo}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-700">Total a Pagar:</p>
                            <p className="text-3xl font-bold text-red-600">S/ {montoFinalAPagar.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Modal Body (2 columns) */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* LEFT COLUMN: SUMMARY */}
                        <div className="space-y-6">
                           <h3 className="font-semibold text-lg text-slate-700">Resumen de la Deuda</h3>
                           <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-sm space-y-2">
                                <div className="flex justify-between"><span>Monto de la Cuota:</span> <span className="font-semibold">S/ {parseFloat(cuota.monto).toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Cargo por Mora:</span> <span className="font-semibold text-red-600">S/ {parseFloat(cuota.cargo_mora || 0).toFixed(2)}</span></div>
                                <div className="flex justify-between text-green-700"><span>(-) Excedente Anterior:</span> <span className="font-semibold">S/ {excedenteAnterior.toFixed(2)}</span></div>
                                <div className="flex justify-between mt-2 pt-2 border-t font-bold text-base text-slate-800"><span>Monto Final a Pagar:</span> <span>S/ {montoFinalAPagar.toFixed(2)}</span></div>
                           </div>
                            <p className="text-xs text-gray-500 italic">
                                Recuerde que debe adjuntar el comprobante de pago para que podamos verificar su transacción. La verificación puede tomar hasta 24 horas.
                            </p>
                        </div>

                        {/* RIGHT COLUMN: PAYMENT METHODS */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-slate-700">Seleccione un Método de Pago</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <button type="button" onClick={() => setPaymentMethod('yape')} className={`p-3 rounded-md font-semibold text-sm transition ${paymentMethod === 'yape' ? 'bg-purple-600 text-white shadow' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                    Yape
                                </button>
                                <button type="button" onClick={() => setPaymentMethod('banco')} className={`p-3 rounded-md font-semibold text-sm transition flex items-center justify-center gap-2 ${paymentMethod === 'banco' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                    <Landmark size={16} /> Transferencia Bancaria
                                </button>
                            </div>

                            <div className="p-4 bg-gray-100 rounded-md min-h-[180px]">
                                {paymentMethod === 'yape' && (
                                    <div className="text-center space-y-2">
                                        <p className="font-semibold">Pagar con Yape</p>
                                        <div className="bg-gray-300 h-28 w-28 mx-auto flex items-center justify-center text-xs text-gray-600">
                                            
                                        </div>
                                        <p className="text-sm">o al número: <span className="font-mono font-bold">987 654 321</span></p>
                                    </div>
                                )}
                                {paymentMethod === 'banco' && (
                                    <div className="space-y-2 text-sm">
                                       <p className="font-semibold text-center mb-3">Datos para Transferencia</p>
                                       <p><strong>Banco:</strong> BCP Ahorros Soles</p>
                                       <p><strong>N° de Cuenta:</strong> <span className="font-mono font-bold">191-12345678-0-99</span></p>
                                       <p><strong>CCI:</strong> <span className="font-mono font-bold">00219100123456789955</span></p>
                                       <p><strong>Titular:</strong> Mi Empresa S.A.C</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Adjuntar Comprobante de Pago</label>
                                <label htmlFor="file-upload" className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                    <Upload className="w-5 h-5 text-gray-500"/>
                                    <span className="text-sm text-gray-600 font-medium">
                                        {comprobanteFile ? 'Archivo seleccionado' : 'Seleccionar archivo'}
                                    </span>
                                </label>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf"/>
                                {comprobanteFile && <p className="text-xs text-green-600 mt-1 truncate">✓ {comprobanteFile.name}</p>}
                                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-gray-50 px-8 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onClose} disabled={loading} className={btnSecondary}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading || !comprobanteFile} className={btnPrimary}>
                            {loading ? 'Procesando...' : 'Confirmar y Enviar Pago'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfirmarPagoModal;