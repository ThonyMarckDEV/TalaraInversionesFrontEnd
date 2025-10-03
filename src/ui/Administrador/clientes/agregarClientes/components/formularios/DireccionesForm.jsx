// components/DireccionesForm.jsx
import React from 'react';

const DireccionesForm = ({ data, handleChange }) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-slate-700 mb-6 border-b pb-2">2.1 Dirección</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="direccionFiscal" value={data.direccionFiscal} onChange={handleChange} placeholder="Dirección Fiscal" className="input-style" />
        <input name="referenciaDomicilio" value={data.referenciaDomicilio} onChange={handleChange} placeholder="Referencia" className="input-style" />
        {/* ... resto de campos de dirección */}
      </div>
    </div>
  );
};
export default DireccionesForm;