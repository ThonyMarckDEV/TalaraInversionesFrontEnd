// ./components/formularios/ResultadosCalculo.jsx

import React from 'react';

const ResultadosCalculo = ({ totalPagar, valorCuota }) => {
    const isReady = totalPagar > 0;
    
    return (
        <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">3. Resultados del Cálculo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-yellow-50 p-4 border border-yellow-300 rounded-lg">
                
                {/* Valor de la Cuota */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Importe de la Cuota (S/.)</label>
                    <p className={`text-2xl font-bold ${isReady ? 'text-green-700' : 'text-gray-500'}`}>
                        S/ {isReady ? valorCuota : '0.00'}
                    </p>
                </div>
                
                {/* Total a Pagar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total a Pagar (Capital + Interés)</label>
                    <p className={`text-2xl font-bold ${isReady ? 'text-green-700' : 'text-gray-500'}`}>
                        S/ {isReady ? totalPagar : '0.00'}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ResultadosCalculo;