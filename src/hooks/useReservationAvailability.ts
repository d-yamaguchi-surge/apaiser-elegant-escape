import { useState, useEffect } from "react";
import { isBefore, startOfDay, addDays } from "date-fns";
import { useReservations } from "@/modules/reservation/hooks/useReservations";
import { useBlockedDates } from "@/modules/blockedDates/hooks/useBlockedDates";
import { useBusinessDays } from "@/modules/businessDays/hooks/useBusinessDays";

/** ✅ JSTローカル日付を正しく文字列化する */
const toLocalDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** ✅ SupabaseのUTC→JST変換 */
const toJstString = (utcDateString: string): string => {
  // "2025-11-08" または "2025-11-08T00:00:00Z" の両方を安全に処理
  const utc = new Date(`${utcDateString}T00:00:00Z`);
  const jst = new Date(utc.getTime() + 9 * 60 * 60 * 1000);
  return toLocalDateString(jst);
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
            available.add(toLocalDateString(checkDate)); // ✅ format() ではなく toLocalDateString()
          }
        } catch (error) {
          console.error(`Error checking availability for ${toLocalDateString(checkDate)}:`, error);
        }
      }
      setAvailableDates(available);
    };

    loadAvailabilityData();
  }, [loading]);

  /** ✅ 予約不可日チェック（UTC→JST補正） */
  const isDateBlocked = (date: Date) => {
    const dateString = toLocalDateString(date);
    return blockedDates.some((bd) => toJstString(bd.blocked_date) === dateString);
  };

  /** ✅ 予約不可理由取得（UTC→JST補正） */
  const getBlockedReason = (date: Date) => {
    const dateString = toLocalDateString(date);
    const blockedDate = blockedDates.find(
      (bd) => toJstString(bd.blocked_date) === dateString
    );
    return blockedDate?.reason;
  };

  /** ✅ 予約可否判定（ズレ防止済） */
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