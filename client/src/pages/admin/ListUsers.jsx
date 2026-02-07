import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import { Trash2 } from "lucide-react";

const ListUsers = () => {
  const { axios, getAdminToken } = useAppContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const backEndURL = import.meta.env.VITE_BACKEND_URL; // For backend image path

  const getAllUsers = async () => {
    try {
      const token = await getAdminToken();

      const { data } = await axios.get("/api/admin/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.success) {
        console.error("Error fetching users:", data.message);
        setLoading(false);
        return;
      }

      const safeUsers = (data.users || []).filter(Boolean);
      setUsers(safeUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = await getAdminToken();

      const { data } = await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.success) {
        console.error(data.message);
        return;
      }

      // Remove from UI instantly
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Users" />

      <div className="max-w-8xl mt-6 overflow-x-auto">
        <BlurCircle right="100px" left="180px" top="50px" />

        <table className="w-full text-center border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-white text-center">
              <th className="p-2 font-medium">Profile</th>
              <th className="p-2 font-medium">Name</th>
              <th className="p-2 font-medium">Email</th>
              <th className="p-2 font-medium">Phone</th>
              <th className="p-2 font-medium">Favourites</th>
              <th className="p-2 font-medium">Sign Up</th>
              <th className="p-2 font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="text-sm font-light">
            {users.map((user, index) => (
              <tr
                key={user._id ?? index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
              >
                <td className="p-2 flex items-center justify-center">
                  <img
                    src={`${user.image}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.phone}</td>
                <td className="p-2">{user.favourites?.length || 0}</td>
                <td className="p-2">
                  {user.createdAt ? dateFormat(user.createdAt) : "—"}
                </td>

                {/* DELETE BUTTON HERE */}
                <td className="p-2">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td className="p-4 text-center" colSpan={7}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListUsers;
