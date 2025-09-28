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

export interface ReservationFilters {
  year?: number;
  month?: number;
  day?: number;
  status?: 'pending' | 'approved' | 'cancelled';
}

export interface ReservationStats {
  todayCount: number;
  thisWeekCount: number;
  thisMonthCount: number;
  pendingCount: number;
}

export const useReservations = (filters?: ReservationFilters) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservationCounts, setReservationCounts] = useState<Record<string, number>>({});
  const [stats, setStats] = useState<ReservationStats>({
    todayCount: 0,
    thisWeekCount: 0,
    thisMonthCount: 0,
    pendingCount: 0,
  });
  const { toast } = useToast();

  const fetchReservations = async () => {
    try {
      let query = supabase
        .from('reservations')
        .select('*');

      // Apply filters
      if (filters?.year || filters?.month || filters?.day) {
        const dateFilter = getDateFilter(filters);
        if (dateFilter) {
          if (filters.day) {
            query = query.eq('reservation_date', dateFilter);
          } else if (filters.month) {
            const startDate = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`;
            const endDate = new Date(filters.year!, filters.month!, 0).toISOString().split('T')[0];
            query = query.gte('reservation_date', startDate).lte('reservation_date', endDate);
          } else if (filters.year) {
            query = query.gte('reservation_date', `${filters.year}-01-01`).lte('reservation_date', `${filters.year}-12-31`);
          }
        }
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      // Sort by date, time, then status
      query = query
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true })
        .order('status', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      setReservations(data || []);
      
      // Calculate stats using all reservations (for dashboard stats)
      if (!filters?.year && !filters?.month && !filters?.day && !filters?.status) {
        calculateStats(data || []);
      }
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

  const fetchStatsOnly = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*');

      if (error) throw error;
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getDateFilter = (filters: ReservationFilters) => {
    if (filters.day && filters.month && filters.year) {
      return `${filters.year}-${String(filters.month).padStart(2, '0')}-${String(filters.day).padStart(2, '0')}`;
    }
    return null;
  };

  const calculateStats = (allReservations: Reservation[]) => {
    const today = new Date().toISOString().split('T')[0];
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfWeekString = startOfWeek.toISOString().split('T')[0];
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const startOfMonthString = startOfMonth.toISOString().split('T')[0];

    const todayReservations = allReservations.filter(r => 
      r.reservation_date === today && r.status !== 'cancelled'
    );
    
    const thisWeekReservations = allReservations.filter(r => 
      r.reservation_date >= startOfWeekString && r.status !== 'cancelled'
    );
    
    const thisMonthReservations = allReservations.filter(r => 
      r.reservation_date >= startOfMonthString && r.status !== 'cancelled'
    );

    const pendingReservations = allReservations.filter(r => r.status === 'pending');

    setStats({
      todayCount: todayReservations.length,
      thisWeekCount: thisWeekReservations.length,
      thisMonthCount: thisMonthReservations.length,
      pendingCount: pendingReservations.length,
    });
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

  const addReservation = async (reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .insert([reservation]);

      if (error) throw error;
      
      await fetchReservations();
      toast({
        title: '成功',
        description: '予約を追加しました。',
      });
    } catch (error) {
      console.error('Error adding reservation:', error);
      toast({
        title: 'エラー',  
        description: '予約の追加に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const getTodayApprovedReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    return reservations
      .filter(r => r.reservation_date === today && r.status === 'approved')
      .sort((a, b) => a.reservation_time.localeCompare(b.reservation_time));
  };

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      fetchReservations();
    } else {
      fetchReservations();
    }
  }, [filters?.year, filters?.month, filters?.day, filters?.status]);

  return {
    reservations,
    loading,
    reservationCounts,
    stats,
    updateReservationStatus,
    deleteReservation,
    addReservation,
    refetch: fetchReservations,
    fetchAvailabilityData,
    fetchStatsOnly,
    getTodayApprovedReservations,
  };
};