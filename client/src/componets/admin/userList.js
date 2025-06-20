import React, { useEffect, useState } from "react";
import axios from "axios";

function UsersList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        withCredentials: true,
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/deleteuser/${id}`, {
        withCredentials: true,
      });
      fetchUsers(); // refresh after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center bg-gray-100 dark:bg-slate-800 p-3 my-2 rounded shadow"
          >
            <div>
              <p className="font-bold">
                {user.username || user.name || "No Name"}
              </p>

              <p className="text-sm">Role: {user.role}</p>
            </div>
            <button
              onClick={() => handleDelete(user._id)}
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default UsersList;
