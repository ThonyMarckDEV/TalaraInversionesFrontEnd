import React, { useState, useEffect } from 'react';
import { getEmpleadoById } from 'services/empleadoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const ASESOR_ROL_ID = 3;

const AsesorSearchSelect = ({ form, setForm, errors, disabled }) => {
    const [loading, setLoading] = useState(false);
    const [dniInput, setDniInput] = useState(form.asesorDni || '');
    const [alert, setAlert] = useState(null); 

    useEffect(() => {
        setDniInput(form.asesorDni || '');
    }, [form.asesorDni]);

    const handleDniChange = (e) => {
        const { value } = e.target;
        setDniInput(value);
        if (form.id_Asesor) {
            setForm(prev => ({ ...prev, id_Asesor: '', asesorNombre: '', asesorDni: value }));
        }
    };

    const handleSearchAsesor = async () => {
        const dni = dniInput.trim();
        
        if (!dni || dni.length < 8) { 
            setAlert({ type: 'error', message: 'El DNI debe tener 8 o más dígitos.' });
            return;
        }

        setLoading(true);
        setAlert(null);
        
        try {
            const response = await getEmpleadoById(dni); 
            const empleado = response.data;
            
            if (empleado.id_Rol !== ASESOR_ROL_ID) {
                setAlert({ type: 'error', message: 'El DNI no corresponde a un Asesor.' });
                setForm(prev => ({ ...prev, id_Asesor: '', asesorNombre: '' }));
                return;
            }
            
            // --- LÍNEA CORREGIDA ---
            const nombreCompleto = `${empleado.datos.nombre} ${empleado.datos.apellidoPaterno} ${empleado.datos.apellidoMaterno}`.trim();
            
            setForm(prev => ({ 
                ...prev, 
                id_Asesor: empleado.id,
                asesorNombre: nombreCompleto,
                asesorDni: dni
            }));
            setAlert({ type: 'success', message: `Asesor ${nombreCompleto} seleccionado.` });
            
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al buscar empleado. Verifique el DNI.' });
            setForm(prev => ({ ...prev, id_Asesor: '', asesorNombre: '' })); 
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setDniInput('');
        setAlert(null);
        setForm(prev => ({
            ...prev,
            id_Asesor: '',
            asesorNombre: '',
            asesorDni: ''
        }));
    };

    return (
        <div className="space-y-4">
            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                onClose={() => setAlert(null)}
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">DNI del Asesor (Rol 3)</label>
                    <input 
                        type="text" 
                        name="asesorDniInput"
                        value={dniInput}
                        onChange={handleDniChange}
                        maxLength={15}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 disabled:bg-gray-100"
                        disabled={disabled}
                    />
                    {errors.id_Asesor && <p className="text-red-500 text-xs mt-1">{errors.id_Asesor}</p>}
                </div>
                
                <div className="flex gap-2">
                    <button 
                        type="button" 
                        onClick={handleSearchAsesor}
                        disabled={loading || dniInput.length < 8 || disabled}
                        className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-md transition duration-150 disabled:bg-gray-400"
                    >
                        Buscar
                    </button>
                    <button 
                        type="button" 
                        onClick={handleClear}
                        disabled={disabled}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md transition duration-150 disabled:bg-gray-100"
                    >
                        Limpiar
                    </button>
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asesor Seleccionado</label>
                    <p className="p-2 border border-gray-300 bg-gray-100 rounded-md truncate">
                        {form.asesorNombre || 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AsesorSearchSelect;