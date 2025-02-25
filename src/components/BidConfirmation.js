import React from 'react';
import Modal from './common/Modal';

const BidConfirmation = ({ isOpen, onClose, bidAmount, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Your Bid"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          You are about to place a bid for:
        </p>
        <p className="text-2xl font-bold text-blue-600">
          ${bidAmount}
        </p>
        <p className="text-sm text-gray-500">
          This action cannot be undone. Your bid will be sealed until the auction ends.
        </p>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirm Bid
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BidConfirmation; 