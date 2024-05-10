import { Link, useLocation } from 'react-router-dom';

function NavBar() {
  const location = useLocation();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/order" className={location.pathname === '/order' ? 'active' : ''}>
            Order
          </Link>
        </li>
        <li>
          <Link to="/customer" className={location.pathname === '/customer' ? 'active' : ''}>
            Customer
          </Link>
        </li>
        <li>
          <Link to="/sku" className={location.pathname === '/sku' ? 'active' : ''}>
            SKU
          </Link>
        </li>
        {/* Add more links here as needed */}
      </ul>
    </nav>
  );
}

export default NavBar;