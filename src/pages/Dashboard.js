import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuctionCard from '../components/common/AuctionCard';
import AuctionFilters from '../components/AuctionFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auctions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch auctions');
        }

        setAuctions(data.data.auctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
        showNotification(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [showNotification]);

  const handleFilter = (filters) => {
    // TODO: Implement filtering logic
    console.log('Applying filters:', filters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.fullName}</h1>
        {(user.role === 'seller' || user.role === 'both') && (
          <Link
            to="/create-auction"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Auction
          </Link>
        )}
      </div>
      
      <AuctionFilters onFilter={handleFilter} />

      {auctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No auctions found</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 