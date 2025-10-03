// src/ui/Administrador/empleados/EditarEmpleado/EditarEmpleado.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmpleadoForm from '../components/formularios/EmpleadoForm';
import DatosAccesoForm from '../components/formularios/DatosAccesoForm';
import { getEmpleadoById, updateEmpleado } from 'services/empleadoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';

const EditarEmpleado = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [errors, setErrors] = useState({});

    // Función para mapear datos anidados a un formulario plano (estable con useCallback)
    const mapEmpleadoToForm = useCallback((empleado) => {
        // 🔧 FIX: Acceder a la estructura real del response del backend {type, message, data: {empleado}}
        const rawEmpleado = empleado?.data || empleado; // Si el service ya extrae .data, fallback a empleado directo
        const datos = rawEmpleado?.datos || {}; 

        return {
            ...datos, // Propiedades de datos (nombre, dni, etc.)
            id_Rol: rawEmpleado?.id_Rol || '', // Rol
            
            // Conversión de 0/1 a booleanos de JavaScript. Usamos 'datos' de la línea 27.
            residePeru: datos.residePeru === 1,
            enfermedadesPreexistentes: datos.enfermedadesPreexistentes === 1,
            expuestaPoliticamente: datos.expuestaPoliticamente === 1,

            username: rawEmpleado?.username || '',
        };
    }, []);

     // Cargar datos del empleado
    useEffect(() => {
        const loadEmpleado = async () => {
            setLoading(true);
            try {
                const response = await getEmpleadoById(id);
                
                // 🔧 FIX: Extraer el empleado real del wrapper del response
                const empleado = response?.data || response; // Si service ya hace return res.data, usa response directo
                
                // 🛑 Verificación de seguridad ajustada a la estructura real
                if (!empleado || !empleado.datos) {
                    throw new Error("La estructura de datos del empleado es incorrecta.");
                }
                
                setForm(mapEmpleadoToForm(response)); // Pasamos el response full al mapper
                setAlert(null); 
            } catch (err) {
                // 🔑 Manejo de errores mejorado para API responses
                let message = 'Error desconocido al cargar empleado.';
                if (err.response?.data?.message) {
                    message = err.response.data.message;
                } else if (err.message) {
                    message = err.message;
                } else if (err.details) {
                    message = err.details;
                }
                
                console.error("Error al cargar el empleado:", err);
                
                setAlert({ type: 'error', message: message, details: err.response?.data });
                
                // Redirigir si es error de carga
                setTimeout(() => {
                    navigate('/admin/listar-empleados');
                }, 3000);
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            loadEmpleado();
        }
    }, [id, navigate, mapEmpleadoToForm]);

    // ... (El resto del componente, handleChange, handleCheckboxChange son correctos)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: checked }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setAlert(null);

        try {
             const dataToSend = {
                ...form,
                // Asegura que los booleanos se envíen como 1 o 0
                residePeru: form.residePeru ? 1 : 0,
                enfermedadesPreexistentes: form.enfermedadesPreexistentes ? 1 : 0,
                expuestaPoliticamente: form.expuestaPoliticamente ? 1 : 0,
                // CORRECCIÓN: Quitamos 'username: undefined' para permitir su edición
                
                // 🔑 Envía password y confirmation SOLO si tienen valor
                password: form.password && form.password.length > 0 ? form.password : undefined, 
                password_confirmation: form.password_confirmation && form.password_confirmation.length > 0 ? form.password_confirmation : undefined, 
            };
            
            // Eliminar propiedades undefined (solo password/confirmación si están vacías)
            Object.keys(dataToSend).forEach(key => dataToSend[key] === undefined && delete dataToSend[key]);
            
            const response = await updateEmpleado(id, dataToSend);
            
            // 🚀 REDIRECCIÓN CLAVE: Si la respuesta es exitosa
            if (response.type === 'success') {
                setAlert(response);
                
                // 🛑 Redirigir al usuario a la lista de empleados después de 1 segundo
                setTimeout(() => {
                    navigate('/admin/listar-empleados');
                }, 1000); 
                
            } else {
                setAlert(response);
            }
            
        } catch (err) {
            // Manejo de errores de validación y API
            if (err.errors || err.response?.data?.errors) {
                setErrors(err.errors || err.response.data.errors);
            }
            let alertErr = { type: 'error', message: err.message || 'Error al actualizar empleado.' };
            if (err.response?.data?.message) {
                alertErr.message = err.response.data.message;
                alertErr.details = err.response.data;
            }
            setAlert(alertErr);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading || form === null) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 bg-gray-50">
            {/* CORRECCIÓN: Título dinámico */}
            <h1 className="text-3xl font-bold text-slate-800 mb-8">
                Editar Empleado: {form.nombre} {form.apellidoPaterno} {form.apellidoMaterno} 
            </h1>

            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />

            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-xl rounded-lg space-y-8">
                <EmpleadoForm 
                    form={form} 
                    handleChange={handleChange} 
                    handleCheckboxChange={handleCheckboxChange}
                    errors={errors}
                />
                
                <hr className="border-t border-gray-200" />
                
                {/* En edición, se habilita la edición de username, contraseña y rol */}
                <DatosAccesoForm
                    form={form}
                    handleChange={handleChange}
                    errors={errors}
                    isEditing={true} 
                />

                <div className="flex justify-end pt-2 border-t">
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/listar-empleados')} 
                        className="px-8 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 font-bold mr-2 transition duration-150"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-2 bg-red-800 hover:bg-red-900 text-white font-bold rounded-md transition duration-150 disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? 'Actualizando...' : 'Actualizar Datos'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarEmpleado;