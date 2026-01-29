// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { assets } from "../assets/assets";
// import { MenuIcon, SearchIcon, TicketPlus, User, XIcon } from "lucide-react";
// import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

// const Navbar = () => {

//     const [isOpen, setIsOpen] = useState(false)
//     const {user} = useUser()
//     const {openSignIn} = useClerk()
//     const navigate = useNavigate()

//   return (
//     <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
//       <Link to="/" className="max-md:flex-1">
//         <img src={assets.logo} alt="Logo" className="w-36 h-auto" />
//       </Link>
//       <div className={`max-md:absolute max-md:top-0 max-md:left-0 max:md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
//         <XIcon className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}/>

//         <Link onClick={() => {scrollTo(0,0), setIsOpen(false)}} to="/">Home</Link>
//         <Link onClick={() => {scrollTo(0,0), setIsOpen(false)}} to="/movies">Movies</Link>
//         <Link onClick={() => {scrollTo(0,0), setIsOpen(false)}} to="/">Theaters</Link>
//         <Link onClick={() => {scrollTo(0,0), setIsOpen(false)}} to="/">Releases</Link>
//         <Link onClick={() => {scrollTo(0,0), setIsOpen(false)}} to="/favourite">Favourites</Link>
//       </div>

//       <div className="flex items-center gap-8">
//         <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
//         {
//             !user ? (
//             <button onClick={openSignIn} className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer">
//           Login
//         </button>
//         ) : (
//             <UserButton>
//                 <UserButton.MenuItems>
//                     <UserButton.Action label="My Bookings" labelicon={<TicketPlus width={15} onClick={()=> navigate('/my-bookings')}/>}/>
//                 </UserButton.MenuItems>
//             </UserButton>
//         )
//         }
        
//       </div>

//       <MenuIcon className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
//     </div>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, TicketPlus, User, XIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const {favouriteMovies} = useAppContext();

  // ✅ Token-based auth
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">

      {/* Logo */}
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="Logo" className="w-45 h-auto" />
      </Link>

      {/* Center Menu (Same CSS as before) */}
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen md:rounded-full
        backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? "max-md:w-full" : "max-md:w-0"}`}>
        <XIcon className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer text-white" onClick={() => setIsOpen(false)}/>

        <Link onClick={() => {scrollTo(0,0); setIsOpen(false)}} to="/">Home</Link>
        <Link onClick={() => {scrollTo(0,0); setIsOpen(false)}} to="/movies">Movies</Link>
        <Link onClick={() => {scrollTo(0,0); setIsOpen(false)}} to="/theaters">Theaters</Link>
        <Link onClick={() => {scrollTo(0,0); setIsOpen(false)}} to="/releases">Releases</Link>
        {favouriteMovies.length > 0  && <Link onClick={() => {scrollTo(0,0); setIsOpen(false)}} to="/favourite">Favourites</Link>}

        {/* Mobile Login / Logout */}
        {!token ? (
          <button onClick={() => {setIsOpen(false); navigate("/login");}} className="md:hidden mt-4 px-8 py-3 bg-primary rounded-full text-white cursor-pointer">
            Login
          </button>
        ) : (
          <button onClick={logout} className="md:hidden mt-4 px-8 py-3 bg-red-500 rounded-full text-white cursor-pointer">
            Logout
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-8 text-white">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />

        {!token ? (
          <button onClick={() => navigate("/login")} className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer">
            Login
          </button>
        ) : (
          <div className="relative group">
            <User className="w-6 h-6 cursor-pointer" />
            <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => navigate("/my-bookings")} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <TicketPlus size={16} />
                My Bookings
              </button>
              <button onClick={logout} className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 cursor-pointer">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <MenuIcon className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer text-white cursor-pointer" onClick={() => setIsOpen(true)}/>
    </div>
  );
};

export default Navbar;