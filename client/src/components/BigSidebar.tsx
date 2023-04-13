import Wrapper from '../assets/wrappers/BigSidebar';
import { useAppContext } from '../context/AppContext/appContext';
import NavLinks from './NavLinks';
import Logo from './Logo';

export default function BigSidebar() {
  const { showSidebar } = useAppContext();
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? 'sidebar-container' : 'sidebar-container show-sidebar'
        }
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
}
