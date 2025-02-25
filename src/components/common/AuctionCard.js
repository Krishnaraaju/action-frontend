import React from 'react';
import { Link } from 'react-router-dom';
import Countdown from './Countdown';

const AuctionCard = ({ auction }) => {
  const {
    _id,
    title,
    description,
    currentPrice,
    endTime,
    status
  } = auction;

  return (
    <Link to={`/auction/${_id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Current Price</p>
              <p className="text-lg font-semibold">${currentPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Time Left</p>
              <Countdown endTime={endTime} small />
            </div>
          </div>
          <div className="mt-4">
            <span className={`inline-block px-2 py-1 text-sm rounded ${
              status === 'active' ? 'bg-green-100 text-green-800' :
              status === 'ended' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard; 