import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RecurringClosedDay {
  id: string;
  day_of_week: number;
  reason?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PeriodClosure {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useBusinessDays = () => {
  const [recurringClosedDays, setRecurringClosedDays] = useState<RecurringClosedDay[]>([]);
  const [periodClosures, setPeriodClosures] = useState<PeriodClosure[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [recurringResponse, periodResponse] = await Promise.all([
        supabase
          .from('recurring_closed_days')
          .select('*')
          .order('day_of_week', { ascending: true }),
        supabase
          .from('period_closures')
          .select('*')
          .order('start_date', { ascending: true })
      ]);

      if (recurringResponse.error) throw recurringResponse.error;
      if (periodResponse.error) throw periodResponse.error;

      setRecurringClosedDays(recurringResponse.data || []);
      setPeriodClosures(periodResponse.data || []);
    } catch (error) {
      console.error('Error fetching business days data:', error);
      toast({
        title: 'エラー',
        description: '営業日データの取得に失敗しました。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addRecurringClosedDay = async (data: Omit<RecurringClosedDay, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('recurring_closed_days')
        .insert([data]);

      if (error) throw error;
      
      await fetchData();
    } catch (error) {
      console.error('Error adding recurring closed day:', error);
      toast({
        title: 'エラー',
        description: '定休日の追加に失敗しました。',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateRecurringClosedDay = async (id: string, updates: Partial<RecurringClosedDay>) => {
    try {
      const { error } = await supabase
        .from('recurring_closed_days')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchData();
    } catch (error) {
      console.error('Error updating recurring closed day:', error);
      toast({
        title: 'エラー',
        description: '定休日の更新に失敗しました。',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteRecurringClosedDay = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recurring_closed_days')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchData();
    } catch (error) {
      console.error('Error deleting recurring closed day:', error);
      toast({
        title: 'エラー',
        description: '定休日の削除に失敗しました。',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const addPeriodClosure = async (data: Omit<PeriodClosure, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('period_closures')
        .insert([data]);

      if (error) throw error;
      
      await fetchData();
    } catch (error) {
      console.error('Error adding period closure:', error);
      toast({
        title: 'エラー',
        description: '期間休業の追加に失敗しました。',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updatePeriodClosure = async (id: string, updates: Partial<PeriodClosure>) => {
    try {
      const { error } = await supabase
        .from('period_closures')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchData();
    } catch (error) {
      console.error('Error updating period closure:', error);
      toast({
        title: 'エラー',
        description: '期間休業の更新に失敗しました。',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deletePeriodClosure = async (id: string) => {
    try {
      const { error } = await supabase
        .from('period_closures')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchData();
    } catch (error) {
      console.error('Error deleting period closure:', error);
      toast({
        title: 'エラー',
        description: '期間休業の削除に失敗しました。',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // 営業日判定
  const isBusinessDay = async (date: Date): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_business_day', {
        check_date: date.toISOString().split('T')[0]
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking business day:', error);
      return false;
    }
  };

  // 予約可能日判定
  const isReservationAvailable = async (date: Date): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_reservation_available', {
        check_date: date.toISOString().split('T')[0]
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking reservation availability:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    recurringClosedDays,
    periodClosures,
    loading,
    addRecurringClosedDay,
    updateRecurringClosedDay,
    deleteRecurringClosedDay,
    addPeriodClosure,
    updatePeriodClosure,
    deletePeriodClosure,
    isBusinessDay,
    isReservationAvailable,
    refetch: fetchData,
  };
};