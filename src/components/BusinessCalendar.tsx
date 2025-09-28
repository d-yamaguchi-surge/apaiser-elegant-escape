import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect } from 'react';
import { format, isToday, getDay, addDays, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useBusinessDays } from '@/modules/businessDays/hooks/useBusinessDays';

const BusinessCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [businessDays, setBusinessDays] = useState<Set<string>>(new Set());
  const { loading, isBusinessDay: checkBusinessDay } = useBusinessDays();

  // Load business day data
  useEffect(() => {
    const loadBusinessDays = async () => {
      if (loading) return;
      
      const today = new Date();
      const businessDaySet = new Set<string>();
      
      // Check next 3 months
      for (let i = 0; i < 90; i++) {
        const checkDate = addDays(today, i);
        const isOpen = await checkBusinessDay(checkDate);
        if (isOpen) {
          businessDaySet.add(format(checkDate, 'yyyy-MM-dd'));
        }
      }
      setBusinessDays(businessDaySet);
    };

    loadBusinessDays();
  }, [checkBusinessDay, loading]);

  // Check if a date is a business day
  const isBusinessDaySync = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return businessDays.has(dateString);
  };

  const getBusinessHours = (date: Date | undefined) => {
    if (!date) return '';
    
    if (!isBusinessDaySync(date)) {
      return '休業日';
    }
    
    const day = getDay(date);
    if (day === 0 || day === 6) { // Sunday or Saturday
      return 'ランチ 11:30-15:00 / ディナー 17:30-21:00';
    }
    
    return 'ランチ 11:30-15:00 / ディナー 17:30-22:00';
  };

  const modifiers = {
    business: (date: Date) => isBusinessDaySync(date),
    closed: (date: Date) => !isBusinessDaySync(date),
    today: (date: Date) => isToday(date),
    selected: (date: Date) => selectedDate ? format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') : false
  };

  const modifiersStyles = {
    business: {
      backgroundColor: 'hsl(var(--gold) / 0.1)',
      border: '1px solid hsl(var(--gold) / 0.5)',
      color: 'hsl(var(--foreground))',
    },
    closed: {
      color: 'hsl(var(--muted-foreground))',
      textDecoration: 'line-through',
      backgroundColor: 'hsl(var(--muted))'
    },
    today: {
      backgroundColor: 'hsl(142, 76%, 36%)', // 緑背景
      color: 'white',
      fontWeight: 'bold'
    },
    selected: {
      backgroundColor: 'hsl(var(--gold))', // 濃いオレンジ背景
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
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    <span>本日</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gold rounded"></div>
                    <span>選択中の日付</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gold/10 border border-gold/50 rounded"></div>
                    <span>営業日</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span>休業日</span>
                  </div>
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