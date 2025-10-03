// src/components/Shared/ClienteSearchSelect.jsx

import React, { useState } from 'react';
import { showCliente } from 'services/clienteService'; // Importamos el servicio

/**
 * Componente que permite buscar un cliente por DNI/RUC y selecciona su ID.
 * @param {object} form - Objeto de estado del formulario padre.
 * @param {function} setForm - Setter del estado del formulario padre.
 * @param {function} setAlert - Setter para mostrar mensajes de alerta.
 * @param {function} setErrors - Setter para manejar errores de validación.
 * @returns {JSX.Element}
 */
const ClienteSearchSelect = ({ form, setForm, setAlert, setErrors }) => {
    const [loading, setLoading] = useState(false);
    const [dniInput, setDniInput] = useState(form.clienteDni || '');

    // 1. Manejar el cambio del input DNI interno
    const handleDniChange = (e) => {
        const { value } = e.target;
        setDniInput(value);
        setErrors(prev => ({ ...prev, clienteDni: null }));

        // Opcional: Limpiar cliente seleccionado si el DNI cambia
        if (form.id_Cliente && form.clienteDni !== value) {
            setForm(prev => ({ ...prev, id_Cliente: null, clienteNombre: '' }));
        }
    };

    // 2. Lógica de Búsqueda, ahora interna
    const handleSearchCliente = async () => {
        const dni = dniInput.trim();
        
        if (!dni || dni.length < 8) { 
            setErrors(prev => ({ ...prev, clienteDni: 'El DNI o RUC debe tener 8 o más dígitos.' }));
            return;
        }

        setLoading(true);
        setForm(prev => ({ ...prev, id_Cliente: null, clienteNombre: '' }));
        setAlert(null);
        
        try {
            const response = await showCliente(dni); 
            const cliente = response.data;
            
            const nombreCompleto = `${cliente.datos.nombre} ${cliente.datos.apellidoPaterno} ${cliente.datos.apellidoMaterno}`.trim();
            
            // Actualizar el estado del formulario padre (id_Cliente y clienteNombre)
            setForm(prev => ({ 
                ...prev, 
                id_Cliente: cliente.id, 
                clienteNombre: nombreCompleto,
                clienteDni: dni // Aseguramos que el DNI final se guarde
            }));

            setAlert({ type: 'success', message: `Cliente ${nombreCompleto} encontrado y seleccionado.` });
            
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al buscar cliente. Verifique el DNI.' });
            setErrors(prev => ({ ...prev, clienteDni: 'Cliente no encontrado o DNI inválido.' }));
            setForm(prev => ({ ...prev, id_Cliente: null, clienteNombre: '' })); // Limpiar si falla
        } finally {
            setLoading(false);
        }
    };

    const errors = form.errors || {}; // Usar errores del form padre

    return (
        <section>
            <h2 className="text-xl font-semibold text-red-800 mb-4">1. Búsqueda y Selección de Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                
                {/* Input DNI */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DNI del Cliente</label>
                    <input 
                        type="text" 
                        name="dniInput"
                        value={dniInput}
                        onChange={handleDniChange}
                        maxLength={15}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {form.errors.clienteDni && <p className="text-red-500 text-xs mt-1">{form.errors.clienteDni}</p>}
                </div>
                
                {/* Botón de Búsqueda */}
                <div>
                    <button 
                        type="button" 
                        onClick={handleSearchCliente}
                        disabled={loading || dniInput.length < 8}
                        className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-md transition duration-150 disabled:bg-gray-400"
                    >
                        {loading ? 'Buscando...' : 'Buscar Cliente'}
                    </button>
                </div>
                
                {/* Resultado (Solo Lectura) */}
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