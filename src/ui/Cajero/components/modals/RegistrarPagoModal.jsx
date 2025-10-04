import React, { useState } from 'react';

const RegistrarPagoModal = ({ cuota, onConfirm, onClose, loading }) => {
    const [formData, setFormData] = useState({
        id_Cuota: cuota.id,
        monto_pagado: parseFloat(cuota.monto).toFixed(2),
        fecha_pago: new Date().toISOString().split('T')[0], // Hoy por defecto
        modalidad: 'PRESENCIAL',
        numero_operacion: '',
        observaciones: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold">Registrar Pago de Cuota #{cuota.numero_cuota}</h2>
                        <p className="text-sm text-gray-500">Préstamo ID: {cuota.id_Prestamo}</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Monto a Pagar</label>
                            <input type="number" name="monto_pagado" value={formData.monto_pagado} onChange={handleChange} className="input-style" step="0.01" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Fecha de Pago</label>
                            <input type="date" name="fecha_pago" value={formData.fecha_pago} onChange={handleChange} className="input-style" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Modalidad de Pago</label>
                            <select name="modalidad" value={formData.modalidad} onChange={handleChange} className="input-style">
                                <option value="PRESENCIAL">Presencial</option>
                                <option value="VIRTUAL">Virtual</option>
                            </select>
                        </div>
                        {formData.modalidad === 'VIRTUAL' && (
                            <div>
                                <label className="block text-sm font-medium">Número de Operación</label>
                                <input type="text" name="numero_operacion" value={formData.numero_operacion} onChange={handleChange} className="input-style" placeholder="Ej. Yape, Plin, Transferencia" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium">Observaciones</label>
                            <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className="input-style" rows="2"></textarea>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={loading} className="btn-secondary">Cancelar</button>
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