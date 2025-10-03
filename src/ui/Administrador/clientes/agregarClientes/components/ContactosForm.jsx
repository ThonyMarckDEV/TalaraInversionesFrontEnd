// components/ContactosForm.jsx
import React from 'react';

const ContactosForm = ({ data, handleChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-700 mb-6 border-b pb-2">2.2 Contacto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="telefonoMovil" value={data.telefonoMovil} onChange={handleChange} placeholder="Teléfono Móvil" className="input-style" />
        <input type="email" name="correo" value={data.correo} onChange={handleChange} placeholder="Correo Electrónico" className="input-style" />
        {/* ... resto de campos de contacto */}
      </div>
    </div>
  );
};

export default ContactosForm;