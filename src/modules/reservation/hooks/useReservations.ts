import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: 'pending' | 'approved' | 'cancelled';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservationCounts, setReservationCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: 'エラー',
        description: '予約の取得に失敗しました。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch availability data for calendar (public access via secure function)
  const fetchAvailabilityData = async (startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase.rpc('get_reservation_counts_by_date', {
        start_date: startDate,
        end_date: endDate
      });

      if (error) throw error;
      
      // Convert array to object for easier lookup
      const counts: Record<string, number> = {};
      if (data) {
        data.forEach((item: { reservation_date: string; reservation_count: number }) => {
          counts[item.reservation_date] = item.reservation_count;
        });
      }
      setReservationCounts(counts);
      return counts;
    } catch (error) {
      console.error('Error fetching availability data:', error);
      return {};
    }
  };

  const updateReservationStatus = async (id: string, status: 'pending' | 'approved' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      await fetchReservations();
      toast({
        title: '成功',
        description: '予約ステータスを更新しました。',
      });
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast({
        title: 'エラー',
        description: '予約ステータスの更新に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchReservations();
      toast({
        title: '成功',
        description: '予約を削除しました。',
      });
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast({
        title: 'エラー',
        description: '予約の削除に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    loading,
    reservationCounts,
    updateReservationStatus,
    deleteReservation,
    refetch: fetchReservations,
    fetchAvailabilityData,
  };
};