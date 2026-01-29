import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppProvider = ({children}) => {

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favouriteMovies, setFavouriteMovies] = useState([])

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const [user, setUser] = useState(null);
    const location = useLocation()
    const navigate = useNavigate()

    const getUserToken = () => localStorage.getItem("token");
    const getAdminToken = () => localStorage.getItem("adminToken");

    const fetchIsAdmin = async () => {
        try {
            const token = getAdminToken();
            if(!token){
                if(location.pathname.startsWith("/admin")){
                    navigate("/admin-login");
                    toast.error("Please login as Admin");
                }
                return;
            }
            const {data} = await axios.get('/api/admin/is-admin', {headers: {Authorization: `Bearer ${token}`}})
            // setIsAdmin(!!data.isAdmin);

            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/');
                toast.error('You are not authorized to access admin dashboard')
            }
        } catch (error) {
            console.error(error);
            setIsAdmin(false);
            navigate("/admin-login");
            toast.error("Admin token invalid. Login again.");
        }
    }

    const fetchShows = async () => {
        try {
            const {data} = await axios.get('/api/show/all')
            if(data.success){
                setShows(data.shows)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    };

    const fetchFavouriteMovies = async () => {
        try {
            const token = getUserToken();
                if (!token) {
                    setFavouriteMovies([]);
                    return;
                }
            const {data} = await axios.get('/api/user/favourite', {headers: {Authorization: `Bearer ${token}`},})
            if(data.success){
                setFavouriteMovies(data.movies)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        fetchShows();
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if(storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        if(user){
            fetchIsAdmin()
            fetchFavouriteMovies()
        }
    }, [location.pathname])

    const value = {
        axios,
        fetchIsAdmin,
        user, getUserToken, getAdminToken, navigate, isAdmin, shows,
        favouriteMovies,fetchFavouriteMovies, fetchIsAdmin, fetchShows, setUser, image_base_url,
    };
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)