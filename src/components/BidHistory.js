const BidHistory = ({ bids }) => {
  return (
    <div className="space-y-2">
      {bids.map((bid, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span>
            Bid by {bid.bidderName} - ${bid.amount}
          </span>
          <span className="text-gray-500">
            {new Date(bid.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}; 