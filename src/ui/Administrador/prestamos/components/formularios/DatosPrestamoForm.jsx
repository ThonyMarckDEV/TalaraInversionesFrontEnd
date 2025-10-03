// ./components/formularios/DatosPrestamoForm.jsx

import React from 'react';

const DatosPrestamoForm = ({ form, handleChange, errors }) => {
    return (
        <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">2. Datos del Préstamo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Producto */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                    <select 
                        name="id_Producto" 
                        value={form.id_Producto}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Seleccione Producto</option>
                        {/* Aquí mapearías tus productos cargados del backend */}
                        <option value="1">Microcrédito</option>
                        <option value="2">Hipotecario</option>
                    </select>
                    {errors.id_Producto && <p className="text-red-500 text-xs mt-1">{errors.id_Producto}</p>}
                </div>

                {/* Abono Por */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Abonado Por</label>
                    <select 
                        name="abonado_por" 
                        value={form.abonado_por}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Seleccione</option>
                        <option value="CUENTA CORRIENTE">CUENTA CORRIENTE</option>
                        <option value="CAJA CHICA">CAJA CHICA</option>
                    </select>
                    {errors.abonado_por && <p className="text-red-500 text-xs mt-1">{errors.abonado_por}</p>}
                </div>
                
                {/* Monto del Crédito */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Importe del Crédito (S/.)</label>
                    <input 
                        type="number" 
                        name="monto" 
                        value={form.monto}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.monto && <p className="text-red-500 text-xs mt-1">{errors.monto}</p>}
                </div>

                {/* Tasa de Interés */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tasa Interés (%)</label>
                    <input 
                        type="number" 
                        name="interes" 
                        value={form.interes * 100} // Mostrar como porcentaje para el usuario
                        onChange={(e) => handleChange({ target: { name: 'interes', value: e.target.value / 100 } })} // Guardar como decimal
                        min="0"
                        step="0.01"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.interes && <p className="text-red-500 text-xs mt-1">{errors.interes}</p>}
                </div>

                {/* N° Cuotas */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° Cuotas</label>
                    <input 
                        type="number" 
                        name="cuotas" 
                        value={form.cuotas}
                        onChange={handleChange}
                        min="1"
                        step="1"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.cuotas && <p className="text-red-500 text-xs mt-1">{errors.cuotas}</p>}
                </div>
            </div>
        </section>
    );
};

export default DatosPrestamoForm;