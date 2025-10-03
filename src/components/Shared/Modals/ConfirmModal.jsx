// src/components/Shared/ConfirmModal.jsx

import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel, confirmText = 'Sí', cancelText = 'No' }) => {
    return (
        // Fondo oscuro y semi-transparente
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-sm transform transition-all duration-300 scale-100">
                
                {/* Mensaje de Confirmación */}
                <h3 className="text-lg font-semibold mb-6 text-gray-800 text-center">
                    {message}
                </h3>
                
                {/* Botones de Acción */}
                <div className="flex justify-end gap-4">
                    {/* Botón de Cancelar/No */}
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
                    >
                        {cancelText}
                    </button>
                    {/* Botón de Confirmar/Sí (con énfasis en color) */}
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-800 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;