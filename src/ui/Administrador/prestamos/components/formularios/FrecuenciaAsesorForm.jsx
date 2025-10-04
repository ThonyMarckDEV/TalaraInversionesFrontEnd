import React from 'react';
import AsesorSearchSelect from 'components/Shared/Comboboxes/AsesorSearchSelect';

const FrecuenciaAsesorForm = ({ form, handleChange, setForm, errors, isFormLocked, isEditing = false }) => {
    
    const modalidadLabels = {
        NUEVO: 'NUEVO',
        RCS: 'RCS (Renovación Crédito Simple)',
        RSS: 'RSS (Renovación Saldo Simple)'
    };

    return (
        <section>
            <h2 className="text-xl font-semibold text-red-800 mb-4">4. Frecuencia, Asesor y Modalidad</h2>
            <div className="grid grid-cols-1 gap-6">
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de Pago</label>
                    <select 
                        name="frecuencia" 
                        value={form.frecuencia}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100"
                        disabled={isFormLocked}
                    >
                        <option value="">Seleccione Frecuencia</option>
                        <option value="SEMANAL">SEMANAL</option>
                        <option value="CATORCENAL">CATORCENAL</option>
                        <option value="MENSUAL">MENSUAL</option>
                    </select>
                    {errors.frecuencia && <p className="text-red-500 text-xs mt-1">{errors.frecuencia}</p>}
                </div>

                {/* --- CORRECCIÓN AQUÍ ---
                    Pasamos 'setForm' en lugar del 'handleChange' complicado */}
                <AsesorSearchSelect
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    disabled={isFormLocked}
                />
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                    {isEditing ? (
                        <p className="p-2 border border-gray-300 bg-gray-100 rounded-md">
                            {modalidadLabels[form.modalidad] || form.modalidad || 'N/A'}
                        </p>
                    ) : (
                        <p className="p-2 border border-gray-300 bg-gray-100 rounded-md">
                            {!form.id_Cliente 
                                ? 'Seleccione un cliente primero' 
                                : (modalidadLabels[form.modalidad] || 'Modalidad no aplicable')}
                        </p>
                    )}
                </div>
                
            </div>
        </section>
    );
};

export default FrecuenciaAsesorForm;