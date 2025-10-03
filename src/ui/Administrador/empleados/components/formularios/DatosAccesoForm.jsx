import React from 'react';

const DatosAccesoForm = ({ form, handleChange, errors, isEditing }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Datos de Acceso</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campo Rol */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_Rol">
                        Rol <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="id_Rol"
                        name="id_Rol"
                        value={form.id_Rol || ''}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Seleccione Rol</option>
                        {/* 4: Asesor, 5: Cajero (Ajusta según tu backend) */}
                        <option value={4}>Asesor</option>
                        <option value={5}>Cajero</option> 
                    </select>
                    {errors.id_Rol && <p className="text-red-500 text-xs italic mt-1">{errors.id_Rol}</p>}
                </div>
            </div>

            {/* Campos de Acceso (Solo para AGREGAR) */}
            {!isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mt-4">
                    {/* Username */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={form.username || ''}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Nombre de usuario"
                        />
                        {errors.username && <p className="text-red-500 text-xs italic mt-1">{errors.username}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password || ''}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Mínimo 8 caracteres"
                        />
                        {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>}
                    </div>

                    {/* Password Confirmation */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password_confirmation">
                            Confirmar Contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation || ''}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Repita la contraseña"
                        />
                        {errors.password_confirmation && <p className="text-red-500 text-xs italic mt-1">{errors.password_confirmation}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatosAccesoForm;