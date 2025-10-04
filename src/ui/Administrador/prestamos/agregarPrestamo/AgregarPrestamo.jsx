// src/pages/Prestamos/AgregarPrestamo.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import ClienteSearchSelect from 'components/Shared/Comboboxes/ClienteSearchSelect';
import DatosPrestamoForm from '../components/formularios/DatosPrestamoForm';
import ResultadosCalculo from '../components/formularios/ResultadosCalculo';
import FrecuenciaAsesorForm from '../components/formularios/FrecuenciaAsesorForm';

// Importamos servicios
import { createPrestamo } from 'services/prestamoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';


const initialFormState = {
    // SECCIÓN 1: Cliente
    id_Cliente: null, 
    clienteDni: '',  
    clienteNombre: '', 
    
    // SECCIÓN 2: Datos del Préstamo
    id_Producto: '',
    monto: 0,
    interes: 0, 
    cuotas: 1,
    abonado_por: '', 
    
    // SECCIÓN 4: Frecuencia y Asesor
    frecuencia: '', 
    id_Asesor: '',
    modalidad: '', 
    asesorDni: '', 
    asesorNombre: ''
};

const AgregarPrestamo = () => {
    const [form, setForm] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // ESTADO DE RESULTADOS CALCULADOS
    const [totalPagar, setTotalPagar] = useState(0);
    const [valorCuota, setValorCuota] = useState(0);
    
    // Función para manejar cualquier cambio en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    // ELIMINADA: La función handleSearchCliente se movió a ClienteSearchSelect.jsx

    // FUNCIÓN DE CÁLCULO
    const calcularPrestamo = useCallback(() => {
        const monto = parseFloat(form.monto);
        const interes = parseFloat(form.interes); 
        const cuotas = parseInt(form.cuotas);

        if (monto > 0 && interes > 0 && cuotas > 0) {
            const interesTotal = monto * interes;
            const total = monto + interesTotal;
            const cuota = total / cuotas;
            
            setTotalPagar(total.toFixed(2));
            setValorCuota(cuota.toFixed(2));
        } else {
            setTotalPagar(0);
            setValorCuota(0);
        }
    }, [form.monto, form.interes, form.cuotas]);

    // Ejecutar cálculo cada vez que cambian los inputs relevantes
    useEffect(() => {
        calcularPrestamo();
    }, [calcularPrestamo]);

    // FUNCIÓN DE ENVÍO
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setAlert(null);

        // Validar que el cliente esté seleccionado (usando form.id_Cliente)
        if (!form.id_Cliente || totalPagar <= 0) { 
            setAlert({ type: 'error', message: 'Debe seleccionar un cliente y configurar el préstamo correctamente.' });
            setLoading(false);
            return;
        }

        try {
            // CORRECCIÓN CLAVE: Usar desestructuración para excluir las claves de la UI
            const { 
                clienteDni, 
                clienteNombre, 
                asesorDni,  
                asesorNombre,
                ...dataToSubmit 
            } = form;

            const dataToSend = {
                ...dataToSubmit,
                
                // Conversiones de TIPO DE DATO:
                id_Producto: parseInt(form.id_Producto), 
                id_Asesor: parseInt(form.id_Asesor),
                id_Cliente: parseInt(form.id_Cliente),
                monto: parseFloat(form.monto),
                interes: parseFloat(form.interes),
                cuotas: parseInt(form.cuotas),
                
                // Valores calculados
                total: parseFloat(totalPagar),
                valor_cuota: parseFloat(valorCuota),
            };
            
            const response = await createPrestamo(dataToSend);
            
            setAlert({ type: 'success', message: response.message || 'Préstamo creado con éxito.' });
            setForm(initialFormState); 
            // Eliminamos setClienteData(null) ya que ya no lo usamos para la búsqueda
            
            setTimeout(() => navigate('/admin/listar-prestamos'), 2000); 

        } catch (err) {
            if (err.errors) {
                setErrors(err.errors);
            }
            setAlert({ type: 'error', message: err.message || 'Error al guardar el préstamo.' });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !form.id_Cliente) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 bg-gray-50">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Registrar Nuevo Préstamo</h1>

            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />

            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-xl rounded-lg space-y-8">
                
                {/* ---------------- SECCIÓN 1: BUSCAR CLIENTE (USANDO EL REUTILIZABLE) ---------------- */}
                <ClienteSearchSelect 
                    form={{ ...form, errors }} // Pasamos el form y los errores
                    setForm={setForm}
                    setAlert={setAlert}
                    setErrors={setErrors}
                />
                
                <hr className="border-t border-gray-200" />

                {/* ---------------- SECCIÓN 2: DATOS DEL PRÉSTAMO ---------------- */}
                <DatosPrestamoForm
                    form={form}
                    handleChange={handleChange}
                    errors={errors}
                />
                
                <hr className="border-t border-gray-200" />

                {/* ---------------- SECCIÓN 3: RESULTADOS DE CÁLCULO ---------------- */}
                <ResultadosCalculo
                    totalPagar={totalPagar}
                    valorCuota={valorCuota}
                />
                
                <hr className="border-t border-gray-200" />

                {/* ---------------- SECCIÓN 4: FRECUENCIA Y ASESOR ---------------- */}
                <FrecuenciaAsesorForm
                    form={form}
                    handleChange={handleChange}
                    errors={errors}
                />

                <div className="flex justify-end pt-4 border-t">
                    <button 
                        type="button" 
                        onClick={() => { setForm(initialFormState); setAlert(null); }}
                        className="px-8 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 font-bold mr-2 transition duration-150"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition duration-150 disabled:bg-gray-400"
                        disabled={loading || totalPagar <= 0 || !form.id_Cliente}
                    >
                        {loading ? 'Procesando...' : 'Generar Préstamo'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AgregarPrestamo;