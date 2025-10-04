import React from 'react';
import ProductoSelect from 'components/Shared/Comboboxes/ProductoSelect';

const DatosPrestamoForm = ({ form, handleChange, errors, isFormLocked }) => { 
    return (
        <section>
            <h2 className="text-xl font-semibold text-red-800 mb-4">2. Datos del Préstamo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <ProductoSelect
                    value={form.id_Producto}
                    onChange={handleChange}
                    errors={errors}
                    disabled={isFormLocked}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Abonado Por</label>
                    <select 
                        name="abonado_por" 
                        value={form.abonado_por}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                        disabled={isFormLocked}
                    >
                        <option value="">Seleccione</option>
                        <option value="CUENTA CORRIENTE">CUENTA CORRIENTE</option>
                        <option value="CAJA CHICA">CAJA CHICA</option>
                    </select>
                    {errors.abonado_por && <p className="text-red-500 text-xs mt-1">{errors.abonado_por}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Importe del Crédito (S/.)</label>
                    <input 
                        type="number" 
                        name="monto" 
                        value={form.monto}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                        disabled={isFormLocked}
                    />
                    {errors.monto && <p className="text-red-500 text-xs mt-1">{errors.monto}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tasa Interés (%)</label>
                    <input 
                        type="number" 
                        name="interes" 
                        value={form.interes * 100} 
                        onChange={(e) => handleChange({ target: { name: 'interes', value: e.target.value / 100 } })} 
                        min="0"
                        step="0.01"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                        disabled={isFormLocked}
                    />
                    {errors.interes && <p className="text-red-500 text-xs mt-1">{errors.interes}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° Cuotas</label>
                    <input 
                        type="number" 
                        name="cuotas" 
                        value={form.cuotas}
                        onChange={handleChange}
                        min="1"
                        step="1"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                        disabled={isFormLocked}
                    />
                    {errors.cuotas && <p className="text-red-500 text-xs mt-1">{errors.cuotas}</p>}
                </div>
            </div>
        </section>
    );
};

export default DatosPrestamoForm;