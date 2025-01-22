import React from 'react';

export default function RazorpayButton({ amount }) {
  const handlePayment = () => {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    if (!key) {
      alert('Razorpay key not set.');
      return;
    }

    const options = {
      key,
      amount, // in paise
      currency: 'INR',
      name: 'My Airbnb Clone',
      description: 'Booking Payment',
      handler(response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: 'Guest User',
        email: 'guest@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#F37254'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition font-semibold w-full"
    >
      Pay with Razorpay
    </button>
  );
}
