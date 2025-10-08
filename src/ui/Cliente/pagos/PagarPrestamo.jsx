import React, { useState, useEffect, useCallback } from 'react';
import jwtUtils from 'utilities/Token/jwtUtils';
import { getPrestamos } from 'services/prestamoService';
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
                setAlert({ type: 'error', message: 'No se pudo identificar al usuario.' });
                setLoading(false);
            }
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al verificar la sesión del usuario.' });
            setLoading(false);
        }
    }, []);

    // CAMBIO (1/2): La función ahora devuelve la lista de préstamos.
    const buscarPrestamos = useCallback(async () => {
        if (!clienteId) return [];
        setLoading(true);
        try {
            const response = await getPrestamos(1, null, 'id', 'desc', clienteId);
            const prestamosActivos = response.data.filter(p => p.estado === 1);
            setPrestamosCliente(prestamosActivos);
            return prestamosActivos; // <-- DEVUELVE LOS DATOS ACTUALIZADOS
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al buscar tus préstamos activos.' });
            return []; // Devuelve array vacío en caso de error
        } finally {
            setLoading(false);
        }
    }, [clienteId]);

    const handleSelectPrestamo = useCallback((prestamoId) => {
        const prestamoEncontrado = prestamosCliente.find(p => p.id === prestamoId);
        if (prestamoEncontrado) {
            setSelectedPrestamoId(prestamoId);
            setPrestamoSeleccionado(prestamoEncontrado);
        }
    }, [prestamosCliente]);
    
    useEffect(() => {
        if (clienteId) {
            buscarPrestamos();
        }
    }, [clienteId, buscarPrestamos]);

    useEffect(() => {
        if (prestamosCliente.length === 1 && !prestamoSeleccionado) {
            handleSelectPrestamo(prestamosCliente[0].id);
        }
    }, [prestamosCliente, handleSelectPrestamo, prestamoSeleccionado]);

    // CAMBIO (2/2): Usamos los datos devueltos por 'buscarPrestamos' para actualizar la vista.
    const handleConfirmarPago = async (pagoFormData) => {
        setLoading(true);
        try {
            const dataToSend = pagoFormData;
            dataToSend.append('modalidad', 'VIRTUAL');
            dataToSend.append('fecha_pago', new Date().toISOString().split('T')[0]);
            
            await registrarPagoConArchivo(dataToSend);
            
            setAlert({ type: 'success', message: "Pago registrado. Actualizando información..." });
            setCuotaParaPagar(null);
            
            // 1. Llama a buscarPrestamos y recibe la lista nueva
            const listaActualizada = await buscarPrestamos();
            
            // 2. Busca la versión actualizada del préstamo que estabas viendo
            const prestamoActualizado = listaActualizada.find(p => p.id === selectedPrestamoId);

            // 3. Actualiza el estado para que la pantalla se refresque con los nuevos datos
            if (prestamoActualizado) {
                setPrestamoSeleccionado(prestamoActualizado);
            }

        } catch (err) {
            console.error("Error detallado del backend:", err);
            setAlert({ type: 'error', message: err.message || 'Error al procesar el pago.' });
        } finally {
            setLoading(false);
        }
    };
    
    const handleAbrirModalPago = (cuotaId) => {
        const cuota = prestamoSeleccionado.cuota.find(c => c.id === cuotaId);
        setCuotaParaPagar(cuota);
    };

    const handleViewCronograma = (url) => {
        if (!url) {
            setAlert({ type: 'info', message: 'No se encontró un archivo de cronograma.' });
            return;
        }
        const isAbsoluteUrl = url.startsWith('http');
        const fullUrl = isAbsoluteUrl ? url : `${API_BASE_URL}${url}`;
        setPdfUrl(fullUrl);
        setIsPdfModalOpen(true);
    };

    const handleViewComprobante = (url) => {
        if (!url) {
            setAlert({ type: 'info', message: 'No se encontró un comprobante.' });
            return;
        }
        const isAbsoluteUrl = url.startsWith('http');
        const fullUrl = isAbsoluteUrl ? url : `${API_BASE_URL}${url}`;
        setPdfUrl(fullUrl);
        setIsPdfModalOpen(true);
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
                        cronogramaUrl={prestamoSeleccionado.cronograma_url}
                        onViewCronograma={handleViewCronograma}
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