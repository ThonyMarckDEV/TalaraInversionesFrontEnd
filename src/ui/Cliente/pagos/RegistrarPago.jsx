import React, { useState, useEffect, useCallback } from 'react';
import jwtUtils from 'utilities/Token/jwtUtils';
import { getPrestamos, getPrestamoById } from 'services/prestamoService';
import { registrarPago, cancelarTotalPrestamo } from 'services/pagoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import ListaPrestamosCliente from '../components/ListaPrestamosCliente';
import TablaCuotas from '../components/modals/TablaCuotas';
// --- CORRECCIÓN 2: Se importa el modal correcto para el cliente ---
import ConfirmarPagoModal from '../components/modals/ConfirmarPagoModal';
import ViewPdfModal from 'components/Shared/Modals/ViewPdfModal';
import API_BASE_URL from 'js/urlHelper';

const PortalPagosCliente = () => {
    const [clienteId, setClienteId] = useState(null);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [prestamosCliente, setPrestamosCliente] = useState([]);
    const [selectedPrestamoId, setSelectedPrestamoId] = useState(null);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    
    // Estados para los modales
    const [cuotaParaPagar, setCuotaParaPagar] = useState(null);
    const [esCancelacion, setEsCancelacion] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    // Carga los datos del cliente desde el JWT al iniciar el componente
    useEffect(() => {
        try {
            const token = jwtUtils.getAccessTokenFromCookie();
            // --- CORRECCIÓN 1: Se asume que getUserID devuelve el ID directamente ---
            const idUsuario = jwtUtils.getUserID(token); 
            
            // La comprobación ahora es directa sobre el ID obtenido
            if (idUsuario) {
                setClienteId(idUsuario);
            } else {
                setAlert({ type: 'error', message: 'No se pudo identificar. Por favor, inicie sesión de nuevo.' });
                setLoading(false);
            }
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al verificar su sesión.' });
            setLoading(false);
        }
    }, []);

    // Busca los préstamos una vez que se tiene el ID del cliente
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
            setAlert({ type: 'error', message: 'Error al buscar tus préstamos.' });
        } finally {
            setLoading(false);
        }
    }, [clienteId]);

    useEffect(() => {
        if (clienteId) { // Solo busca préstamos si ya se estableció el ID
            buscarPrestamos();
        }
    }, [clienteId, buscarPrestamos]);

    // Obtiene los detalles y cuotas de un préstamo seleccionado
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

    // Abre el modal para pagar una cuota individual
    const handleAbrirModalPago = (cuotaId) => {
        const cuota = prestamoSeleccionado.cuota.find(c => c.id === cuotaId);
        setCuotaParaPagar(cuota);
        setEsCancelacion(false);
    };

    // Prepara los datos para cancelar la totalidad del préstamo
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
    
    // Abre el modal para visualizar un comprobante en PDF
    const handleViewComprobante = (url) => {
        if (!url) {
            setAlert({ type: 'info', message: 'No se encontró un comprobante para esta cuota.' });
            return;
        }
        const fullUrl = `${API_BASE_URL}${url}`;
        setPdfUrl(fullUrl);
        setIsPdfModalOpen(true);
    };

    // Envía la petición para registrar el pago (individual o total)
    const handleConfirmarPago = async (pagoData) => {
        setLoading(true);
        try {
            const dataToSend = {
                ...pagoData,
                modalidad: 'VIRTUAL',
                fecha_pago: new Date().toISOString().split('T')[0],
            };
            
            const service = esCancelacion ? cancelarTotalPrestamo : registrarPago;
            const response = await service(dataToSend);
            
            setAlert({ type: 'success', message: response.message });
            setCuotaParaPagar(null);
            await handleSelectPrestamo(selectedPrestamoId);
        } catch (err) {
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
                        onCancelarTotal={handleAbrirModalCancelacion}
                    />
                )}
            </div>

            {cuotaParaPagar && (
                // --- CORRECCIÓN 2: Se llama al modal correcto ---
                <ConfirmarPagoModal
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

export default PortalPagosCliente;