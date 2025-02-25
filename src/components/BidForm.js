import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from './common/LoadingSpinner';

const BidForm = ({ auctionId, currentPrice }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Submitting bid with auction ID:', auctionId);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          auctionId,
          amount: parseFloat(bidAmount)
        }),
      });

      const data = await response.json();
      console.log('Bid response:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to submit bid');
      }

      showNotification('Bid submitted successfully!', 'success');
      setBidAmount('');
    } catch (error) {
      console.error('Bid error:', error);
      showNotification(error.message || 'Failed to submit bid', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Place Your Bid</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Bid Amount (USD)
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="bidAmount"
              id="bidAmount"
              min={currentPrice + 1}
              step="0.01"
              required
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Minimum bid: ${currentPrice + 1}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !bidAmount || parseFloat(bidAmount) <= currentPrice}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            'Submit Bid'
          )}
        </button>
      </form>
    </div>
  );
};

export default BidForm; 