import React, { useState, useEffect, useCallback } from 'react';
import { getPrestamos, getPrestamoById } from 'services/prestamoService';
import { registrarPago, cancelarTotalPrestamo } from 'services/pagoService';
import ClienteSearchSelect from 'components/Shared/Comboboxes/ClienteSearchSelect';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import ListaPrestamosCliente from '../components/ListaPrestamosCliente';
import TablaCuotas from '../components/modals/TablaCuotas';
import RegistrarPagoModal from '../components/modals/RegistrarPagoModal';
import ViewPdfModal from 'components/Shared/Modals/ViewPdfModal';
import API_BASE_URL from 'js/urlHelper';

const RegistrarPago = () => {
    const [form, setForm] = useState({ id_Cliente: null, clienteDni: '', clienteNombre: '', errors: {} });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [prestamosCliente, setPrestamosCliente] = useState([]);
    const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    
    const [cuotaParaPagar, setCuotaParaPagar] = useState(null);
    const [esCancelacion, setEsCancelacion] = useState(false); // Estado para diferenciar el tipo de pago

    const [pdfUrl, setPdfUrl] = useState('');
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

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
            monto: deudaTotal.toFixed(2), // Usamos 'monto' para el cálculo en el modal
            cargo_mora: 0,
            excedente_anterior: 0,
        };
        
        setCuotaParaPagar(dataCancelacion);
        setEsCancelacion(true);
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
    
    const handleViewComprobante = (url) => {
        if (!url) {
            setAlert({ type: 'info', message: 'No se encontró un comprobante para esta cuota.' });
            return;
        }
        const fullUrl = `${API_BASE_URL}${url}`;
        setPdfUrl(fullUrl);
        setIsPdfModalOpen(true);
    };

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
                
                {form.id_Cliente && !loading && (
                    <ListaPrestamosCliente
                        prestamos={prestamosCliente}
                        onSelectPrestamo={handleSelectPrestamo}
                        selectedPrestamoId={selectedPrestamoId}
                    />
                )}

                {prestamoSeleccionado && !loading && (
                    <TablaCuotas
                        cuotas={prestamoSeleccionado.cuota}
                        onPagar={handleAbrirModalPago}
                        onViewComprobante={handleViewComprobante}
                        onCancelarTotal={handleAbrirModalCancelacion}
                        onReprogramar={() => alert('Función de reprogramación no implementada.')}
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

            <ViewPdfModal
                isOpen={isPdfModalOpen}
                onClose={() => setIsPdfModalOpen(false)}
                pdfUrl={pdfUrl}
            />
        </div>
    );
};

export default RegistrarPago;