import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPrestamoById, updatePrestamo } from 'services/prestamoService';

import DatosPrestamoForm from '../components/formularios/DatosPrestamoForm';
import ResultadosCalculo from '../components/formularios/ResultadosCalculo';
import FrecuenciaAsesorForm from '../components/formularios/FrecuenciaAsesorForm';

import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';

const EditarPrestamo = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(null);
    const [clienteInfo, setClienteInfo] = useState({ nombre: '', dni: '' });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [errors, setErrors] = useState({});
    
    const [totalPagar, setTotalPagar] = useState(0);
    const [valorCuota, setValorCuota] = useState(0);

    useEffect(() => {
        const fetchPrestamo = async () => {
            try {
                const response = await getPrestamoById(id);
                const prestamo = response.data;
                
                // --- CORRECCIÓN PRINCIPAL AQUÍ ---
                // Cargamos el estado 'form' con TODOS los datos necesarios
                setForm({
                    id_Producto: prestamo.id_Producto,
                    monto: prestamo.monto,
                    interes: prestamo.interes,
                    cuotas: prestamo.cuotas,
                    abonado_por: prestamo.abonado_por,
                    frecuencia: prestamo.frecuencia,
                    id_Asesor: prestamo.id_Asesor,
                    modalidad: prestamo.modalidad,
                    // Añadimos los datos del asesor para que el componente hijo los muestre
                    asesorDni: prestamo.asesor?.datos?.dni || '',
                    asesorNombre: `${prestamo.asesor?.datos?.nombre || ''} ${prestamo.asesor?.datos?.apellidoPaterno || ''}`.trim(),
                });

                setClienteInfo({
                    nombre: `${prestamo.cliente.datos.nombre} ${prestamo.cliente.datos.apellidoPaterno}`,
                    dni: prestamo.cliente.datos.dni
                });
            } catch (err) {
                setAlert({ type: 'error', message: err.message || 'No se pudo cargar el préstamo.' });
                navigate('/admin/listar-prestamos');
            } finally {
                setLoading(false);
            }
        };
        fetchPrestamo();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const calcularPrestamo = useCallback(() => {
        if (!form) return;
        const monto = parseFloat(form.monto);
        const interes = parseFloat(form.interes);
        const cuotas = parseInt(form.cuotas);

        if (monto > 0 && interes >= 0 && cuotas > 0) {
            const interesTotal = monto * interes;
            const total = monto + interesTotal;
            const cuota = total / cuotas;
            setTotalPagar(total.toFixed(2));
            setValorCuota(cuota.toFixed(2));
        } else {
            setTotalPagar(0);
            setValorCuota(0);
        }
    }, [form]);

    useEffect(() => {
        calcularPrestamo();
    }, [calcularPrestamo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        setErrors({});

        // Excluimos los datos del asesor que son solo para la UI
        const { modalidad, asesorNombre, asesorDni, ...dataToSubmit } = form;

        const dataToSend = {
            ...dataToSubmit,
            total: parseFloat(totalPagar),
            valor_cuota: parseFloat(valorCuota),
        };

        try {
            const response = await updatePrestamo(id, dataToSend);
            setAlert({ type: 'success', message: response.message || 'Préstamo actualizado con éxito.' });
            setTimeout(() => navigate('/admin/listar-prestamos'), 2000);
        } catch (err) {
            if (err.errors) setErrors(err.errors);
            setAlert({ type: 'error', message: err.message || 'Error al actualizar el préstamo.' });
        } finally {
            setLoading(false);
        }
    };

    if (loading || !form) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 bg-gray-50">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Editar Préstamo #{id}</h1>
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-xl rounded-lg space-y-8">
                <section>
                    <h2 className="text-xl font-semibold text-red-800 mb-4">1. Cliente (No editable)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                            <p className="p-2 mt-1 border bg-gray-100 rounded-md">{clienteInfo.nombre}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">DNI</label>
                            <p className="p-2 mt-1 border bg-gray-100 rounded-md">{clienteInfo.dni}</p>
                        </div>
                    </div>
                </section>
                <hr/>
                
                <DatosPrestamoForm form={form} handleChange={handleChange} errors={errors} />
                <hr/>
                
                <ResultadosCalculo totalPagar={totalPagar} valorCuota={valorCuota} />
                <hr/>
                
                {/* Ahora pasamos las props correctas */}
                <FrecuenciaAsesorForm
                    form={form}
                    setForm={setForm}
                    handleChange={handleChange}
                    errors={errors}
                    isEditing={true} 
                />

                <div className="flex justify-end pt-4 border-t">
                    <button type="button" onClick={() => navigate('/admin/listar-prestamos')} className="px-8 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 font-bold mr-2">
                        Cancelar
                    </button>
                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarPrestamo;