import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReservationAvailability } from "@/hooks/useReservationAvailability";
import { toLocalDateString } from "@/lib/dateUtils";

const ReservationCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const navigate = useNavigate();
  const { isAvailableForReservation } = useReservationAvailability();

  const handleDateSelect = (date: Date | undefined) => {
    // Only update selectedDate on user click, don't auto-update based on availability
    if (date && isAvailableForReservation(date)) {
      setSelectedDate(date);
    } else if (date && !isAvailableForReservation(date)) {
      // Clear selection if user clicks unavailable date
      setSelectedDate(undefined);
    }
  };

  const handleReservation = () => {
    if (selectedDate) {
      navigate(`/reservation?date=${toLocalDateString(selectedDate)}`);
      window.scrollTo(0, 0);
    }
  };

  const modifiers = {
    unavailable: (date: Date) => !isAvailableForReservation(date),
    selected: (date: Date) =>
      selectedDate
        ? toLocalDateString(date) === toLocalDateString(selectedDate)
        : false,
    today: () => false,
  };

  const modifiersStyles = {
    unavailable: {
      color: "hsl(var(--muted-foreground))",
      backgroundColor: "hsl(var(--muted))",
      textDecoration: "line-through",
      cursor: "not-allowed",
    },
    selected: {
      backgroundColor: "hsl(var(--gold))",
      color: "white",
      fontWeight: "bold",
    },
    today: {
      backgroundColor: "transparent",
      color: "hsl(var(--foreground))",
    },
  };

  return (
    <section
      id="reservation"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Reservation
          </h2>

          <p className="font-noto text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            特別な時間をお過ごしいただくため
            <br />
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
                fromDate={new Date()}
                toDate={
                  new Date(new Date().setMonth(new Date().getMonth() + 3))
                }
                disableNavigation={false}
                components={{
                  IconLeft: ({ ...props }) => (
                    <ChevronLeft className="h-4 w-4" {...props} />
                  ),
                  IconRight: ({ ...props }) => (
                    <ChevronRight className="h-4 w-4" {...props} />
                  ),
                }}
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
                      {format(selectedDate, "yyyy年M月d日 (EEEE)", {
                        locale: ja,
                      })}
                    </p>
                    <div className="space-y-2 mb-6">
                      <p className="font-noto text-sm text-muted-foreground">
                        営業時間
                      </p>
                      <p className="font-noto text-foreground">11:00-22:00</p>
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
                  カレンダーの見方
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground font-noto">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gold rounded"></div>
                    <span>選択中の日付</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span>予約不可</span>
                  </div>
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
                  028-666-6671
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
