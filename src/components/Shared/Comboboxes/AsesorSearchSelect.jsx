// src/components/Shared/AsesorSearchSelect.jsx

import React, { useState } from 'react';
import { getEmpleadoById } from 'services/empleadoService'; // Nuevo servicio
import AlertMessage from 'components/Shared/Errors/AlertMessage'; // Reutilizamos el AlertMessage

const ASESOR_ROL_ID = 3; // Definimos el ID del Rol Asesor

/**
 * Componente que permite buscar un Asesor por DNI/RUC y selecciona su ID (id_Asesor).
 * NOTA: Este componente maneja su propia alerta para la búsqueda.
 * @param {object} form - Objeto de estado del formulario padre.
 * @param {function} handleChange - Función de manejo de cambios del formulario padre.
 * @param {object} errors - Objeto de errores del formulario padre.
 * @returns {JSX.Element}
 */
const AsesorSearchSelect = ({ form, handleChange, errors }) => {
    const [loading, setLoading] = useState(false);
    const [dniInput, setDniInput] = useState(form.asesorDni || '');
    const [alert, setAlert] = useState(null); 
    
    // Estado local para el nombre del asesor, ya que form.id_Asesor existe
    const [asesorNombre, setAsesorNombre] = useState('');

    // 1. Manejar el cambio del input DNI interno
    const handleDniChange = (e) => {
        const { value } = e.target;
        setDniInput(value);
        // Limpiar errores y alerta al escribir
        setAlert(null);
        handleChange({ target: { name: 'id_Asesor', value: '' } }); // Limpiar ID del Asesor
        // Opcional: limpiar error de validación de id_Asesor
        errors.id_Asesor = null; 
    };

    // 2. Lógica de Búsqueda
    const handleSearchAsesor = async () => {
        const dni = dniInput.trim();
        
        if (!dni || dni.length < 8) { 
            setAlert({ type: 'error', message: 'El DNI o RUC debe tener 8 o más dígitos.' });
            return;
        }

        setLoading(true);
        setAlert(null);
        handleChange({ target: { name: 'id_Asesor', value: '' } });
        setAsesorNombre('');
        
        try {
            const response = await getEmpleadoById(dni); 
            const empleado = response.data;
            
            // VALIDACIÓN CLAVE: Verificar que el rol sea 3 (Asesor)
            if (empleado.id_Rol !== ASESOR_ROL_ID) {
                setAlert({ type: 'error', message: `El usuario encontrado (${empleado.id_Rol}) no es un Asesor (Rol ${ASESOR_ROL_ID}).` });
                return;
            }
            
            const nombreCompleto = `${empleado.datos.nombre} ${empleado.datos.apellidoPaterno} ${empleado.datos.apellidoMaterno}`.trim();
            
            // Actualizar el estado del formulario padre (id_Asesor)
            handleChange({ target: { name: 'id_Asesor', value: empleado.id } });

            // Actualizar estado local (para la UI) y el DNI en el form padre (si lo necesitas, aunque en este caso solo usamos id_Asesor)
            setAsesorNombre(nombreCompleto);

            setAlert({ type: 'success', message: `Asesor ${nombreCompleto} encontrado y seleccionado.` });
            
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al buscar empleado. Verifique el DNI.' });
            // Forzamos la limpieza en caso de error
            handleChange({ target: { name: 'id_Asesor', value: '' } }); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                onClose={() => setAlert(null)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                
                {/* Input DNI */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DNI del Asesor (Rol 3)</label>
                    <input 
                        type="text" 
                        name="asesorDniInput"
                        value={dniInput}
                        onChange={handleDniChange}
                        maxLength={15}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                    {errors.id_Asesor && <p className="text-red-500 text-xs mt-1">{errors.id_Asesor}</p>}
                </div>
                
                {/* Botón de Búsqueda */}
                <div>
                    <button 
                        type="button" 
                        onClick={handleSearchAsesor}
                        disabled={loading || dniInput.length < 8}
                        className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-md transition duration-150 disabled:bg-gray-400"
                    >
                        {loading ? 'Buscando...' : 'Buscar Asesor'}
                    </button>
                </div>
                
                {/* Resultado (Solo Lectura) */}
                <div className="col-span-1 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asesor Seleccionado (ID: {form.id_Asesor || 'N/A'})</label>
                    <p className="p-2 border border-gray-300 bg-gray-100 rounded-md">
                        {asesorNombre || 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AsesorSearchSelect;