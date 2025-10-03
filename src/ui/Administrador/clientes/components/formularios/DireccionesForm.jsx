// components/DireccionesForm.jsx
import React, { useState, useEffect } from 'react';
import peruData from 'utilities/PeruData/PeruData'; // Ajusta la ruta si es necesario

const DireccionesForm = ({ data, handleChange }) => {
  // Estados locales para manejar las listas de provincias y distritos
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  // Obtenemos la lista de departamentos una sola vez
  const departamentos = Object.keys(peruData);

  // EFECTO 1: Se ejecuta cuando el departamento cambia
  useEffect(() => {
    if (data.departamento) {
      setProvincias(Object.keys(peruData[data.departamento]));
    } else {
      setProvincias([]);
    }
    setDistritos([]);
  }, [data.departamento]);

  // EFECTO 2: Se ejecuta cuando la provincia cambia
  useEffect(() => {
    if (data.departamento && data.provincia) {
      if (data.departamento === 'LIMA' && data.provincia === 'LIMA') {
        setDistritos(peruData.LIMA.LIMA);
      } else {
        setDistritos(peruData[data.departamento][data.provincia]);
      }
    } else {
      setDistritos([]);
    }
  }, [data.departamento, data.provincia]);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-slate-700 mb-6 border-b pb-2">2.1 Dirección del Cliente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">

        {/* --- Departamento, Provincia, Distrito --- */}
        <div>
          <label htmlFor="departamento" className="block text-sm font-medium text-slate-600 mb-1">Departamento</label>
          <select id="departamento" name="departamento" value={data.departamento} onChange={handleChange} className="input-style">
            <option value="">Seleccione Departamento...</option>
            {departamentos.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="provincia" className="block text-sm font-medium text-slate-600 mb-1">Provincia</label>
          <select id="provincia" name="provincia" value={data.provincia} onChange={handleChange} className="input-style" disabled={!data.departamento}>
            <option value="">Seleccione Provincia...</option>
            {provincias.map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="distrito" className="block text-sm font-medium text-slate-600 mb-1">Distrito</label>
          <select id="distrito" name="distrito" value={data.distrito} onChange={handleChange} className="input-style" disabled={!data.provincia}>
            <option value="">Seleccione Distrito...</option>
            {distritos.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
        
        {/* --- Direcciones --- */}
        <div className="lg:col-span-3">
          <label htmlFor="direccionFiscal" className="block text-sm font-medium text-slate-600 mb-1">Dirección Fiscal</label>
          {/* === CAMBIO: de <input> a <textarea> para más espacio === */}
          <textarea
            id="direccionFiscal"
            name="direccionFiscal"
            rows="2" // <-- Altura de 2 líneas
            value={data.direccionFiscal}
            onChange={handleChange}
            placeholder="Ej. Av. El Sol 123, Urb. Los Girasoles"
            className="input-style"
          />
        </div>
        <div className="lg:col-span-3">
          <label htmlFor="direccionCorrespondencia" className="block text-sm font-medium text-slate-600 mb-1">Dirección de Correspondencia</label>
          {/* === CAMBIO: de <input> a <textarea> para más espacio === */}
          <textarea
            id="direccionCorrespondencia"
            name="direccionCorrespondencia"
            rows="2" // <-- Altura de 2 líneas
            value={data.direccionCorrespondencia}
            onChange={handleChange}
            placeholder="Dejar en blanco si es la misma que la fiscal"
            className="input-style"
          />
        </div>
        <div className="lg:col-span-3">
          <label htmlFor="referenciaDomicilio" className="block text-sm font-medium text-slate-600 mb-1">Referencia de Domicilio</label>
          {/* === CAMBIO: de <input> a <textarea> para más espacio === */}
          <textarea
            id="referenciaDomicilio"
            name="referenciaDomicilio"
            rows="2" // <-- Altura de 2 líneas
            value={data.referenciaDomicilio}
            onChange={handleChange}
            placeholder="Ej. Frente al parque, casa de dos pisos con portón rojo"
            className="input-style"
          />
        </div>

        {/* --- Datos de Vivienda --- */}
        <div>
          <label htmlFor="tipoVivienda" className="block text-sm font-medium text-slate-600 mb-1">Tipo de Vivienda</label>
          <select id="tipoVivienda" name="tipoVivienda" value={data.tipoVivienda} onChange={handleChange} className="input-style">
            <option value="">Seleccione...</option>
            <option value="PROPIA">Propia</option>
            <option value="ALQUILADA">Alquilada</option>
            <option value="FAMILIAR">Familiar</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
        <div>
          <label htmlFor="tiempoResidencia" className="block text-sm font-medium text-slate-600 mb-1">Tiempo de Residencia</label>
          <input id="tiempoResidencia" name="tiempoResidencia" type="text" value={data.tiempoResidencia} onChange={handleChange} placeholder="Ej. 2 años y 5 meses" className="input-style" />
        </div>

      </div>
    </div>
  );
};

export default DireccionesForm;