import React from 'react';
import { Link } from 'react-router-dom';

const VertNav = () => {
    return (
        <div className="flex  mr-4 flex-col gap-4 pl-4 md:border-r">
            <h1 className="text-2xl text-gray-950 text-center font-bold mb-4">SELLER DASHBOARD</h1>
            <Link to="/seller" className=" text-center  items-center gap-3 border border-gray-300 px-3 py-2 rounded-l active hover:bg-gray-200">
               Dashboard
            </Link>
            <Link to="/sell" className=" text-center  items-center gap-3 border border-gray-300 px-3 py-2 rounded-l active hover:bg-gray-200">
                Add Item
            </Link>
            <Link to="/sell/pending" className=" text-center  items-center gap-3 border border-gray-300 py-2 rounded-l active  hover:bg-gray-200">
                Pending Requests
            </Link>
            <Link to="/sell/completed" className="text-center  items-center gap-3 border border-gray-300 px-3 py-2 rounded-l active  hover:bg-gray-200">
                Completed Orders
            </Link>
        </div>
    );
};

export default VertNav;