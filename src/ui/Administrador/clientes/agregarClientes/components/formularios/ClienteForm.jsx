import React from 'react';

const ClienteForm = ({ data, handleChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-700 mb-6 border-b pb-2">1. Datos Personales</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Nombre, Apellidos, DNI, etc. */}
        <input name="nombre" value={data.nombre} onChange={handleChange} placeholder="Nombre" className="input-style" />
        <input name="apellidoPaterno" value={data.apellidoPaterno} onChange={handleChange} placeholder="Apellido Paterno" className="input-style" />
        <input name="apellidoMaterno" value={data.apellidoMaterno} onChange={handleChange} placeholder="Apellido Materno" className="input-style" />
        <input name="dni" value={data.dni} onChange={handleChange} placeholder="DNI" className="input-style" maxLength="9" />
        <input name="ruc" value={data.ruc} onChange={handleChange} placeholder="RUC (Opcional)" className="input-style" maxLength="11" />
        <select name="estadoCivil" value={data.estadoCivil} onChange={handleChange} className="input-style">
            <option value="SOLTERO/A">Soltero/a</option>
            <option value="CASADO/A">Casado/a</option>
            <option value="VIUDO/A">Viudo/a</option>
            <option value="DIVORCIADO/A">Divorciado/a</option>
            <option value="CONVIVIENTE">Conviviente</option>
        </select>
        <input name="apellidoConyuge" value={data.apellidoConyuge} onChange={handleChange} placeholder="Apellido Cónyuge (si aplica)" className="input-style" />
         <select name="sexo" value={data.sexo} onChange={handleChange} className="input-style">
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
        </select>
        {/* ... agrega el resto de los campos de 'datos' de la misma manera */}
      </div>
    </div>
  );
};

export default ClienteForm;