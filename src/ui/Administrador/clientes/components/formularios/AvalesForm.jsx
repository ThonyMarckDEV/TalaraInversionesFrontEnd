// components/AvalesForm.jsx
import React from 'react';

const AvalesForm = ({ avales, setAvales }) => {

  const addAval = () => {
    setAvales([
      ...avales,
      {
        // === CAMBIO: Estado inicial ahora incluye todos los campos ===
        dniAval: '',
        apellidoPaternoAval: '',
        apellidoMaternoAval: '',
        nombresAval: '',
        telefonoFijoAval: '',
        telefonoMovilAval: '',
        direccionAval: '',
        referenciaDomicilioAval: '',
        departamentoAval: '',
        provinciaAval: '',
        distritoAval: '',
        relacionClienteAval: '',
      },
    ]);
  };

  const removeAval = (indexToRemove) => {
    setAvales(avales.filter((_, index) => index !== indexToRemove));
  };

  const handleAvalChange = (e, index) => {
    const { name, value } = e.target;
    const updatedAvales = avales.map((aval, i) =>
      i === index ? { ...aval, [name]: value } : aval
    );
    setAvales(updatedAvales);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-xl font-semibold text-slate-700">4.2 Avales</h2>
        <button type="button" onClick={addAval} className="px-4 py-1 text-sm text-white bg-red-700 rounded-md hover:bg-red-800">
          + Agregar Aval
        </button>
      </div>

      {avales.length === 0 && (
        <div className="text-center py-4 border-2 border-dashed rounded-lg text-gray-500">
            <p>No se han agregado avales.</p>
        </div>
      )}

      <div className="space-y-8">
        {avales.map((aval, index) => (
          <div key={index} className="bg-slate-50 p-6 rounded-lg border relative shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-700">Aval #{index + 1}</h3>
                <button
                    type="button"
                    onClick={() => removeAval(index)}
                    className="text-gray-400 hover:text-red-600 font-bold text-2xl leading-none"
                    title="Eliminar Aval"
                >
                    &times;
                </button>
            </div>
            
            {/* === CAMBIO: Formulario ahora completo y con etiquetas === */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
              {/* --- Datos Personales del Aval --- */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">DNI del Aval</label>
                <input name="dniAval" value={aval.dniAval} onChange={(e) => handleAvalChange(e, index)} placeholder="########" className="input-style" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Nombres</label>
                <input name="nombresAval" value={aval.nombresAval} onChange={(e) => handleAvalChange(e, index)} placeholder="Nombres completos" className="input-style" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Apellido Paterno</label>
                <input name="apellidoPaternoAval" value={aval.apellidoPaternoAval} onChange={(e) => handleAvalChange(e, index)} placeholder="Apellido Paterno" className="input-style" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Apellido Materno</label>
                <input name="apellidoMaternoAval" value={aval.apellidoMaternoAval} onChange={(e) => handleAvalChange(e, index)} placeholder="Apellido Materno" className="input-style" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Relación con Cliente</label>
                <input name="relacionClienteAval" value={aval.relacionClienteAval} onChange={(e) => handleAvalChange(e, index)} placeholder="Ej. Padre, Amigo" className="input-style" />
              </div>

              {/* --- Contacto del Aval --- */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Teléfono Móvil</label>
                <input name="telefonoMovilAval" value={aval.telefonoMovilAval} onChange={(e) => handleAvalChange(e, index)} placeholder="987654321" className="input-style" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Teléfono Fijo <span className="text-slate-400">(Opcional)</span></label>
                <input name="telefonoFijoAval" value={aval.telefonoFijoAval} onChange={(e) => handleAvalChange(e, index)} placeholder="073123456" className="input-style" />
              </div>
              <div className="md:col-span-1"></div> {/* Espacio en blanco para alinear */}

              {/* --- Dirección del Aval --- */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-600 mb-1">Dirección</label>
                <input name="direccionAval" value={aval.direccionAval} onChange={(e) => handleAvalChange(e, index)} placeholder="Dirección completa del aval" className="input-style" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-600 mb-1">Referencia de Domicilio</label>
                <input name="referenciaDomicilioAval" value={aval.referenciaDomicilioAval} onChange={(e) => handleAvalChange(e, index)} placeholder="Referencia del domicilio del aval" className="input-style" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Departamento</label>
                <input name="departamentoAval" value={aval.departamentoAval} onChange={(e) => handleAvalChange(e, index)} placeholder="Departamento" className="input-style" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Provincia</label>
                <input name="provinciaAval" value={aval.provinciaAval} onChange={(e) => handleAvalChange(e, index)} placeholder="Provincia" className="input-style" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Distrito</label>
                <input name="distritoAval" value={aval.distritoAval} onChange={(e) => handleAvalChange(e, index)} placeholder="Distrito" className="input-style" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvalesForm;