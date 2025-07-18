import { supabase } from '../lib/supabase';
import { authService } from './authService';

export interface Pickup {
  id: string;
  user_id: string;
  date: string;
  time: string;
  address: string;
  scrap_types: string;
  estimated_weight: number;
  remarks: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface CreatePickupData {
  date: string;
  time: string;
  address: string;
  scrap_types: string;
  estimated_weight: number;
  remarks?: string;
}

class PickupService {
  // Create a new pickup
  async createPickup(data: CreatePickupData): Promise<{ success: boolean; pickup?: Pickup; message: string }> {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        return {
          success: false,
          message: 'User not authenticated'
        };
      }

      // Set user context for RLS
      await supabase.rpc('set_config', {
        setting_name: 'app.current_user_phone',
        setting_value: user.phone,
        is_local: false
      });

      const { data: pickup, error } = await supabase
        .from('pickups')
        .insert({
          user_id: user.id,
          ...data,
          estimated_weight: Number(data.estimated_weight)
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        pickup,
        message: 'Pickup scheduled successfully'
      };
    } catch (error) {
      console.error('Create pickup error:', error);
      return {
        success: false,
        message: 'Failed to schedule pickup'
      };
    }
  }

  // Get user's pickups
  async getUserPickups(): Promise<{ success: boolean; pickups?: Pickup[]; message: string }> {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        return {
          success: false,
          message: 'User not authenticated'
        };
      }

      // Set user context for RLS
      await supabase.rpc('set_config', {
        setting_name: 'app.current_user_phone',
        setting_value: user.phone,
        is_local: false
      });

      const { data: pickups, error } = await supabase
        .from('pickups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        pickups: pickups || [],
        message: 'Pickups retrieved successfully'
      };
    } catch (error) {
      console.error('Get pickups error:', error);
      return {
        success: false,
        message: 'Failed to retrieve pickups'
      };
    }
  }

  // Update pickup status
  async updatePickupStatus(pickupId: string, status: 'scheduled' | 'cancelled' | 'completed'): Promise<{ success: boolean; message: string }> {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        return {
          success: false,
          message: 'User not authenticated'
        };
      }

      // Set user context for RLS
      await supabase.rpc('set_config', {
        setting_name: 'app.current_user_phone',
        setting_value: user.phone,
        is_local: false
      });

      const { error } = await supabase
        .from('pickups')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', pickupId);

      if (error) throw error;

      return {
        success: true,
        message: 'Pickup status updated successfully'
      };
    } catch (error) {
      console.error('Update pickup status error:', error);
      return {
        success: false,
        message: 'Failed to update pickup status'
      };
    }
  }
}

export const pickupService = new PickupService();