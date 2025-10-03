// src/pages/clientes/AgregarCliente.jsx
import React, { useState } from 'react';

// Importación de los componentes del formulario
import ClienteForm from './components/formularios/ClienteForm';
import DireccionesForm from './components/formularios/DireccionesForm';
import ContactosForm from './components/formularios/ContactosForm';
import EmpleoForm from './components/formularios/EmpleoForm';
import CuentasBancariasForm from './components/formularios/CuentasBancariasForm';
import AvalesForm from './components/formularios/AvalesForm';

import AlertMessage from 'components/Shared/Errors/AlertMessage';

// Importación del servicio
import { createCliente } from 'services/clienteService';

const initialFormData = {
  datosPersonales: {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    apellidoConyuge: '',
    estadoCivil: 'SOLTERO/A',
    sexo: 'M',
    dni: '',
    fechaNacimiento: '',
    fechaCaducidadDni: '',
    nacionalidad: 'PERUANA',
    residePeru: true,
    nivelEducativo: '',
    profesion: '',
    enfermedadesPreexistentes: false,
    ruc: '',
    expuestaPoliticamente: false,
  },
  direcciones: {
    direccionFiscal: '',
    direccionCorrespondencia: '',
    departamento: '',
    provincia: '',
    distrito: '',
    tipoVivienda: '',
    tiempoResidencia: '',
    referenciaDomicilio: '',
  },
  contactos: {
    tipo: 'PRINCIPAL',
    telefonoMovil: '',
    telefonoFijo: '',
    correo: '',
  },
  empleo: {
    centroLaboral: '',
    ingresoMensual: '',
    inicioLaboral: '',
    situacionLaboral: '',
  },
  cuentasBancarias: {
    ctaAhorros: '',
    cci: '',
    entidadFinanciera: '',
  },
  avales: [], // Array para múltiples avales
};

const STEPS = [
  { id: 1, name: 'Datos Personales' },
  { id: 2, name: 'Dirección y Contacto' },
  { id: 3, name: 'Información Laboral' },
  { id: 4, name: 'Cuentas y Avales' },
];

const AgregarCliente = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const handleAvalesChange = (updatedAvales) => {
    setFormData((prev) => ({
      ...prev,
      avales: updatedAvales,
    }));
  };

  // El "e.preventDefault()" ya no es estrictamente necesario aquí, pero es buena práctica dejarlo.
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Previene cualquier comportamiento por si acaso
    setLoading(true);
    try {
      const response = await createCliente(formData);
      setAlert(response);
      setFormData(initialFormData);
      setCurrentStep(1);
    } catch (error) {
      setAlert(error);
    } finally {
      setLoading(false);
    }
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return <ClienteForm data={formData.datosPersonales} handleChange={(e) => handleChange(e, 'datosPersonales')} />;
      case 2:
        return (
          <>
            <DireccionesForm data={formData.direcciones} handleChange={(e) => handleChange(e, 'direcciones')} />
            <ContactosForm data={formData.contactos} handleChange={(e) => handleChange(e, 'contactos')} />
          </>
        );
      case 3:
        return <EmpleoForm data={formData.empleo} handleChange={(e) => handleChange(e, 'empleo')} />;
      case 4:
        return (
          <>
            <CuentasBancariasForm data={formData.cuentasBancarias} handleChange={(e) => handleChange(e, 'cuentasBancarias')} />
            <AvalesForm avales={formData.avales} setAvales={handleAvalesChange} />
          </>
        );
      default:
        return <ClienteForm data={formData.datosPersonales} handleChange={(e) => handleChange(e, 'datosPersonales')} />;
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Registro de Nuevo Cliente</h1>
      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />
      
      {/* Stepper */}
      <div className="mb-8">
        <ol className="flex items-center w-full">
          {STEPS.map((step, index) => (
            <li key={step.id} className={`flex w-full items-center ${index < STEPS.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-1 after:inline-block" : ""}`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${currentStep >= step.id ? 'bg-red-700 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step.id}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* =============================================================== */}
      {/* CAMBIO 1: SE QUITÓ EL onSubmit DE AQUÍ */}
      {/* =============================================================== */}
      <form>
        <div className="bg-white p-8 rounded-lg shadow-md">
          {renderFormStep()}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="px-6 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
          >
            Anterior
          </button>
          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-2 text-white bg-red-700 rounded-md hover:bg-red-800 disabled:opacity-50"
            >
              Siguiente
            </button>
          ) : (
            /* =============================================================== */
            /* CAMBIO 2: EL BOTÓN AHORA ES TIPO "button" Y USA "onClick" */
            /* =============================================================== */
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AgregarCliente;