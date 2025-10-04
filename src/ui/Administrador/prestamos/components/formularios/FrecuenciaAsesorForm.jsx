// ./components/formularios/FrecuenciaAsesorForm.jsx (ACTUALIZADO)

import React from 'react';
import AsesorSearchSelect from 'components/Shared/Comboboxes/AsesorSearchSelect';

const FrecuenciaAsesorForm = ({ form, handleChange, errors }) => {
    return (
        <section>
            <h2 className="text-xl font-semibold text-red-800 mb-4">4. Frecuencia, Asesor y Modalidad</h2>
            <div className="grid grid-cols-1 gap-6">
                
                {/* Frecuencia */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de Pago</label>
                    <select 
                        name="frecuencia" 
                        value={form.frecuencia}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                        <option value="">Seleccione Frecuencia</option>
                        <option value="SEMANAL">SEMANAL</option>
                        <option value="CATORCENAL">CATORCENAL</option>
                        <option value="MENSUAL">MENSUAL</option>
                    </select>
                    {errors.frecuencia && <p className="text-red-500 text-xs mt-1">{errors.frecuencia}</p>}
                </div>

                {/* ---------------- ASESOR SELECT BUSCABLE ---------------- */}
                <AsesorSearchSelect
                    form={form}
                    handleChange={handleChange}
                    errors={errors}
                />
                
                {/* Modalidad */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                    <select 
                        name="modalidad" 
                        value={form.modalidad}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                        <option value="">Seleccione Modalidad</option>
                        <option value="NUEVO">NUEVO</option>
                        <option value="RCS">RCS (Renovación Crédito Simple)</option>
                        <option value="RSS">RSS (Renovación Saldo Simple)</option>
                    </select>
                    {errors.modalidad && <p className="text-red-500 text-xs mt-1">{errors.modalidad}</p>}
                </div>
                
            </div>
        </section>
    );
};

export default FrecuenciaAsesorForm;