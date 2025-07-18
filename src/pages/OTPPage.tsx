import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { verifyOTP } from '../services/authService';
import { saveUserToDatabase } from '../services/userService';

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerifyOTP = async () => {
    try {
      const user = await verifyOTP(otp);
      await saveUserToDatabase({
        uid: user.uid,
        phoneNumber: user.phoneNumber,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Enter OTP</h2>
        <div>
          <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-700">
            OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter the OTP"
          />
        </div>
        <div>
          <button
            onClick={handleVerifyOTP}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
