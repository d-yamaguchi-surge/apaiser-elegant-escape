import { useState, useEffect } from "react";
import { format, isBefore, startOfDay, addDays } from "date-fns";
import { useReservations } from "@/modules/reservation/hooks/useReservations";
import { useBlockedDates } from "@/modules/blockedDates/hooks/useBlockedDates";
import { useBusinessDays } from "@/modules/businessDays/hooks/useBusinessDays";

/** ローカル日付を "yyyy-MM-dd" に変換（タイムゾーン補正なし） */
const toLocalDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** Supabase の DATE カラムは補正不要。timestamp の場合も日付部分だけ使用 */
const normalizeDateString = (value: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return value.split("T")[0];
};

export const useReservationAvailability = () => {
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const { fetchAvailabilityData, loading: reservationLoading } = useReservations();
  const { blockedDates, loading: blockedLoading } = useBlockedDates();
  const { loading: businessLoading, isReservationAvailable } = useBusinessDays();

  const loading = reservationLoading || blockedLoading || businessLoading;

  useEffect(() => {
    const loadAvailabilityData = async () => {
      if (loading) return;

      const today = new Date();
      const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

      await fetchAvailabilityData(
        toLocalDateString(today),
        toLocalDateString(twoMonthsLater)
      );

      const available = new Set<string>();
      for (let i = 0; i < 90; i++) {
        const checkDate = addDays(today, i);
        try {
          const isAvailable = await isReservationAvailable(checkDate);
          if (isAvailable) {
            available.add(toLocalDateString(checkDate));
          }
        } catch (error) {
          console.error(`Error checking availability for ${toLocalDateString(checkDate)}:`, error);
        }
      }
      setAvailableDates(available);
    };

    loadAvailabilityData();
  }, [loading]);

  /** 予約不可日チェック */
  const isDateBlocked = (date: Date) => {
    const dateString = toLocalDateString(date);
    return blockedDates.some((bd) => normalizeDateString(bd.blocked_date) === dateString);
  };

  /** 予約不可理由取得 */
  const getBlockedReason = (date: Date) => {
    const dateString = toLocalDateString(date);
    const blockedDate = blockedDates.find(
      (bd) => normalizeDateString(bd.blocked_date) === dateString
    );
    return blockedDate?.reason;
  };

  /** 予約可否判定 */
  const isAvailableForReservation = (date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return false;

    const dateString = toLocalDateString(date);
    return availableDates.has(dateString) && !isDateBlocked(date);
  };

  return {
    availableDates,
    loading,
    isDateBlocked,
    getBlockedReason,
    isAvailableForReservation,
  };
};