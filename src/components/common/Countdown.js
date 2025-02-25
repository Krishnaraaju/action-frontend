import React, { useState, useEffect, useCallback } from 'react';

const Countdown = ({ endTime, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnded, setIsEnded] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const distance = end - now;

    if (distance < 0) {
      setIsEnded(true);
      onEnd?.();
      return 'ENDED';
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`;
  }, [endTime, onEnd]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="font-mono">
      {isEnded ? (
        <span className="text-red-600 font-semibold">Auction Ended</span>
      ) : (
        <span>Time Left: {timeLeft}</span>
      )}
    </div>
  );
};

export default Countdown; 