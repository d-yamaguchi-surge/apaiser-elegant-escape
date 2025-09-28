import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import React from 'react';
import { format, isToday, getDay, isBefore, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useReservations } from '@/modules/reservation/hooks/useReservations';
import { useBlockedDates } from '@/modules/blockedDates/hooks/useBlockedDates';

const ReservationCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const navigate = useNavigate();
  const { reservationCounts, fetchAvailabilityData } = useReservations();
  const { blockedDates } = useBlockedDates();

  // Load availability data when component mounts
  React.useEffect(() => {
    const today = new Date();
    const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
    
    fetchAvailabilityData(
      format(today, 'yyyy-MM-dd'),
      format(twoMonthsLater, 'yyyy-MM-dd')
    );
  }, [fetchAvailabilityData]);

  // Check if a date is blocked by admin
  const isDateBlocked = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return blockedDates.some(bd => bd.blocked_date === dateString);
  };

  // Get blocked date reason
  const getBlockedReason = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const blockedDate = blockedDates.find(bd => bd.blocked_date === dateString);
    return blockedDate?.reason;
  };

  // Check if a date is available for reservation
  const isAvailableForReservation = (date: Date) => {
    const day = getDay(date);
    const today = startOfDay(new Date());
    
    // Not available if it's Tuesday (closed day) or in the past
    if (day === 2 || isBefore(date, today)) {
      return false;
    }

    // Not available if blocked by admin
    if (isDateBlocked(date)) {
      return false;
    }
    
    // Check if date has too many reservations (max 8 per day)
    const dateString = format(date, 'yyyy-MM-dd');
    const reservationCount = reservationCounts[dateString] || 0;
    
    // If 8 or more reservations, consider it full
    if (reservationCount >= 8) {
      return false;
    }
    
    return true;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isAvailableForReservation(date)) {
      setSelectedDate(date);
    }
  };

  const handleReservation = () => {
    if (selectedDate) {
      navigate(`/reservation?date=${format(selectedDate, 'yyyy-MM-dd')}`);
    }
  };

  const modifiers = {
    available: (date: Date) => isAvailableForReservation(date),
    unavailable: (date: Date) => !isAvailableForReservation(date),
    blocked: (date: Date) => isDateBlocked(date),
    selected: (date: Date) => selectedDate ? format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') : false,
    today: (date: Date) => isToday(date)
  };

  const modifiersStyles = {
    available: {
      backgroundColor: 'hsl(var(--card))',
      color: 'hsl(var(--foreground))',
      border: '1px solid hsl(var(--gold) / 0.3)',
    },
    unavailable: {
      color: 'hsl(var(--muted-foreground))',
      backgroundColor: 'hsl(var(--muted))',
      textDecoration: 'line-through',
      cursor: 'not-allowed'
    },
    blocked: {
      color: 'hsl(var(--destructive-foreground))',
      backgroundColor: 'hsl(var(--destructive) / 0.1)',
      border: '1px solid hsl(var(--destructive))',
      textDecoration: 'line-through',
      cursor: 'not-allowed'
    },
    selected: {
      backgroundColor: 'hsl(var(--gold))',
      color: 'white',
      fontWeight: 'bold'
    },
    today: {
      border: '2px solid hsl(var(--gold))',
      fontWeight: 'bold'
    }
  };

  return (
    <section id="reservation" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Reservation
          </h2>
          <div className="w-24 h-px bg-gradient-gold mx-auto mb-8"></div>
          <p className="font-noto text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            特別な時間をお過ごしいただくため<br />
            事前のご予約をおすすめしております
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calendar */}
          <Card className="border-gold/20 shadow-elegant bg-card">
            <CardHeader>
              <CardTitle className="font-noto text-xl font-bold text-foreground text-center">
                ご予約日を選択
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={ja}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border-gold/20"
                disabled={(date) => !isAvailableForReservation(date)}
              />
            </CardContent>
          </Card>

          {/* Reservation Details */}
          <div className="space-y-6">
            <Card className="border-gold/20 shadow-elegant bg-card">
              <CardHeader>
                <CardTitle className="font-noto text-xl font-bold text-foreground text-center">
                  選択された日付
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {selectedDate ? (
                  <>
                    <p className="font-playfair text-2xl font-bold text-gold mb-4">
                      {format(selectedDate, 'yyyy年M月d日 (EEEE)', { locale: ja })}
                    </p>
                    <div className="space-y-2 mb-6">
                      <p className="font-noto text-sm text-muted-foreground">営業時間</p>
                      <p className="font-noto text-foreground">
                        ランチ 11:30-15:00<br />
                        ディナー 17:30-22:00
                      </p>
                    </div>
                    <Button 
                      onClick={handleReservation}
                      variant="gold"
                      className="w-full py-3"
                    >
                      この日に予約する
                    </Button>
                  </>
                ) : (
                  <p className="font-noto text-muted-foreground">
                    カレンダーからご希望の日付を選択してください
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Legend & Info */}
            <Card className="border-gold/20 shadow-elegant bg-card">
              <CardContent className="p-6">
                <h3 className="font-noto text-lg font-bold text-foreground mb-4 text-center">
                  予約可能日について
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground font-noto">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-gold rounded"></div>
                    <span>本日</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gold rounded"></div>
                    <span>選択中の日付</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span>予約不可（火曜定休・過去の日付）</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-destructive/10 border border-destructive rounded"></div>
                    <span>予約不可日（管理者設定）</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gold/20 space-y-2 text-xs text-muted-foreground">
                  <p>• 当日のご予約はお電話にてお願いいたします</p>
                  <p>• 火曜日は定休日のため予約できません</p>
                  <p>• 赤枠の日付は管理者により予約不可に設定されています</p>
                </div>
              </CardContent>
            </Card>

            {/* Phone Reservation */}
            <Card className="border-gold/20 shadow-elegant bg-card">
              <CardContent className="p-6 text-center">
                <h3 className="font-noto text-lg font-bold text-foreground mb-4">
                  お電話でのご予約
                </h3>
                <p className="font-playfair text-2xl font-bold text-gold mb-2">
                  075-123-4567
                </p>
                <p className="font-noto text-sm text-muted-foreground">
                  営業時間内にお電話ください
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationCalendar;