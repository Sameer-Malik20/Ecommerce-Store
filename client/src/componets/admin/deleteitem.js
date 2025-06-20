import React, { useState } from "react";
import api from "./api";
import { toast } from "react-toastify";

function Deleteitem() {
  const [itemId, setitemId] = useState("");

  const handleDelete = async () => {
    if (!itemId) return toast.error("Please enter a item ID");
    try {
      await api.delete(`/admin/deleteitem/${itemId}`);
      toast.success("item deleted successfully");
      setitemId("");
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="flex gap-4">
      <input
        type="text"
        value={itemId}
        onChange={(e) => setitemId(e.target.value)}
        placeholder="Enter item ID"
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}

export default Deleteitem;
