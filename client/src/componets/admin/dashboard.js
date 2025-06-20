import React from "react";
import UsersList from "./userList";
import CartsList from "./cartList";
import Deleteitem from "./deleteitem";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">Manage your website efficiently</p>
      </header>

      {/* Add Item Button */}
      <div className="flex justify-center mb-10">
        <a
          href="/create"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Add Item
        </a>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Users List */}
        <section className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="flex items-center text-xl font-semibold mb-4 text-gray-800">
            <span className="mr-2">👥</span> All Users
          </h2>
          <UsersList />
        </section>

        {/* Carts List */}
        <section className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="flex items-center text-xl font-semibold mb-4 text-gray-800">
            <span className="mr-2">🛒</span> All Carts
          </h2>
          <CartsList />
        </section>
      </div>

      {/* Delete item */}
      <section className="mt-10 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="flex items-center text-xl font-semibold mb-4 text-gray-800">
          <span className="mr-2">🗑️</span> Delete item
        </h2>
        <Deleteitem />
      </section>
    </div>
  );
}

export default Dashboard;
