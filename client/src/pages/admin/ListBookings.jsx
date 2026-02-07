import React, { useEffect, useState } from 'react';
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import BlurCircle from '../../components/BlurCircle';
import { useAppContext } from '../../context/AppContext';
import { Trash2 } from 'lucide-react';

const ListBookings = () => {

    const currency = import.meta.env.VITE_CURRENCY

    const {axios, getAdminToken, user} = useAppContext()

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAllBookings = async () => {
        try {
            const {data} = await axios.get("/api/admin/all-bookings", {headers: {Authorization: `Bearer ${await getAdminToken()}`}});
            setBookings(data.bookings)
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false)
    };

    const handleDeleteBooking = async (bookingId) => {
    try {
      const token = await getAdminToken();

      const { data } = await axios.delete(`/api/admin/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.success) {
        console.error(data.message);
        return;
      }

      // Remove from UI instantly
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

    useEffect(() => {
        const token = getAdminToken();
        if(token){
            getAllBookings();
        }
    }, []);

    return !isLoading ? (
        <>
            <Title text1="List" text2="Bookings" />
            <div className='max-w-8xl mt-6 overflow-x-auto'>
                <BlurCircle right="100px" left="180px" top="50px" />
                    <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
                    <thead>
                        <tr className='bg-primary/20 text-center text-white'>
                            <th className='p-2 font-medium'>User Name</th>
                            <th className='p-2 font-medium'>Movie Name</th>
                            <th className='p-2 font-medium'>Show Time</th>
                            <th className='p-2 font-medium'>Seats</th>
                            <th className='p-2 font-medium'>Amount</th>
                            <th className='p-2 font-medium'>Payment Status</th>
                            <th className='p-2 font-medium'>Payment Date</th>
                            <th className='p-2 font-medium'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm font-light'>
                        {bookings.map((item, index) => (
                            <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10 text-center' >
                                <td className='p-2'>{item.user.name}</td>
                                <td className='p-2'>{item.show.movie.title}</td>
                                <td className='p-2'>{dateFormat(item.show.showDateTime)}</td>
                                <td className='p-2'>{Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")}</td>
                                <td className='p-2'>{currency} {item.amount}</td>
                                <td className='p-2'>{item.isPaid ? "Paid" : "Unpaid"}</td>
                                <td className="p-2">{item.createdAt ? dateFormat(item.createdAt) : "—"}</td>
                                <td className="p-2">
                                <button onClick={() => handleDeleteBooking(item._id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-5 h-5 cursor-pointer" />
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : <Loading />
}

export default ListBookings;