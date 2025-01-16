import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { BsCardText } from 'react-icons/bs';
import { AiFillSetting } from 'react-icons/ai';
import { AiOutlineLogout } from 'react-icons/ai';
import { ImList } from 'react-icons/im';
import '../../styles/navbar/navbar.css';

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string>('dashboard');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) setActiveLink('dashboard');
    else if (path.includes('/opportunities')) setActiveLink('opportunities');
    else if (path.includes('/assistedDialer')) setActiveLink('assistedDialer');
    else if (path.includes('/reports')) setActiveLink('reports');
    else if (path.includes('/settings')) setActiveLink('settings');
  }, [location]);

  const handleLogout = () => {
    document.cookie = "access_token=; Max-Age=0; path=/;";
    window.location.href = '/login';
  };

  if (location.pathname === '/login') return null;

  return (
    <>
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <button className='sidebar-toggle-button'>☰</button>
        </div>
        <ul>
          <li>
            <Link to="/dashboard" className={activeLink === 'dashboard' ? 'active' : ''}>
              <div className="link-content">
                <FaHome />
                {sidebarOpen && <span>Dashboard</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link to="/opportunities" className={activeLink === 'opportunities' ? 'active' : ''}>
              <div className="link-content">
                <ImList />
                {sidebarOpen && <span>Opportunities</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link to="/assistedDialer" className={activeLink === 'assistedDialer' ? 'active' : ''}>
              <div className="link-content">
                <BsFillTelephoneFill />
                {sidebarOpen && <span>Assisted Dialer</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link to="/reports" className={activeLink === 'reports' ? 'active' : ''}>
              <div className="link-content">
                <BsCardText />
                {sidebarOpen && <span>Reports</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link to="/settings" className={activeLink === 'settings' ? 'active' : ''}>
              <div className="link-content">
                <AiFillSetting />
                {sidebarOpen && <span>Settings</span>}
              </div>
            </Link>
          </li>
          <li>
            <button onClick={handleLogout}>
              <div className="link-content">
                <AiOutlineLogout />
                {sidebarOpen && <span>Logout</span>}
              </div>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
