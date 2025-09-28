import { useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useReservations } from '@/modules/reservation/hooks/useReservations';
import { generateTodayReservationsPDF } from '@/lib/pdfGenerator';
import { Calendar, Clock, Users, AlertCircle, FileDown } from 'lucide-react';

export default function AdminDashboard() {
  const { stats, loading, fetchStatsOnly, getTodayApprovedReservations } = useReservations();
  const todayReservations = getTodayApprovedReservations();

  useEffect(() => {
    fetchStatsOnly();
  }, []);

  const handleExportPDF = () => {
    generateTodayReservationsPDF(todayReservations);
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:MM format
  };

  if (loading) {
    return (
      <AdminLayout>
        <PageHeader title="ダッシュボード" description="管理画面の概要" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader title="ダッシュボード" description="管理画面の概要" />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本日の予約数</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCount}</div>
            <p className="text-xs text-muted-foreground">
              本日の予約
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今週の予約数</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeekCount}</div>
            <p className="text-xs text-muted-foreground">
              今週の予約
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今月の予約数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthCount}</div>
            <p className="text-xs text-muted-foreground">
              今月の予約
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">未承認予約数</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              承認待ちの予約
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Approved Reservations */}
      {todayReservations.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>本日の承認済み予約一覧</CardTitle>
              <Button onClick={handleExportPDF} variant="outline" size="sm">
                <FileDown className="w-4 h-4 mr-2" />
                PDF出力
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>氏名</TableHead>
                  <TableHead>人数</TableHead>
                  <TableHead>時間</TableHead>
                  <TableHead>電話</TableHead>
                  <TableHead>メール</TableHead>
                  <TableHead>備考</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.customer_name}</TableCell>
                    <TableCell>{reservation.party_size}名</TableCell>
                    <TableCell>{formatTime(reservation.reservation_time)}</TableCell>
                    <TableCell>{reservation.customer_phone || '-'}</TableCell>
                    <TableCell>{reservation.customer_email}</TableCell>
                    <TableCell>{reservation.special_requests || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {todayReservations.length === 0 && (
        <Card className="mt-8">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">本日の承認済み予約はありません。</p>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}