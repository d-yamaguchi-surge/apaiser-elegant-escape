import { useState, useEffect } from "react";
import { format, isBefore, startOfDay, addDays } from "date-fns";
import { useReservations } from "@/modules/reservation/hooks/useReservations";
import { useBlockedDates } from "@/modules/blockedDates/hooks/useBlockedDates";
import { useBusinessDays } from "@/modules/businessDays/hooks/useBusinessDays";

export const useReservationAvailability = () => {
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const {
    fetchAvailabilityData,
    loading: reservationLoading,
  } = useReservations();
  const { blockedDates, loading: blockedLoading } = useBlockedDates();
  const {
    loading: businessLoading,
    isReservationAvailable,
  } = useBusinessDays();

  const loading = reservationLoading || blockedLoading || businessLoading;

  // Load availability data
  useEffect(() => {
    const loadAvailabilityData = async () => {
      if (loading) return;

      const today = new Date();
      const twoMonthsLater = new Date(
        today.getFullYear(),
        today.getMonth() + 2,
        today.getDate()
      );

      // Fetch reservation data first
      await fetchAvailabilityData(
        format(today, "yyyy-MM-dd"),
        format(twoMonthsLater, "yyyy-MM-dd")
      );

      // Check availability for each date in the next 2 months
      const available = new Set<string>();
      for (let i = 0; i < 90; i++) {
        const checkDate = addDays(today, i);
        try {
          const isAvailable = await isReservationAvailable(checkDate);
          if (isAvailable) {
            available.add(format(checkDate, "yyyy-MM-dd"));
          }
        } catch (error) {
          console.error(
            `Error checking availability for ${format(
              checkDate,
              "yyyy-MM-dd"
            )}:`,
            error
          );
        }
      }
      setAvailableDates(available);
    };

    loadAvailabilityData();
  }, [loading]);

  // Check if a date is blocked by admin
  const isDateBlocked = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return blockedDates.some((bd) => bd.blocked_date === dateString);
  };

  // Get blocked date reason
  const getBlockedReason = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const blockedDate = blockedDates.find(
      (bd) => bd.blocked_date === dateString
    );
    return blockedDate?.reason;
  };

  // Check if a date is available for reservation
  const isAvailableForReservation = (date: Date) => {
    const today = startOfDay(new Date());

    // Not available if in the past
    if (isBefore(date, today)) {
      return false;
    }

    // Check if date is in the available dates set
    const dateString = format(date, "yyyy-MM-dd");
    return availableDates.has(dateString);
  };

  return {
    availableDates,
    loading,
    isDateBlocked,
    getBlockedReason,
    isAvailableForReservation,
  };
};
