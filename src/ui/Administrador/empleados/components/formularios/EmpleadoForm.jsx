import React from 'react';

const EmpleadoForm = ({ form, handleChange, handleCheckboxChange, errors }) => {
    // Helper para input de texto
    const renderInput = (id, label, type = 'text', required = true, isDNI = false) => (
        <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                type={type}
                name={id}
                value={form[id] || ''}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={isDNI ? 8 : undefined}
            />
            {errors[id] && <p className="text-red-500 text-xs italic mt-1">{errors[id]}</p>}
        </div>
    );

    // Helper para select
    const renderSelect = (id, label, options, required = true) => (
        <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={id}
                name={id}
                value={form[id] || ''}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="">Seleccione...</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {errors[id] && <p className="text-red-500 text-xs italic mt-1">{errors[id]}</p>}
        </div>
    );

    // Helper para checkbox/boolean
    const renderCheckbox = (id, label) => (
        <div className="flex items-center mt-6">
            <input
                id={id}
                type="checkbox"
                name={id}
                checked={!!form[id]} // Asegura que es un booleano
                onChange={handleCheckboxChange}
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
                {label}
            </label>
             {errors[id] && <p className="text-red-500 text-xs italic mt-1">{errors[id]}</p>}
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">Datos Personales del Empleado</h2>

            {/* Fila 1: Nombres y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {renderInput('nombre', 'Nombre')}
                {renderInput('apellidoPaterno', 'Apellido Paterno')}
                {renderInput('apellidoMaterno', 'Apellido Materno')}
                {renderInput('apellidoConyuge', 'Apellido Cónyuge', 'text', false)}
            </div>

            {/* Fila 2: DNI, Sexo, Estado Civil */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {renderInput('dni', 'DNI', 'text', true, true)}
                {renderSelect('sexo', 'Sexo', ['Masculino', 'Femenino'])}
                {renderSelect('estadoCivil', 'Estado Civil', ['SOLTERO/A', 'CASADO/A', 'VIUDO/A', 'DIVORCIADO/A' , 'CONVIVIENTE'])}
                {renderInput('nacionalidad', 'Nacionalidad')}
            </div>
            
            {/* Fila 3: Fechas y Residencia */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {renderInput('fechaNacimiento', 'Fecha Nacimiento', 'date')}
                {renderInput('fechaCaducidadDni', 'Fecha Caducidad DNI', 'date')}
                {renderCheckbox('residePeru', '¿Reside actualmente en Perú?')}
                {renderInput('ruc', 'RUC (Opcional)', 'text', false)}
            </div>
            
            {/* Fila 4: Educación y Profesión */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {renderSelect('nivelEducativo', 'Nivel Educativo', ['Primaria', 'Secundaria', 'Técnico', 'Universitario', 'Postgrado'])}
                {renderInput('profesion', 'Profesión')}
                {renderCheckbox('enfermedadesPreexistentes', '¿Tiene enfermedades preexistentes?')}
                {renderCheckbox('expuestaPoliticamente', '¿Persona Políticamente Expuesta (PPE)?')}
            </div>
        </div>
    );
};

export default EmpleadoForm;