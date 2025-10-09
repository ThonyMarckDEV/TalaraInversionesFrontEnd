import React, { useState, useEffect, useCallback } from 'react';
import jwtUtils from 'utilities/Token/jwtUtils';
// VOLVEMOS A NECESITAR AMBOS SERVICIOS
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

    // Este estado guarda la lista inicial (que tiene cronograma_url)
    const [prestamosCliente, setPrestamosCliente] = useState([]);
    // Este estado guarda el préstamo detallado (que tiene comprobante_url en las cuotas)
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    
    const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);
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

    // SE RESTAURA LA LLAMADA A LA API PARA OBTENER EL DETALLE (CON COMPROBANTES)
    // No tiene dependencias para que su referencia sea estable y no cause bucles.
    const handleSelectPrestamo = useCallback(async (prestamoId) => {
        setLoading(true);
        setSelectedPrestamoId(prestamoId);
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

            // Auto-selección si solo hay un préstamo
            if (prestamosActivos.length === 1) {
                await handleSelectPrestamo(prestamosActivos[0].id);
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

    const handleConfirmarPago = async (pagoFormData) => {
        setLoading(true);
        try {
            const dataToSend = pagoFormData;
            dataToSend.append('modalidad', 'VIRTUAL');
            dataToSend.append('fecha_pago', new Date().toISOString().split('T')[0]);
            
            await registrarPagoConArchivo(dataToSend);
            
            setAlert({ type: 'success', message: "Pago registrado. Actualizando información..." });
            setCuotaParaPagar(null);
            
            // Refresca la lista Y el detalle
            await buscarPrestamos();
            // Si ya había un préstamo seleccionado, lo refresca también
            if(selectedPrestamoId) {
                await handleSelectPrestamo(selectedPrestamoId);
            }

        } catch (err) {
            setAlert({ type: 'error', message: err.message || 'Error al procesar el pago.' });
        } finally {
            setLoading(false);
        }
    };
    
    // --- El resto de funciones no cambian ---
    const handleAbrirModalPago = (cuotaId) => {
        const cuota = prestamoSeleccionado.cuota.find(c => c.id === cuotaId);
        setCuotaParaPagar(cuota);
    };

    const handleViewCronograma = (url) => {
        if (!url) { setAlert({ type: 'info', message: 'No se encontró un archivo de cronograma.' }); return; }
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
        setPdfUrl(fullUrl);
        setIsPdfModalOpen(true);
    };

    const handleViewComprobante = (url) => {
        if (!url) { setAlert({ type: 'info', message: 'No se encontró un comprobante.' }); return; }
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
        setPdfUrl(fullUrl);
        setIsPdfModalOpen(true);
    };
    
    // LÓGICA DE COMBINACIÓN: Se busca el préstamo de la lista que coincide con el seleccionado
    const prestamoDeLaLista = prestamoSeleccionado
        ? prestamosCliente.find(p => p.id === prestamoSeleccionado.id)
        : null;

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
                {/* Se renderiza solo cuando tenemos datos de AMBAS fuentes */}
                {prestamoSeleccionado && prestamoDeLaLista && (
                    <TablaCuotas
                        // Las cuotas detalladas vienen de 'prestamoSeleccionado'
                        cuotas={prestamoSeleccionado.cuota}
                        onPagar={handleAbrirModalPago}
                        onViewComprobante={handleViewComprobante}
                        // La URL del cronograma viene de 'prestamoDeLaLista'
                        cronogramaUrl={prestamoDeLaLista.cronograma_url}
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