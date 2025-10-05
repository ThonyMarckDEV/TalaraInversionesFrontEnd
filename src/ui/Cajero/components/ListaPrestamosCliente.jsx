import React from 'react';

const ListaPrestamosCliente = ({ prestamos, onSelectPrestamo, selectedPrestamoId }) => {

    if (prestamos.length === 0) {
        return <p className="text-center text-gray-500 py-4">El cliente no tiene préstamos vigentes.</p>;
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-700">Préstamos Vigentes del Cliente</h3>
            {prestamos.map((p) => (
                <label key={p.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedPrestamoId === p.id ? 'bg-red-50 border-red-500 shadow-md' : 'bg-white hover:bg-gray-50'}`}>
                    <input
                        type="radio"
                        name="prestamo"
                        className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                        onChange={() => onSelectPrestamo(p.id)}
                        checked={selectedPrestamoId === p.id}
                    />
                    
                    <div className="ml-4 flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <p className="text-sm font-medium">
                            ID: <span className="font-bold text-red-800">{p.id}</span>
                        </p>
                        <p className="text-sm">
                            Monto: <span className="font-semibold">S/ {parseFloat(p.monto).toFixed(2)}</span>
                        </p>
                        <p className="text-sm">
                            Interés: <span className="font-semibold">{(parseFloat(p.interes) * 100).toFixed(0)}%</span>
                        </p>
                        <p className="text-sm">
                            Total: <span className="font-semibold">S/ {parseFloat(p.total).toFixed(2)}</span>
                        </p>
                    </div>

                </label>
            ))}
        </div>
    );
};

export default ListaPrestamosCliente;