// ./components/modals/ReducirMoraModal.jsx
import React, { useState, useMemo } from 'react';

const ReducirMoraModal = ({ isOpen, onClose, onConfirm, cuota, loading }) => {
    const [porcentaje, setPorcentaje] = useState(100);

    const moraOriginal = useMemo(() => parseFloat(cuota?.cargo_mora || 0), [cuota]);
    const nuevaMora = useMemo(() => {
        if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) return moraOriginal;
        return moraOriginal * (1 - (porcentaje / 100));
    }, [moraOriginal, porcentaje]);
    
    const montoReducido = useMemo(() => moraOriginal - nuevaMora, [moraOriginal, nuevaMora]);

    if (!isOpen || !cuota) return null;

    const handleConfirm = () => {
        onConfirm({ cuotaId: cuota.id, porcentaje_reduccion: porcentaje });
    };
    
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value === '' || (value >= 0 && value <= 100)) {
            setPorcentaje(value);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Reducir Mora</h2>
                <p className="text-sm text-slate-600 mb-2">Cuota N°: <span className="font-semibold">{cuota.numero_cuota}</span></p>
                <p className="text-sm text-slate-600 mb-4">Fecha Vencimiento: <span className="font-semibold">{new Date(cuota.fecha_vencimiento).toLocaleDateString()}</span></p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="porcentaje" className="block text-sm font-medium text-gray-700 mb-1">
                            Porcentaje de Reducción (%)
                        </label>
                        <input
                            type="number"
                            id="porcentaje"
                            value={porcentaje}
                            onChange={handleInputChange}
                            min="1"
                            max="100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ej: 50"
                        />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Mora Actual:</span>
                            <span className="font-semibold text-red-600">S/. {moraOriginal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-600">Monto a Reducir ({porcentaje}%):</span>
                            <span className="font-semibold text-yellow-700">- S/. {montoReducido.toFixed(2)}</span>
                        </div>
                        <hr/>
                        <div className="flex justify-between font-bold text-base">
                            <span className="text-gray-800">Nueva Mora:</span>
                            <span className="text-green-600">S/. {nuevaMora.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || porcentaje < 1 || porcentaje > 100}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition"
                    >
                        {loading ? 'Aplicando...' : 'Aplicar Reducción'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReducirMoraModal;