import { useState } from 'react';
import Wrapper from '../assets/wrappers/Navbar';
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext/appContext';
import Logo from './Logo';
import { useAuthContext } from '../context/AuthContext/AuthContext';

export default function Navbar() {
  const [showLogout, setShowLogout] = useState(false);
  const { toggleSidebar } = useAppContext();
  const { logout, user } = useAuthContext();
  let userName: string | undefined = '';
  user?.getUserData((err, data) => {
    userName = data?.UserAttributes[3].Value;
  });

  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggleSidebar}>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h3 className="logo-text"> dashboard </h3>
        </div>
        <div className="btn-container">
          <button
            type="button"
            className="btn"
            onClick={() => setShowLogout((prev) => !prev)}
          >
            <FaUserCircle />
            {user && userName}
            <FaCaretDown />
          </button>
          <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
            <button type="button" className="dropdown-btn" onClick={logout}>
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
