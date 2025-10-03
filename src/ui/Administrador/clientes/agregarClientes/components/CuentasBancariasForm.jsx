// components/CuentasBancariasForm.jsx
import React from 'react';

const CuentasBancariasForm = ({ data, handleChange }) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-slate-700 mb-6 border-b pb-2">4.1 Cuentas Bancarias</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="entidadFinanciera" value={data.entidadFinanciera} onChange={handleChange} placeholder="Entidad Financiera" className="input-style" />
        <input name="ctaAhorros" value={data.ctaAhorros} onChange={handleChange} placeholder="Cuenta de Ahorros" className="input-style" />
        <input name="cci" value={data.cci} onChange={handleChange} placeholder="CCI (Opcional)" className="input-style" />
      </div>
    </div>
  );
};
export default CuentasBancariasForm;