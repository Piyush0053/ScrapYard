import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, sendOTP, setupRecaptcha } from '../services/authService';
import { saveUserToDatabase } from '../services/userService';

const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setupRecaptcha('recaptcha-container');
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      await saveUserToDatabase({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error with Google Sign-In:', error);
    }
  };

  const handlePhoneSignIn = async () => {
    try {
      await sendOTP('+91' + phoneNumber); // Assuming Indian phone numbers
      navigate('/otp');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Sign in with Google
          </button>
        </div>
        <div className="flex items-center justify-center">
          <hr className="w-full" />
          <span className="px-2 font-bold text-gray-500">OR</span>
          <hr className="w-full" />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <button
            onClick={handlePhoneSignIn}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Send OTP
          </button>
        </div>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default LoginPage;
