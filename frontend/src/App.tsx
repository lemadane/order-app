import './App.css';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

import NavBar from './components/NavBar';
import AddOrder from './components/AddOrder';
import AddCustomer from './components/AddCustomer';
import AddSku from './components/AddSku';
import MainLayout from './components/MainLayout'

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path='/'
        element={<MainLayout />}
      >
        <Route
          path='/customer'
          element={<AddCustomer />}
        />
        <Route
          path='/sku'
          element={<AddSku />}
        />
        <Route
          path='/order'
          element={<AddOrder />}
        />
        <Route
          path='*'
          element={<h2>Not Found - 404</h2>}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
