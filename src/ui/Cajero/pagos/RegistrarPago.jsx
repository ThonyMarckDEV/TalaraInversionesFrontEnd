import React, { useState, useEffect, useCallback } from 'react';
import { getPrestamos, getPrestamoById, reprogramarPrestamo } from 'services/prestamoService';

import { registrarPago, cancelarTotalPrestamo, aceptarPagoVirtual, rechazarPagoVirtual } from 'services/pagoService'; 
import ClienteSearchSelect from 'components/Shared/Comboboxes/ClienteSearchSelect';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import ListaPrestamosCliente from '../components/ListaPrestamosCliente';
import TablaCuotas from '../components/modals/TablaCuotas';
import RegistrarPagoModal from '../components/modals/RegistrarPagoModal';
import ReprogramarModal from '../components/modals/ReprogramarModal';
import ViewPdfModal from 'components/Shared/Modals/ViewPdfModal';
import ModalVerCaptura from 'components/Shared/Modals/ViewImageModal'; 
import API_BASE_URL from 'js/urlHelper';

const RegistrarPago = () => {
    const [form, setForm] = useState({ id_Cliente: null, clienteDni: '', clienteNombre: '', errors: {} });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [prestamosCliente, setPrestamosCliente] = useState([]);
    const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    const [cuotaParaPagar, setCuotaParaPagar] = useState(null);
    const [esCancelacion, setEsCancelacion] = useState(false);
    const [reprogramacionData, setReprogramacionData] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const [cuotaParaVerificar, setCuotaParaVerificar] = useState(null);
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    
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
        setEsCancelacion(false);
    };

    const handleAbrirModalCancelacion = () => {
        const cuotasPendientes = prestamoSeleccionado.cuota.filter(c => c.estado !== 2);
        if (cuotasPendientes.length === 0) return;
        const deudaTotal = cuotasPendientes.reduce((total, c) => {
            const monto = parseFloat(c.monto || 0);
            const mora = parseFloat(c.cargo_mora || 0);
            const excedente = parseFloat(c.excedente_anterior || 0);
            return total + Math.max(0, (monto + mora) - excedente);
        }, 0);
        const ultimaCuota = cuotasPendientes[cuotasPendientes.length - 1];
        const dataCancelacion = {
            id: ultimaCuota.id,
            id_Prestamo: prestamoSeleccionado.id,
            numero_cuota: `Total (${cuotasPendientes.length} cuotas)`,
            monto: deudaTotal.toFixed(2),
            cargo_mora: 0,
            excedente_anterior: 0,
        };
        setCuotaParaPagar(dataCancelacion);
        setEsCancelacion(true);
    };

    const handleAbrirModalReprogramacion = () => {
        const cuotasPendientes = prestamoSeleccionado.cuota.filter(c => c.estado !== 2);
        if (cuotasPendientes.length === 0) {
            setAlert({ type: 'info', message: 'No hay cuotas pendientes para reprogramar.' });
            return;
        }
        const deudaTotal = cuotasPendientes.reduce((total, c) => {
            return total + Math.max(0, (parseFloat(c.capital || 0) + parseFloat(c.cargo_mora || 0)) - parseFloat(c.excedente_anterior || 0));
        }, 0);
        setReprogramacionData({ prestamo: prestamoSeleccionado, deuda: deudaTotal });
    };

    const handleViewComprobante = (url) => {
        if (!url) {
            setAlert({ type: 'info', message: 'No se encontró un comprobante para esta cuota.' });
            return;
        }

        // 1. Detecta si la URL ya es absoluta (empieza con http o https)
        const isAbsoluteUrl = url.startsWith('http');

        // 2. Si es absoluta, la usa directamente. Si no, le añade la base de la API.
        const fullUrl = isAbsoluteUrl ? url : `${API_BASE_URL}${url}`;

        setPdfUrl(fullUrl);
        setIsPdfModalOpen(true);
    };

    // Esta función ahora abre tu nuevo modal
    const handleViewCaptura = (cuota) => {
        setCuotaParaVerificar(cuota);
    };

    // Nueva función para Aceptar el Pago
    const handleAceptarPago = async (cuotaId) => {
        setIsProcessingAction(true);
        try {
            const response = await aceptarPagoVirtual(cuotaId);
            setAlert({ type: 'success', message: response.message });
            setCuotaParaVerificar(null); // Cierra el modal
            await handleSelectPrestamo(selectedPrestamoId); // Recarga los datos
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al aceptar el pago.' });
        } finally {
            setIsProcessingAction(false);
        }
    };
    
    // Nueva función para Rechazar el Pago
    const handleRechazarPago = async (cuotaId) => {
        setIsProcessingAction(true);
        try {
            const response = await rechazarPagoVirtual(cuotaId);
            setAlert({ type: 'warning', message: response.message });
            setCuotaParaVerificar(null); // Cierra el modal
            await handleSelectPrestamo(selectedPrestamoId); // Recarga los datos
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al rechazar el pago.' });
        } finally {
            setIsProcessingAction(false);
        }
    };


    const handleConfirmarPago = async (pagoData) => {
        setLoading(true);
        try {
            const service = esCancelacion ? cancelarTotalPrestamo : registrarPago;
            const response = await service(pagoData);
            setAlert({ type: 'success', message: response.message });
            setCuotaParaPagar(null);
            await handleSelectPrestamo(selectedPrestamoId);
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al procesar el pago.' });
        } finally {
            setLoading(false);
        }
    };
    
    const handleConfirmarReprogramacion = async (data) => {
        setLoading(true);
        try {
            const response = await reprogramarPrestamo(data);
            setAlert({ type: 'success', message: response.message });
            setReprogramacionData(null);
            await buscarPrestamos();
            await handleSelectPrestamo(data.prestamo_id);
        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al reprogramar el préstamo.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
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
                
                {form.id_Cliente && (
                    <ListaPrestamosCliente
                        prestamos={prestamosCliente}
                        onSelectPrestamo={handleSelectPrestamo}
                        selectedPrestamoId={selectedPrestamoId}
                    />
                )}

                {prestamoSeleccionado && (
                    <TablaCuotas
                        cuotas={prestamoSeleccionado.cuota}
                        onPagar={handleAbrirModalPago}
                        onViewComprobante={handleViewComprobante}
                        onCancelarTotal={handleAbrirModalCancelacion}
                        onReprogramar={handleAbrirModalReprogramacion}
                        onViewCaptura={handleViewCaptura}
                    />
                )}
            </div>

            {cuotaParaPagar && (
                <RegistrarPagoModal
                    cuota={cuotaParaPagar}
                    onConfirm={handleConfirmarPago}
                    onClose={() => setCuotaParaPagar(null)}
                    loading={loading}
                    isCancelacion={esCancelacion}
                />
            )}

            {reprogramacionData && (
                 <ReprogramarModal
                    isOpen={!!reprogramacionData}
                    onClose={() => setReprogramacionData(null)}
                    onConfirm={handleConfirmarReprogramacion}
                    prestamo={reprogramacionData?.prestamo}
                    deudaTotal={reprogramacionData?.deuda}
                    loading={loading}
                />
            )}

            <ViewPdfModal
                isOpen={isPdfModalOpen}
                onClose={() => setIsPdfModalOpen(false)}
                pdfUrl={pdfUrl}
            />

            <ModalVerCaptura
                cuota={cuotaParaVerificar}
                onClose={() => setCuotaParaVerificar(null)}
                onAceptar={handleAceptarPago}
                onRechazar={handleRechazarPago}
                isProcessing={isProcessingAction}
            />

        </div>
    );
};

export default RegistrarPago;