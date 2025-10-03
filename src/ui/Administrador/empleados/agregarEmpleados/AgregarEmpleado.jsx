import React, { useState } from 'react';
import EmpleadoForm from '../components/formularios/EmpleadoForm';
import DatosAccesoForm from '../components/formularios/DatosAccesoForm';
import { createEmpleado } from 'services/empleadoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { useNavigate } from 'react-router-dom';

const initialFormState = {
    // Datos personales
    nombre: '', apellidoPaterno: '', apellidoMaterno: '', apellidoConyuge: '',
    estadoCivil: '', sexo: '', dni: '', fechaNacimiento: '', fechaCaducidadDni: '',
    nacionalidad: '', residePeru: false, nivelEducativo: '', profesion: '',
    enfermedadesPreexistentes: false, ruc: '', expuestaPoliticamente: false,
    // Datos de acceso
    username: '', password: '', password_confirmation: '', id_Rol: '',
};

const AgregarEmpleado = () => {
    const [form, setForm] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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
                // Asegura que los booleanos se envíen como 1 o 0 (si Laravel lo requiere, aunque el Request lo maneja)
                residePeru: form.residePeru ? 1 : 0,
                enfermedadesPreexistentes: form.enfermedadesPreexistentes ? 1 : 0,
                expuestaPoliticamente: form.expuestaPoliticamente ? 1 : 0,
            };

            const response = await createEmpleado(dataToSend);
            setAlert(response); // {type: 'success', message: '...'}
            setForm(initialFormState); // Resetear formulario
            
            // Navegar a la lista después de un pequeño retraso
            setTimeout(() => navigate('/admin/listar-empleados'), 2000); 

        } catch (err) {
            if (err.errors) {
                setErrors(err.errors);
            }
            setAlert(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 bg-gray-50">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Registrar Nuevo Empleado</h1>

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
                
                <DatosAccesoForm
                    form={form}
                    handleChange={handleChange}
                    errors={errors}
                    isEditing={false}
                />

                <div className="flex justify-end pt-4 border-t">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition duration-150 disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar Empleado'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AgregarEmpleado;