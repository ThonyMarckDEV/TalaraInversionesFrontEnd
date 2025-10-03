// src/pages/Prestamos/AgregarPrestamo.jsx (CORREGIDO FINAL)

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos los formularios por sección
import BuscarClienteForm from '../components/formularios/BuscarClienteForm';
import DatosPrestamoForm from '../components/formularios/DatosPrestamoForm';
import ResultadosCalculo from '../components/formularios/ResultadosCalculo';
import FrecuenciaAsesorForm from '../components/formularios/FrecuenciaAsesorForm';

// Importamos servicios
import { createPrestamo } from 'services/prestamoService';
import { showCliente } from 'services/clienteService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';

// CORRECCIÓN: Nombres de propiedades COINCIDENTES con el uso en el JSX.
const initialFormState = {
    // SECCIÓN 1: Cliente
    id_Cliente: null, // ID del cliente (para el backend)
    clienteDni: '',   // Input para la búsqueda
    clienteNombre: '', // Nombre completo (para la UI)
    
    // SECCIÓN 2: Datos del Préstamo
    id_Producto: '',
    monto: 0,
    interes: 0, // Tasa de interés (ej: 0.15 para 15%)
    cuotas: 1,
    abonado_por: '', 
    
    // SECCIÓN 4: Frecuencia y Asesor
    frecuencia: '', 
    id_Asesor: '',
    modalidad: '', 
};

const AgregarPrestamo = () => {
    const [form, setForm] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [errors, setErrors] = useState({});
    const [clienteData, setClienteData] = useState(null); 
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

    // FUNCIÓN DE BÚSQUEDA DE CLIENTE POR DNI
    const handleSearchCliente = async () => {
        const dni = form.clienteDni.trim();
        // Validar DNI/RUC (permitiendo 8 o más dígitos)
        if (!dni || dni.length < 8) { 
            setErrors(prev => ({ ...prev, clienteDni: 'El DNI o RUC debe tener 8 o más dígitos.' }));
            return;
        }

        setLoading(true);
        setClienteData(null); 
        
        try {
            const response = await showCliente(dni); 
            const cliente = response.data; // Extraer el objeto 'data'
            
            const nombreCompleto = `${cliente.datos.nombre} ${cliente.datos.apellidoPaterno} ${cliente.datos.apellidoMaterno}`.trim();
            
            // Actualizar el estado con la data correcta del cliente
            setClienteData(cliente); 
            setForm(prev => ({ 
                ...prev, 
                id_Cliente: cliente.id, 
                clienteNombre: nombreCompleto
            }));

            setAlert({ type: 'success', message: `Cliente ${nombreCompleto} encontrado y seleccionado.` });
            
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al buscar cliente.' });
            setClienteData(null);
            setForm(prev => ({ ...prev, id_Cliente: null, clienteNombre: '' }));
        } finally {
            setLoading(false);
        }
    };

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

        // Validar que el cliente esté seleccionado y el cálculo sea válido
        if (!form.id_Cliente || totalPagar <= 0 || !clienteData) { 
            setAlert({ type: 'error', message: 'Debe seleccionar un cliente y configurar el préstamo correctamente.' });
            setLoading(false);
            return;
        }

        try {
            // CORRECCIÓN CLAVE: Usar desestructuración para excluir las claves de la UI
            // Extraemos las claves que NO deben ir al backend (clienteDni, clienteNombre)
            const { clienteDni, clienteNombre, ...dataToSubmit } = form;

            const dataToSend = {
                ...dataToSubmit,
                
                // Asegurar que los valores calculados y principales sean numéricos
                total: parseFloat(totalPagar),
                valor_cuota: parseFloat(valorCuota),
                monto: parseFloat(form.monto),
                cuotas: parseInt(form.cuotas),
            };

            // 📢 Imprimir el JSON final limpio en la consola para verificación
            console.log("JSON a enviar al Backend:", dataToSend);
            
            const response = await createPrestamo(dataToSend);
            
            setAlert({ type: 'success', message: response.message || 'Préstamo creado con éxito.' });
            setForm(initialFormState); 
            setClienteData(null);
            
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

    if (loading && !clienteData) return <LoadingScreen />;

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
                
                {/* ---------------- SECCIÓN 1: BUSCAR CLIENTE ---------------- */}
                <BuscarClienteForm 
                    dni={form.clienteDni} // Usa la clave corregida
                    clienteNombre={form.clienteNombre} // Usa la clave corregida
                    handleChange={handleChange}
                    handleSearchCliente={handleSearchCliente}
                    loading={loading}
                    errors={errors}
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
                        onClick={() => { setForm(initialFormState); setClienteData(null); setAlert(null); }}
                        className="px-8 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 font-bold mr-2 transition duration-150"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-150 disabled:bg-gray-400"
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