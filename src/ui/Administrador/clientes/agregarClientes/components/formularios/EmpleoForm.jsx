// components/EmpleoForm.jsx
import React from 'react';

const EmpleoForm = ({ data, handleChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-700 mb-6 border-b pb-2">3. Información Laboral</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        
        <div>
          <label htmlFor="centroLaboral" className="block text-sm font-medium text-slate-600 mb-1">
            Centro Laboral o Negocio
          </label>
          <input
            id="centroLaboral"
            name="centroLaboral"
            type="text"
            value={data.centroLaboral}
            onChange={handleChange}
            placeholder="Nombre de la empresa o negocio"
            className="input-style"
          />
        </div>

        <div>
          <label htmlFor="situacionLaboral" className="block text-sm font-medium text-slate-600 mb-1">
            Situación Laboral
          </label>
          <select
            id="situacionLaboral"
            name="situacionLaboral"
            value={data.situacionLaboral}
            onChange={handleChange}
            className="input-style"
          >
            <option value="">Seleccione...</option>
            <option value="DEPENDIENTE">Dependiente (en planilla)</option>
            <option value="INDEPENDIENTE">Independiente</option>
            <option value="JUBILADO">Jubilado / Pensionista</option>
            <option value="AMA DE CASA">Ama de Casa</option>
            <option value="ESTUDIANTE">Estudiante</option>
            <option value="DESEMPLEADO">Desempleado</option>
          </select>
        </div>

        <div>
          <label htmlFor="ingresoMensual" className="block text-sm font-medium text-slate-600 mb-1">
            Ingreso Mensual (S/.)
          </label>
          <input
            id="ingresoMensual"
            name="ingresoMensual"
            type="number"
            value={data.ingresoMensual}
            onChange={handleChange}
            placeholder="Ej. 1500"
            className="input-style"
          />
        </div>
        
        <div>
          <label htmlFor="inicioLaboral" className="block text-sm font-medium text-slate-600 mb-1">
            Fecha de Inicio Laboral
          </label>
          <input
            id="inicioLaboral"
            name="inicioLaboral"
            type="date"
            value={data.inicioLaboral}
            onChange={handleChange}
            className="input-style"
          />
        </div>
        
      </div>
    </div>
  );
};

export default EmpleoForm;