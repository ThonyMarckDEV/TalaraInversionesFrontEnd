import React, { useState, useEffect, useCallback, useMemo } from 'react'; // 💡 Añadido useMemo
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import jwtUtils from 'utilities/Token/jwtUtils';
import { logout } from 'js/logout';
import logo from 'assets/img/talara_creditos_inversiones_logo.png';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';

// El objeto 'menus' se define UNA SOLA VEZ fuera del componente para ser estable.
const menus = {
    admin: [
        { section: 'Dashboard', link: '/admin/dashboard' },
        { 
            section: 'Clientes', 
            subs: [
                { name: 'Agregar Cliente', link: '/admin/agregar-cliente' },
                { name: 'Listar Clientes', link: '/admin/listar-clientes' },
            ],
        },
        {
            section: 'Empleados',
            subs: [
                { name: 'Agregar Empleado', link: '/admin/agregar-empleado' },
                { name: 'Listar Empleado', link: '/admin/listar-empleados' },
            ],
        },
        {
            section: 'Productos',
            subs: [
                { name: 'Agregar Producto', link: '/admin/agregar-producto' },
                { name: 'Listar Producto', link: '/admin/listar-productos' },
            ],
        }
    ],
    cliente: [
        { section: 'Home', link: '/cliente' },
        {
            section: 'Solicitud Préstamos',
            subs: [
                { name: 'Solicitar', link: '/cliente/solicitar-prestamo' },
                { name: 'Mis Solicitudes', link: '/cliente/mis-solicitudes' },
            ],
        },
        { section: 'Support', link: '/cliente/support' },
    ],
    asesor: [
        { section: 'Dashboard', link: '/asesor/dashboard' },
        {
            section:'Evaluaciones',
            subs:[
                {name:'Evaluar Cliente' , link:'/asesor/evaluacion-cliente'},
                {name:'Evaluaciones Enviadas' ,  link: '/asesor/evaluaciones-enviadas'}
            ]
        },
    ],
    cajero: [
        { section: 'Dashboard', link: '/cajero/dashboard' },
        { section: 'Reports', link: '/cajero/reports' },
        {
            section: 'Teams',
            subs: [
                { name: 'Team List', link: '/encargado/teams/list' },
                { name: 'Assign Tasks', link: '/encargado/teams/tasks' },
            ],
        },
    ],
};

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSection, setOpenSection] = useState(null); 
    const [showConfirm, setShowConfirm] = useState(false);
    
    const location = useLocation();

    const refresh_token = jwtUtils.getRefreshTokenFromCookie();
    const rol = refresh_token ? jwtUtils.getUserRole(refresh_token) : null;

    // 💡 SOLUCIÓN: Usamos useMemo para garantizar que roleMenu solo se recalcule
    // si el 'rol' cambia, estabilizando así su referencia para el useEffect.
    const roleMenu = useMemo(() => {
        return rol && menus[rol] ? menus[rol] : [];
    }, [rol]); // Dependencia: solo cambia cuando el rol cambia.

    const handleLogout = () => {
        logout();
        setShowConfirm(false);
    };

    const toggleSection = (section) => {
        setOpenSection(prevSection => prevSection === section ? null : section);
    };

    // isSectionActive usa useCallback y solo depende de location.pathname
    const isSectionActive = useCallback((item) => {
        if (item.link && location.pathname.startsWith(item.link)) {
            return true;
        }
        if (item.subs) {
            return item.subs.some(sub => location.pathname.startsWith(sub.link));
        }
        return false;
    }, [location.pathname]); 
    
    // useEffect ahora tiene todas sus dependencias estables y correctas.
    useEffect(() => {
        if (openSection === null) {
            const activeItem = roleMenu.find(item => isSectionActive(item));
            
            if (activeItem && activeItem.subs) {
                setOpenSection(activeItem.section);
            }
        }
    }, [location.pathname, roleMenu, isSectionActive, openSection]); 


    return (
        <>
            {/* Hamburger button for mobile */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-800"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bars3Icon className="h-6 w-6 text-gray-800" />
            </button>

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 md:fixed md:block`}
            >
                {/* Top half: White with image */}
                <div className="h-1/4 bg-white flex items-center justify-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-60 w-auto"
                    />
                </div>

                {/* Bottom half: Red with menu */}
                <div className="h-3/4 bg-red-800 overflow-y-auto p-4 flex flex-col">
                    <nav className="space-y-2 flex-grow">
                        {roleMenu.map((item, index) => {
                            const isActive = isSectionActive(item); 
                            const isSubOpen = item.subs && openSection === item.section; 

                            return (
                                <div key={index}>
                                    {item.subs ? (
                                        <>
                                            <button
                                                className={`w-full flex items-center justify-between py-2 px-4 rounded-md transition focus:outline-none 
                                                            ${isActive ? 'bg-red-700 text-white' : 'text-white hover:bg-red-900'}`} 
                                                onClick={() => toggleSection(item.section)}
                                            >
                                                <span>{item.section}</span>
                                                <ChevronDownIcon
                                                    className={`h-5 w-5 transform transition-transform ${
                                                        isSubOpen ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </button>
                                            {isSubOpen && ( 
                                                <ul className="ml-4 space-y-1">
                                                    {item.subs.map((sub, subIndex) => (
                                                        <li key={subIndex}>
                                                            <Link
                                                                to={sub.link}
                                                                className={`block py-1 px-4 rounded-md transition text-sm ${
                                                                    location.pathname.startsWith(sub.link)
                                                                        ? 'bg-red-700 text-white font-semibold' 
                                                                        : 'text-white hover:bg-red-900' 
                                                                }`}
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            to={item.link}
                                            className={`block py-2 px-4 rounded-md transition ${
                                                isActive ? 'bg-red-700 text-white' : 'text-white hover:bg-red-900'
                                            }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.section}
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Logout button at the bottom */}
                    <div className="mt-auto p-4 border-t border-red-700">
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="w-full flex items-center justify-center gap-2 bg-red-900 hover:bg-red-700 text-white px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

            </div>

            {/* MODAL ConfirmModal */}
            {showConfirm && (
                <ConfirmModal
                    message="¿Estás seguro/a de cerrar sesión?"
                    onConfirm={handleLogout}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default Sidebar;