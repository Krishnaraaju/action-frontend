import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AuctionList = ({ type = 'upcoming' }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch auctions from API
    const fetchAuctions = async () => {
      try {
        // Mock data for now
        const mockAuctions = [
          {
            id: 1,
            title: 'Vintage Watch',
            startPrice: 100,
            startTime: new Date(Date.now() + 3600000).toISOString(),
            endTime: new Date(Date.now() + 7200000).toISOString(),
            description: 'Rare vintage watch in excellent condition',
          },
          // Add more mock auctions as needed
        ];
        setAuctions(mockAuctions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching auctions:', error);
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [type]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {type === 'upcoming' ? 'Upcoming Auctions' : 'Current Auctions'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctions.map((auction) => (
          <Link
            key={auction.id}
            to={`/auction/${auction.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{auction.title}</h3>
              <p className="text-gray-600 mb-2">{auction.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium">
                  Starting bid: ${auction.startPrice}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(auction.startTime).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AuctionList; 