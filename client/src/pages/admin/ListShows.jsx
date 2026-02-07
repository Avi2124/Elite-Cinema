import React, { useEffect, useState } from 'react';
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import BlurCircle from '../../components/BlurCircle';
import { useAppContext } from '../../context/AppContext';
import { Trash2 } from 'lucide-react';

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const { axios, getAdminToken, user } = useAppContext();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-shows', {
        headers: { Authorization: `Bearer ${await getAdminToken()}` },
      });

      // ✅ Clean the data: remove null shows and shows without movie
      const safeShows = (data.shows || []).filter(
        (show) => show && show.movie
      );

      setShows(safeShows);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDeleteShow = async (showId) => {
    try {
      const token = await getAdminToken();

      const {data} = await axios.delete(`/api/admin/shows/${showId}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      if(!data.success){
        console.error(data.message);
        return;
      }
      setShows((prev) => prev.filter((s) => s._id !== showId));
    } catch (error) {
      console.error("Delete show error:", error);
    }
  };

  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      getAllShows();
    }
  }, []);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      <div className="max-w-6xl mt-6 overflow-x-auto">
        <BlurCircle right="100px" left="180px" top="50px" />
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-center text-white">
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
              <th className="p-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light text-center">
            {(shows || [])
              .filter((show) => show && show.movie) // ✅ extra guard in render
              .map((show, index) => {
                const movie = show.movie;

                const occupiedSeatsCount = show.occupiedSeats
                  ? Object.keys(show.occupiedSeats).length
                  : 0;

                const earnings =
                  occupiedSeatsCount * (show.showPrice || 0);

                return (
                  <tr
                    // ✅ Never assume _id exists; fallback to index
                    key={show?._id ?? index}
                    className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
                  >
                    <td className="p-2">{movie?.title ?? 'Untitled'}</td>
                    <td className="p-2">{dateFormat(show.showDateTime)}</td>
                    <td className="p-2">{occupiedSeatsCount}</td>
                    <td className="p-2">{currency} {earnings}</td>
                    <td className="p-2">
                                <button onClick={() => handleDeleteShow(show._id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-5 h-5 cursor-pointer" />
                                </button>
                                </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListShows;
