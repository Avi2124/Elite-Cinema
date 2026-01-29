import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import Favourite from './pages/Favourite';
import { Toaster } from 'react-hot-toast';
import Auth from './pages/Auth';
import Layout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import AddShows from './pages/admin/AddShows';
import ListShows from './pages/admin/ListShows';
import ListBookings from './pages/admin/ListBookings';
import AdminLogin from './pages/admin/AdminLogin';
import { useAppContext } from './context/AppContext';
import Loading from './components/Loading';

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || ""
  );

  const {getUserToken } = useAppContext();
  const token = getUserToken();

  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login';

  return(
    <>
    <Toaster />
      {!isAdminRoute && !isAuthRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
         <Route path="/login" element={<Auth />} />
        <Route path='/movies' element={<Movies/>} />
        <Route path='/movies/:id' element={<MovieDetails/>} />
        <Route path='/movies/:id/:date' element={<SeatLayout/>} />
        <Route path='/my-bookings' element={token ? <MyBookings/> : <Navigate to="/login" />} />
        <Route path='/loading/:nextUrl' element={<Loading />} />
        <Route path='/favourite' element={<Favourite/>} />
        {/* <Route path='/favourite' element={user ? <Favourite/> : <Navigate to="/login" /> } /> */}
        
        <Route path="/admin-login" element={<AdminLogin setAdminToken={setAdminToken} />} />
        <Route path="/admin/*" element={adminToken ? <Layout /> : <Navigate to="/admin-login" />}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && isAuthRoute && <Footer />}
    </>
  );
};

export default App;