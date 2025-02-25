import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BidForm from './BidForm';
import { useWebSocket } from '../context/WebSocketContext';
import Countdown from './common/Countdown';
import LoadingSpinner from './common/LoadingSpinner';
import { useNotification } from '../context/NotificationContext';

const AuctionMode = () => {
  const { id: auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { ws, sendMessage, isConnected } = useWebSocket();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const fetchAuction = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auctions/${auctionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch auction');
      }

      setAuction(data.data.auction);
      setLoading(false);

      if (isConnected) {
        sendMessage({
          type: 'joinAuction',
          auctionId
        });
      }
    } catch (error) {
      console.error('Error fetching auction:', error);
      showNotification(error.message, 'error');
      setLoading(false);
      navigate('/dashboard');
    }
  }, [auctionId, isConnected, sendMessage, navigate, showNotification]);

  useEffect(() => {
    if (auctionId) {
      fetchAuction();
    }
  }, [auctionId, fetchAuction]);

  useEffect(() => {
    if (!ws) return;

    const handleWebSocketMessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'bidUpdate':
          fetchAuction();
          setBidHistory(prev => [...prev, {
            timestamp: new Date(),
            message: `New bid placed by ${data.lastBidder}`
          }]);
          break;
        case 'auctionEnd':
          setAuction(prev => ({
            ...prev,
            status: 'ended',
            winner: data.winner
          }));
          break;
        case 'statusUpdate':
          setAuction(prev => ({
            ...prev,
            status: data.status
          }));
          break;
        default:
          break;
      }
    };

    ws.addEventListener('message', handleWebSocketMessage);

    return () => {
      ws.removeEventListener('message', handleWebSocketMessage);
    };
  }, [ws, fetchAuction]);

  // Refetch auction when WebSocket reconnects
  useEffect(() => {
    if (isConnected) {
      fetchAuction();
    }
  }, [isConnected]);

  if (loading || !auction) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">{auction.title}</h1>
            <div className="flex items-center space-x-4">
              <Countdown endTime={auction.endTime} />
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d={isFullscreen 
                      ? "M9 9h6m-6 6h6M5 5h14v14H5V5z"
                      : "M4 8V4m0 0h4M4 4l5 5m11-5v4m0-4h-4m4 4l-5-5m-7 11v4m0-4H4m4 4l-5-5m11 5v-4m0 4h4m-4-4l5 5"} 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Auction details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Auction Details</h2>
              <p className="text-gray-600 mb-4">{auction.description}</p>
              <div className="border-t pt-4">
                <p className="mb-2">
                  <span className="font-semibold">Starting Price:</span> ${auction.startPrice}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Current Price:</span> ${auction.currentPrice}
                </p>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Bid History</h3>
              <div className="space-y-2">
                {bidHistory.length > 0 ? (
                  bidHistory.map((bid, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{bid.message}</span>
                      <span className="text-gray-500">
                        {new Date(bid.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No bids yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Bid form */}
          <div>
            {auction.status === 'ended' ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Auction Ended</h3>
                {auction.winner ? (
                  <div>
                    <p className="text-green-600 font-semibold">
                      Winner: {auction.winner.winnerName}
                    </p>
                    <p className="text-gray-600 mt-2">
                      Winning Bid: ${auction.winner.winningBid}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Results will be announced shortly.
                  </p>
                )}
              </div>
            ) : (
              <BidForm auctionId={auction._id} currentPrice={auction.currentPrice} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionMode; 