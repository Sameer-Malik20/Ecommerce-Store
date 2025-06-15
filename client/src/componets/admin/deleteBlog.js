import React, { useState } from "react";
import api from "./api";

function DeleteBlog() {
  const [blogId, setBlogId] = useState("");

  const handleDelete = async () => {
    if (!blogId) return alert("Please enter a blog ID");
    try {
      await api.delete(`/admin/deleteblog/${blogId}`);
      alert("Blog deleted successfully");
      setBlogId("");
    } catch (error) {
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="flex gap-4">
      <input
        type="text"
        value={blogId}
        onChange={(e) => setBlogId(e.target.value)}
        placeholder="Enter Blog ID"
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

export default DeleteBlog;
