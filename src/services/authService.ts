import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
}

class AuthService {
  private currentUser: User | null = null;
  private otpStore: { [phone: string]: { otp: string; timestamp: number } } = {};

  // Simulate OTP sending (in real app, this would integrate with SMS service)
  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random 4-digit OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Store OTP with timestamp (expires in 5 minutes)
      this.otpStore[phone] = {
        otp,
        timestamp: Date.now()
      };
      
      // In a real application, you would integrate with an SMS service like Twilio
      console.log(`OTP sent to ${phone}: ${otp}`);
      
      return {
        success: true,
        message: `OTP sent successfully to ${phone}`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send OTP'
      };
    }
  }

  // Verify OTP and authenticate user
  async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      // Check if OTP exists and is not expired (5 minutes)
      const storedOTP = this.otpStore[phone];
      if (!storedOTP) {
        return {
          success: false,
          message: 'OTP not found. Please request a new one.'
        };
      }
      
      // Check if OTP is expired (5 minutes = 300000 ms)
      if (Date.now() - storedOTP.timestamp > 300000) {
        delete this.otpStore[phone];
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.'
        };
      }
      
      // Verify OTP
      if (otp !== storedOTP.otp) {
        return {
          success: false,
          message: 'Invalid OTP. Please try again.'
        };
      }
      
      // Clear used OTP
      delete this.otpStore[phone];

      // Set user context for RLS
      await supabase.rpc('set_config', {
        setting_name: 'app.current_user_phone',
        setting_value: phone,
        is_local: false
      });

      // Check if user exists, if not create one
      let { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!existingUser) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({ phone })
          .select()
          .single();

        if (insertError) throw insertError;
        existingUser = newUser;
      }

      this.currentUser = existingUser;
      localStorage.setItem('sustainify_user', JSON.stringify(existingUser));

      return {
        success: true,
        user: existingUser,
        message: 'Authentication successful'
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: 'Authentication failed'
      };
    }
  }

  // Get current authenticated user
  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('sustainify_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; message: string }> {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Update local user data
      this.currentUser = { ...user, ...updates };
      localStorage.setItem('sustainify_user', JSON.stringify(this.currentUser));

      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Failed to update profile'
      };
    }
  }

  // Logout user
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('sustainify_user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();