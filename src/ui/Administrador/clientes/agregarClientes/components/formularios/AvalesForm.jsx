// components/AvalesForm.jsx
import React from 'react';

const AvalesForm = ({ avales, setAvales }) => {

  const addAval = () => {
    setAvales([
      ...avales,
      {
        dniAval: '',
        apellidoPaternoAval: '',
        apellidoMaternoAval: '',
        nombresAval: '',
        telefonoMovilAval: '',
        direccionAval: '',
        // ... otros campos del aval inicializados en vacío
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

      {avales.length === 0 && <p className="text-gray-500">No se han agregado avales.</p>}

      <div className="space-y-8">
        {avales.map((aval, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border relative">
            <h3 className="font-bold text-gray-600 mb-4">Aval #{index + 1}</h3>
             <button
              type="button"
              onClick={() => removeAval(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
              title="Eliminar Aval"
            >
              &times;
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                name="dniAval"
                value={aval.dniAval}
                onChange={(e) => handleAvalChange(e, index)}
                placeholder="DNI del Aval"
                className="input-style"
              />
              <input
                name="nombresAval"
                value={aval.nombresAval}
                onChange={(e) => handleAvalChange(e, index)}
                placeholder="Nombres"
                className="input-style"
              />
               <input
                name="apellidoPaternoAval"
                value={aval.apellidoPaternoAval}
                onChange={(e) => handleAvalChange(e, index)}
                placeholder="Apellido Paterno"
                className="input-style"
              />
               <input
                name="telefonoMovilAval"
                value={aval.telefonoMovilAval}
                onChange={(e) => handleAvalChange(e, index)}
                placeholder="Teléfono Móvil"
                className="input-style"
              />
               <input
                name="direccionAval"
                value={aval.direccionAval}
                onChange={(e) => handleAvalChange(e, index)}
                placeholder="Dirección"
                className="input-style md:col-span-2"
              />
              {/* ... resto de campos del aval */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvalesForm;