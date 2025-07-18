// import { supabase } from '../lib/supabase';

export interface ScrapRate {
  id: string;
  item_name: string;
  rate_per_kg: number;
  updated_at: string;
}

class ScrapRatesService {
  // Get all scrap rates
  async getScrapRates(): Promise<{ success: boolean; rates?: ScrapRate[]; message: string }> {
    try {
      const { data: rates, error } = await supabase
        .from('scrap_rates')
        .select('*')
        .order('item_name');

      if (error) throw error;

      return {
        success: true,
        rates: rates || [],
        message: 'Scrap rates retrieved successfully'
      };
    } catch (error) {
      console.error('Get scrap rates error:', error);
      return {
        success: false,
        message: 'Failed to retrieve scrap rates'
      };
    }
  }
}

export const scrapRatesService = new ScrapRatesService();