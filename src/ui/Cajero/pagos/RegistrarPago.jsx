import React, { useState, useEffect, useCallback } from 'react';
import { getPrestamos, getPrestamoById } from 'services/prestamoService';
import { registrarPago } from 'services/pagoService';
import ClienteSearchSelect from 'components/Shared/Comboboxes/ClienteSearchSelect';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import ListaPrestamosCliente from '../components/ListaPrestamosCliente';
import TablaCuotas from '../components/modals/TablaCuotas'; // Corregí la ruta, probablemente no está en 'modals'
import RegistrarPagoModal from '../components/modals/RegistrarPagoModal'; // Corregí la ruta

const RegistrarPago = () => {
    const [form, setForm] = useState({ id_Cliente: null, clienteDni: '', clienteNombre: '', errors: {} });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [prestamosCliente, setPrestamosCliente] = useState([]);
    const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    
    const [cuotaParaPagar, setCuotaParaPagar] = useState(null);

    const buscarPrestamos = useCallback(async () => {
        if (!form.id_Cliente) {
            setPrestamosCliente([]);
            setSelectedPrestamoId(null);
            setPrestamoSeleccionado(null);
            return;
        }
        setLoading(true);
        try {
            const response = await getPrestamos(1, form.clienteDni, 'id', 'desc');
            const prestamosActivos = response.data.filter(p => p.estado === 1);
            setPrestamosCliente(prestamosActivos);
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al buscar los préstamos del cliente.' });
        } finally {
            setLoading(false);
        }
    }, [form.id_Cliente, form.clienteDni]);

    useEffect(() => {
        buscarPrestamos();
    }, [buscarPrestamos]);

    const handleSelectPrestamo = useCallback(async (prestamoId) => {
        setSelectedPrestamoId(prestamoId);
        setLoading(true);
        try {
            const response = await getPrestamoById(prestamoId);
            setPrestamoSeleccionado(response.data);
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar detalles del préstamo.' });
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAbrirModalPago = (cuotaId) => {
        const cuota = prestamoSeleccionado.cuota.find(c => c.id === cuotaId);
        setCuotaParaPagar(cuota);
    };

    const handleConfirmarPago = async (pagoData) => {
        setLoading(true);
        try {
            const response = await registrarPago(pagoData);
            setAlert({ type: 'success', message: response.message });
            setCuotaParaPagar(null);
            await handleSelectPrestamo(selectedPrestamoId);
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al procesar el pago.' });
        } finally {
            setLoading(false);
        }
    };

    // Si está cargando al inicio, mostrar el loader de pantalla completa
    if (loading && !form.id_Cliente) {
        return <LoadingScreen />;
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50">
            {loading && <LoadingScreen />}
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Registrar Pago de Cuotas</h1>
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <div className="bg-white p-6 shadow-xl rounded-lg space-y-8">
                <ClienteSearchSelect
                    form={form}
                    setForm={setForm}
                    setAlert={setAlert}
                    setErrors={(e) => setForm(prev => ({ ...prev, errors: e }))}
                />

                
                {!loading && form.id_Cliente && (
                    <ListaPrestamosCliente
                        prestamos={prestamosCliente}
                        onSelectPrestamo={handleSelectPrestamo}
                        selectedPrestamoId={selectedPrestamoId}
                    />
                )}

                {!loading && prestamoSeleccionado && (
                    <TablaCuotas
                        cuotas={prestamoSeleccionado.cuota}
                        onPagar={handleAbrirModalPago}
                        loading={loading} // Pasamos el estado de carga
                    />
                )}
            </div>

            {cuotaParaPagar && (
                <RegistrarPagoModal
                    cuota={cuotaParaPagar}
                    onConfirm={handleConfirmarPago}
                    onClose={() => setCuotaParaPagar(null)}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default RegistrarPago;