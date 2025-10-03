// ./components/formularios/FrecuenciaAsesorForm.jsx

import React from 'react';

const FrecuenciaAsesorForm = ({ form, handleChange, errors }) => {
    return (
        <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">4. Frecuencia, Asesor y Modalidad</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Frecuencia */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de Pago</label>
                    <select 
                        name="frecuencia" 
                        value={form.frecuencia}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Seleccione Frecuencia</option>
                        <option value="SEMANAL">SEMANAL</option>
                        <option value="CATORCENAL">CATORCENAL</option>
                        <option value="MENSUAL">MENSUAL</option>
                    </select>
                    {errors.frecuencia && <p className="text-red-500 text-xs mt-1">{errors.frecuencia}</p>}
                </div>

                {/* Modalidad */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                    <select 
                        name="modalidad" 
                        value={form.modalidad}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Seleccione Modalidad</option>
                        <option value="NUEVO">NUEVO</option>
                        <option value="RCS">RCS (Renovación Crédito Simple)</option>
                        <option value="RSS">RSS (Renovación Saldo Simple)</option>
                    </select>
                    {errors.modalidad && <p className="text-red-500 text-xs mt-1">{errors.modalidad}</p>}
                </div>

                {/* Asesor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asesor Responsable</label>
                    <select 
                        name="id_Asesor" 
                        value={form.id_Asesor}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Seleccione Asesor</option>
                        {/* Aquí mapearías a los asesores cargados del backend */}
                        <option value="5">Juan Pérez (Asesor)</option>
                        <option value="6">María Lopez (Asesor)</option>
                    </select>
                    {errors.id_Asesor && <p className="text-red-500 text-xs mt-1">{errors.id_Asesor}</p>}
                </div>
            </div>
        </section>
    );
};

export default FrecuenciaAsesorForm;