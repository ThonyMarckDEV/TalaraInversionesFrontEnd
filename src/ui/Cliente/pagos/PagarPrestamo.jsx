import React, { useState, useEffect, useCallback } from 'react';
import jwtUtils from 'utilities/Token/jwtUtils';
import { getPrestamos, getPrestamoById } from 'services/prestamoService';
import { registrarPagoConArchivo } from 'services/pagoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import ListaPrestamosCliente from '../components/ListaPrestamosCliente';
import TablaCuotas from '../components/modals/TablaCuotas';
import ConfirmarPagoModal from '../components/modals/ConfirmarPagoModal';
import ViewPdfModal from 'components/Shared/Modals/ViewPdfModal';
import API_BASE_URL from 'js/urlHelper';

const PagarPrestamo = () => {
    const [clienteId, setClienteId] = useState(null);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);

    const [prestamosCliente, setPrestamosCliente] = useState([]);
    const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

    // State for modals
    const [cuotaParaPagar, setCuotaParaPagar] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    useEffect(() => {
        try {
            const token = jwtUtils.getAccessTokenFromCookie();
            const idUsuario = jwtUtils.getUserID(token);

            if (idUsuario) {
                setClienteId(idUsuario);
            } else {
                setAlert({ type: 'error', message: 'No se pudo identificar al usuario. Por favor, inicie sesión de nuevo.' });
                setLoading(false);
            }
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al verificar la sesión del usuario.' });
            setLoading(false);
        }
    }, []);

    const handleSelectPrestamo = useCallback(async (prestamoId) => {
        setSelectedPrestamoId(prestamoId);
        setLoading(true);
        try {
            const response = await getPrestamoById(prestamoId);
            setPrestamoSeleccionado(response.data);
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar el detalle del préstamo.' });
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarPrestamos = useCallback(async () => {
        if (!clienteId) return;

        setLoading(true);
        try {
            const response = await getPrestamos(1, null, 'id', 'desc', clienteId);
            const prestamosActivos = response.data.filter(p => p.estado === 1);
            setPrestamosCliente(prestamosActivos);

            if (prestamosActivos.length === 1) {
                handleSelectPrestamo(prestamosActivos[0].id);
            }
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al buscar tus préstamos activos.' });
        } finally {
            setLoading(false);
        }
    }, [clienteId, handleSelectPrestamo]);

    useEffect(() => {
        if (clienteId) {
            buscarPrestamos();
        }
    }, [clienteId, buscarPrestamos]);

    const handleAbrirModalPago = (cuotaId) => {
        const cuota = prestamoSeleccionado.cuota.find(c => c.id === cuotaId);
        setCuotaParaPagar(cuota);
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

    const handleConfirmarPago = async (pagoFormData) => {
        setLoading(true);
        try {
            const dataToSend = pagoFormData;
            dataToSend.append('modalidad', 'VIRTUAL');
            dataToSend.append('fecha_pago', new Date().toISOString().split('T')[0]);

            // Lógica simplificada: siempre se registra el pago de una cuota.
            const response = await registrarPagoConArchivo(dataToSend);

            setAlert({ type: 'success', message: response.message });
            setCuotaParaPagar(null);
            await handleSelectPrestamo(selectedPrestamoId);
        } catch (err) {
            console.error("Error detallado del backend:", err);
            setAlert({ type: 'error', message: err.message || 'Error al procesar el pago.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            {loading && <LoadingScreen />}
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Mis Pagos Pendientes</h1>
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <div className="bg-white p-6 shadow-xl rounded-lg space-y-8">
                <ListaPrestamosCliente
                    prestamos={prestamosCliente}
                    onSelectPrestamo={handleSelectPrestamo}
                    selectedPrestamoId={selectedPrestamoId}
                />

                {prestamoSeleccionado && (
                    <TablaCuotas
                        cuotas={prestamoSeleccionado.cuota}
                        onPagar={handleAbrirModalPago}
                        onViewComprobante={handleViewComprobante}
                    />
                )}
            </div>

            {cuotaParaPagar && (
                <ConfirmarPagoModal
                    cuota={cuotaParaPagar}
                    onConfirm={handleConfirmarPago}
                    onClose={() => setCuotaParaPagar(null)}
                    loading={loading}
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

export default PagarPrestamo;