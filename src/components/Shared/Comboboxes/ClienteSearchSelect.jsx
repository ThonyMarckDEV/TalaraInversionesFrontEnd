import React, { useState , useEffect } from 'react';
import { showCliente } from 'services/clienteService';

const ClienteSearchSelect = ({ form, setForm, setAlert, setErrors, disabled }) => {
    const [loading, setLoading] = useState(false);
    const [dniInput, setDniInput] = useState(form.clienteDni || '');

    useEffect(() => {
        if (form.id_Cliente === null && form.clienteDni === '') {
            setDniInput('');
        }
    }, [form.id_Cliente, form.clienteDni]);

    const handleDniChange = (e) => {
        const { value } = e.target;
        setDniInput(value);
        
        if (form.id_Cliente && form.clienteDni !== value) {
             setForm(prev => ({ 
                ...prev, 
                id_Cliente: null, 
                clienteNombre: '', 
                modalidad_cliente: ''
            }));
        }
    };

    const handleSearchCliente = async () => {
        const dni = dniInput.trim();
        
        if (!dni || dni.length < 8) { 
            setErrors(prev => ({ ...prev, clienteDni: 'El DNI o RUC debe tener 8 o más dígitos.' }));
            return;
        }

        setLoading(true);
        setForm(prev => ({ ...prev, id_Cliente: null, clienteNombre: '', modalidad_cliente: '' }));
        setAlert(null);
        
        try {
            const response = await showCliente(dni); 
            const cliente = response.data;
            
            const nombreCompleto = `${cliente.datos.nombre} ${cliente.datos.apellidoPaterno} ${cliente.datos.apellidoMaterno}`.trim();
            
            setForm(prev => ({ 
                ...prev, 
                id_Cliente: cliente.id, 
                clienteNombre: nombreCompleto,
                clienteDni: dni,
                modalidad_cliente: cliente.modalidad_cliente
            }));

            setAlert({ type: 'success', message: `Cliente ${nombreCompleto} encontrado y seleccionado.` });
            
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al buscar cliente. Verifique el DNI.' });
            setErrors(prev => ({ ...prev, clienteDni: 'Cliente no encontrado o DNI inválido.' }));
            setForm(prev => ({ ...prev, id_Cliente: null, clienteNombre: '', modalidad_cliente: '' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2 className="text-xl font-semibold text-red-800 mb-4">1. Búsqueda y Selección de Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DNI del Cliente</label>
                    <input 
                        type="text" 
                        name="dniInput"
                        value={dniInput}
                        onChange={handleDniChange}
                        maxLength={15}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                        disabled={disabled}
                    />
                    {form.errors.clienteDni && <p className="text-red-500 text-xs mt-1">{form.errors.clienteDni}</p>}
                </div>
                
                <div>
                    <button 
                        type="button" 
                        onClick={handleSearchCliente}
                        disabled={loading || dniInput.length < 8 || disabled}
                        className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-md transition duration-150 disabled:bg-gray-400"
                    >
                        {loading ? 'Buscando...' : 'Buscar Cliente'}
                    </button>
                </div>
                
                <div className="col-span-1 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente Seleccionado</label>
                    <p className="p-2 border border-gray-300 bg-gray-100 rounded-md">
                        {form.clienteNombre || 'N/A'}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ClienteSearchSelect;