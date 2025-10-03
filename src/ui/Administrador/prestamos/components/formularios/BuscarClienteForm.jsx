// ./components/formularios/BuscarClienteForm.jsx

import React from 'react';

const BuscarClienteForm = ({ dni, clienteNombre, handleChange, handleSearchCliente, loading, errors }) => {
    return (
        <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">1. Búsqueda y Selección de Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                {/* Input DNI */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DNI del Cliente</label>
                    <input 
                        type="text" 
                        name="clienteDni" 
                        value={dni}
                        onChange={handleChange}
                        maxLength={8}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.clienteDni && <p className="text-red-500 text-xs mt-1">{errors.clienteDni}</p>}
                </div>
                
                {/* Botón de Búsqueda */}
                <div>
                    <button 
                        type="button" 
                        onClick={handleSearchCliente}
                        disabled={loading || dni.length !== 8}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 disabled:bg-gray-400"
                    >
                        {loading ? 'Buscando...' : 'Buscar Cliente'}
                    </button>
                </div>
                
                {/* Resultado (Solo Lectura) */}
                <div className="col-span-1 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente Seleccionado</label>
                    <p className="p-2 border border-gray-300 bg-gray-100 rounded-md">
                        {clienteNombre || 'N/A'}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default BuscarClienteForm;