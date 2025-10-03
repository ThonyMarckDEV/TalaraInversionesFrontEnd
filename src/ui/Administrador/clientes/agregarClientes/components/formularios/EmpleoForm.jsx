// components/EmpleoForm.jsx
import React from 'react';

const EmpleoForm = ({ data, handleChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-700 mb-6 border-b pb-2">3. Información Laboral</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="centroLaboral" value={data.centroLaboral} onChange={handleChange} placeholder="Centro Laboral" className="input-style" />
        <input type="number" name="ingresoMensual" value={data.ingresoMensual} onChange={handleChange} placeholder="Ingreso Mensual (S/.)" className="input-style" />
        {/* ... resto de campos de empleo */}
      </div>
    </div>
  );
};
export default EmpleoForm;

