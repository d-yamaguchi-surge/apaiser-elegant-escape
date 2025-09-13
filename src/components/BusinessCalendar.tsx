import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { format, isToday, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';

const BusinessCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Check if a date is a business day (closed on Tuesdays - day 2)
  const isBusinessDay = (date: Date) => {
    const day = getDay(date);
    return day !== 2; // Tuesday is 2
  };

  const getBusinessHours = (date: Date | undefined) => {
    if (!date) return '';
    
    if (!isBusinessDay(date)) {
      return '休業日';
    }
    
    const day = getDay(date);
    if (day === 0 || day === 6) { // Sunday or Saturday
      return 'ランチ 11:30-15:00 / ディナー 17:30-21:00';
    }
    
    return 'ランチ 11:30-15:00 / ディナー 17:30-22:00';
  };

  const modifiers = {
    business: (date: Date) => isBusinessDay(date),
    closed: (date: Date) => !isBusinessDay(date),
    today: (date: Date) => isToday(date)
  };

  const modifiersStyles = {
    business: {
      color: 'hsl(var(--foreground))',
    },
    closed: {
      color: 'hsl(var(--muted-foreground))',
      textDecoration: 'line-through',
      backgroundColor: 'hsl(var(--muted))'
    },
    today: {
      backgroundColor: 'hsl(var(--gold))',
      color: 'white',
      fontWeight: 'bold'
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Business Calendar
          </h2>
          <div className="w-24 h-px bg-gradient-gold mx-auto mb-8"></div>
          <p className="font-noto text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            営業日・営業時間をご確認いただけます
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calendar */}
          <Card className="border-gold/20 shadow-elegant bg-card">
            <CardHeader>
              <CardTitle className="font-noto text-xl font-bold text-foreground text-center">
                営業カレンダー
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ja}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border-gold/20"
              />
            </CardContent>
          </Card>

          {/* Selected Date Info */}
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
                    <p className="font-noto text-lg text-foreground">
                      {getBusinessHours(selectedDate)}
                    </p>
                  </>
                ) : (
                  <p className="font-noto text-muted-foreground">日付を選択してください</p>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="border-gold/20 shadow-elegant bg-card">
              <CardHeader>
                <CardTitle className="font-noto text-lg font-bold text-foreground text-center">
                  カレンダーの見方
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm font-noto">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gold rounded"></div>
                    <span>本日</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span>休業日（火曜日）</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border border-gold rounded"></div>
                    <span>営業日</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gold/20">
                  <p className="text-xs text-muted-foreground">
                    ※祝日や特別休業日は別途お知らせいたします
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessCalendar;