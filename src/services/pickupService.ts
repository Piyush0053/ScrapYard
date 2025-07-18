import { authService } from './authService';
import { 
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase'; // Assuming you have a firebase config file

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
  created_at: Timestamp;
  updated_at: Timestamp;
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
  private pickupsCollection = collection(db, 'pickups');

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

      const docRef = await addDoc(this.pickupsCollection, {
        user_id: user.uid,
        ...data,
        estimated_weight: Number(data.estimated_weight),
        status: 'scheduled',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      const pickup: Pickup = {
        id: docRef.id,
        user_id: user.uid,
        ...data,
        status: 'scheduled',
        created_at: Timestamp.now(), 
        updated_at: Timestamp.now()
      };
      
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

      const q = query(this.pickupsCollection, where('user_id', '==', user.uid), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const pickups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pickup));

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

      const pickupDoc = doc(this.pickupsCollection, pickupId);
      await updateDoc(pickupDoc, {
        status,
        updated_at: serverTimestamp()
      });

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