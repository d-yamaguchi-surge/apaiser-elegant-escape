import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ReservationFilters as FilterType } from '@/modules/reservation/hooks/useReservations';

interface ReservationFiltersProps {
  onFiltersChange: (filters: FilterType) => void;
  currentFilters: FilterType;
}

export const ReservationFilters = ({ onFiltersChange, currentFilters }: ReservationFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterType>(currentFilters);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i - 1);
  const months = [
    { value: 1, label: '1月' },
    { value: 2, label: '2月' },
    { value: 3, label: '3月' },
    { value: 4, label: '4月' },
    { value: 5, label: '5月' },
    { value: 6, label: '6月' },
    { value: 7, label: '7月' },
    { value: 8, label: '8月' },
    { value: 9, label: '9月' },
    { value: 10, label: '10月' },
    { value: 11, label: '11月' },
    { value: 12, label: '12月' },
  ];

  const getDaysInMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const handleFilterChange = (key: keyof FilterType, value: any) => {
    const newFilters = { ...localFilters, [key]: value === 'all' ? undefined : value };
    
    // Reset day if month or year changes
    if (key === 'year' || key === 'month') {
      newFilters.day = undefined;
    }
    
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Select 
            value={localFilters.year?.toString() || 'all'} 
            onValueChange={(value) => handleFilterChange('year', value === 'all' ? undefined : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="年を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全ての年</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}年</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={localFilters.month?.toString() || 'all'} 
            onValueChange={(value) => handleFilterChange('month', value === 'all' ? undefined : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="月を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全ての月</SelectItem>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={localFilters.day?.toString() || 'all'} 
            onValueChange={(value) => handleFilterChange('day', value === 'all' ? undefined : parseInt(value))}
            disabled={!localFilters.year || !localFilters.month}
          >
            <SelectTrigger>
              <SelectValue placeholder="日を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全ての日</SelectItem>
              {localFilters.year && localFilters.month && 
                getDaysInMonth(localFilters.year, localFilters.month).map(day => (
                  <SelectItem key={day} value={day.toString()}>{day}日</SelectItem>
                ))
              }
            </SelectContent>
          </Select>

          <Select 
            value={localFilters.status || 'all'} 
            onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全てのステータス</SelectItem>
              <SelectItem value="pending">未承認</SelectItem>
              <SelectItem value="approved">承認済み</SelectItem>
              <SelectItem value="cancelled">キャンセル</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={applyFilters} variant="default">
            適用
          </Button>

          <Button onClick={clearFilters} variant="outline">
            クリア
          </Button>
      </div>
    </div>
  );
};