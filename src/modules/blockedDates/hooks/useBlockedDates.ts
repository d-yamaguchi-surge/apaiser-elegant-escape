import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlockedDate {
  id: string;
  blocked_date: string;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export const useBlockedDates = () => {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBlockedDates = async () => {
    try {
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('blocked_date', { ascending: true });

      if (error) throw error;
      setBlockedDates(data || []);
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
      toast({
        title: 'エラー',
        description: '予約不可日の取得に失敗しました。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addBlockedDate = async (blockedDate: Omit<BlockedDate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('blocked_dates')
        .insert([blockedDate]);

      if (error) throw error;
      
      await fetchBlockedDates();
    } catch (error) {
      console.error('Error adding blocked date:', error);
      toast({
        title: 'エラー',
        description: '予約不可日の追加に失敗しました。',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteBlockedDate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchBlockedDates();
    } catch (error) {
      console.error('Error deleting blocked date:', error);
      toast({
        title: 'エラー',
        description: '予約不可日の削除に失敗しました。',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  return {
    blockedDates,
    loading,
    addBlockedDate,
    deleteBlockedDate,
    refetch: fetchBlockedDates,
  };
};