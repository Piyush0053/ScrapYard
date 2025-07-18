import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const auth = getAuth();

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any; // Type for Firebase ConfirmationResult
  }
}

// Phone Number Authentication
export const setupRecaptcha = (elementId: string) => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    'size': 'invisible',
    'callback': (response: any) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      // onSignInSubmit();
    }
  });
};

export const sendOTP = async (phoneNumber: string) => {
  try {
    const appVerifier = window.recaptchaVerifier;
    window.confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (otp: string) => {
  try {
    const result = await window.confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error with Google Sign-In:", error);
    throw error;
  }
};
