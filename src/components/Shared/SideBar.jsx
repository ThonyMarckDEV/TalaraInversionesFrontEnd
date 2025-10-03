import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import jwtUtils from 'utilities/Token/jwtUtils';
import { logout } from 'js/logout';
import logo from 'assets/img/talara_creditos_inversiones_logo.png';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const refresh_token = jwtUtils.getRefreshTokenFromCookie();
  const rol = refresh_token ? jwtUtils.getUserRole(refresh_token) : null;

  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowConfirm(false);
  };

  const menus = {
    admin: [
      {
        section: 'Dashboard',
        link: '/admin/dashboard',
      },
      {
        section: 'Clientes',
        subs: [
          { name: 'Agregar Cliente', link: '/admin/agregar-cliente' },
          { name: 'Listar Clientes', link: '/admin/listar-clientes' },
        ],
      }
    ],
    cliente: [
      {
        section: 'Home',
        link: '/cliente',
      },
      {
        section: 'Solicitud Préstamos',
        subs: [
          { name: 'Solicitar', link: '/cliente/solicitar-prestamo' },
          { name: 'Mis Solicitudes', link: '/cliente/mis-solicitudes' },
        ],
      },
      {
        section: 'Support',
        link: '/cliente/support',
      },
    ],
    asesor: [
      {
        section: 'Dashboard',
        link: '/asesor/dashboard',
      },
      {
        section:'Evaluaciones',
        subs:[
          {name:'Evaluar Cliente' , link:'/asesor/evaluacion-cliente'},
          {name:'Evaluaciones Enviadas' ,  link: '/asesor/evaluaciones-enviadas'}
        ]
      },
    ],
    cajero: [
      {
        section: 'Dashboard',
        link: '/cajero/dashboard',
      },
      {
        section: 'Reports',
        link: '/cajero/reports',
      },
      {
        section: 'Teams',
        subs: [
          { name: 'Team List', link: '/encargado/teams/list' },
          { name: 'Assign Tasks', link: '/encargado/teams/tasks' },
        ],
      },
    ],
  };

  const roleMenu = rol && menus[rol] ? menus[rol] : [];

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
            {roleMenu.map((item, index) => (
              <div key={index}>
                {item.subs ? (
                  <>
                    <button
                      className="w-full flex items-center justify-between text-white py-2 px-4 rounded-md hover:bg-red-900 transition focus:outline-none"
                      onClick={() => toggleSection(item.section)}
                    >
                      <span>{item.section}</span>
                      <ChevronDownIcon
                        className={`h-5 w-5 transform transition-transform ${
                          openSections[item.section] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openSections[item.section] && (
                      <ul className="ml-4 space-y-1">
                        {item.subs.map((sub, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={sub.link}
                              className="block text-white py-1 px-4 rounded-md hover:bg-red-900 transition"
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
                    className="block text-white py-2 px-4 rounded-md hover:bg-red-900 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.section}
                  </Link>
                )}
              </div>
            ))}
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

        
      {/* 💡MODAL ConfirmModal */}
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
