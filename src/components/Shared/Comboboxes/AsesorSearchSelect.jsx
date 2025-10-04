import React, { useState , useEffect } from 'react';
import { getEmpleadoById } from 'services/empleadoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const ASESOR_ROL_ID = 3;

const AsesorSearchSelect = ({ form, handleChange, errors, disabled }) => {
    const [loading, setLoading] = useState(false);
    const [dniInput, setDniInput] = useState(form.asesorDni || '');
    const [alert, setAlert] = useState(null); 
    const [asesorNombre, setAsesorNombre] = useState('');

    useEffect(() => {
        if (form.id_Asesor === '' && form.asesorDni === '') {
            setDniInput('');
            setAsesorNombre('');
        }
    }, [form.id_Asesor, form.asesorDni]);

    const handleDniChange = (e) => {
        const { value } = e.target;
        setDniInput(value);
        handleChange({ target: { name: 'id_Asesor', value: '' } }); 
        setAsesorNombre('');
    };

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
            
            if (empleado.id_Rol !== ASESOR_ROL_ID) {
                setAlert({ type: 'error', message: `El usuario encontrado no es un Asesor (Rol ${ASESOR_ROL_ID}).` });
                return;
            }
            
            const nombreCompleto = `${empleado.datos.nombre} ${empleado.datos.apellidoPaterno} ${empleado.datos.apellidoMaterno}`.trim();
            
            handleChange({ target: { name: 'id_Asesor', value: empleado.id } });
            setAsesorNombre(nombreCompleto);
            setAlert({ type: 'success', message: `Asesor ${nombreCompleto} encontrado y seleccionado.` });
            
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al buscar empleado. Verifique el DNI.' });
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
                
                <div>
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
                
                <div>
                    <button 
                        type="button" 
                        onClick={handleSearchAsesor}
                        disabled={loading || dniInput.length < 8 || disabled}
                        className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-md transition duration-150 disabled:bg-gray-400"
                    >
                        {loading ? 'Buscando...' : 'Buscar Asesor'}
                    </button>
                </div>
                
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