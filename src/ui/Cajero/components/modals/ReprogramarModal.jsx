import React, { useState } from 'react';

const ReprogramarModal = ({ isOpen, onClose, onConfirm, prestamo, deudaTotal, loading }) => {
    const [nuevaTasa, setNuevaTasa] = useState(0.05); // 5% por defecto
    const [nuevaFrecuencia, setNuevaFrecuencia] = useState('');

    const frecuencias = ['SEMANAL', 'CATORCENAL', 'MENSUAL'];
    const frecuenciasDisponibles = frecuencias.filter(f => f !== prestamo.frecuencia);

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({
            prestamo_id: prestamo.id,
            nueva_tasa: nuevaTasa,
            nueva_frecuencia: nuevaFrecuencia,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
                <form onSubmit={handleSubmit}>
                    <div className="p-5 border-b">
                        <h2 className="text-xl font-bold text-slate-800">Reprogramar Préstamo #{prestamo.id}</h2>
                        <p className="text-sm text-gray-500">Se creará un nuevo préstamo con el saldo pendiente.</p>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="text-center bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-800">Saldo Pendiente a Reprogramar</p>
                            <p className="text-3xl font-bold text-blue-900">S/ {deudaTotal.toFixed(2)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Tasa de Interés</label>
                            <select value={nuevaTasa} onChange={(e) => setNuevaTasa(parseFloat(e.target.value))} className="input-style">
                                <option value={0.01}>1%</option>
                                <option value={0.02}>2%</option>
                                <option value={0.03}>3%</option>
                                <option value={0.04}>4%</option>
                                <option value={0.05}>5%</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Frecuencia</label>
                            <select value={nuevaFrecuencia} onChange={(e) => setNuevaFrecuencia(e.target.value)} className="input-style" required>
                                <option value="">Seleccione...</option>
                                {frecuenciasDisponibles.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onClose} disabled={loading} className="btn-secondary">Cancelar</button>
                        <button type="submit" disabled={loading || !nuevaFrecuencia} className="btn-primary bg-yellow-600 hover:bg-yellow-700">
                            {loading ? 'Procesando...' : 'Confirmar Reprogramación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReprogramarModal;