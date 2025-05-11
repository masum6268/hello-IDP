import React, { useState } from 'react';
import axios from 'axios';

const OrderMedicine = ({ prescriptionId }) => {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!deliveryAddress) {
      setError('Delivery address is required.');
      return;
    }

    const userId = localStorage.getItem('userId');

    try {
      const response = await axios.post('/api/orders', {
        userId,
        prescriptionId,
        deliveryAddress,
      });
      setSuccess('Order placed successfully!');
      setDeliveryAddress('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    }
  };

  return (
    <div>
      <h2>Order Medicine</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="deliveryAddress">Delivery Address:</label>
          <textarea
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </div>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderMedicine;