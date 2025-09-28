import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReservations, Reservation } from '@/modules/reservation/hooks/useReservations';
import { Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';

const statusConfig = {
  pending: { label: '承認待ち', icon: Clock, variant: 'secondary' as const },
  approved: { label: '承認済み', icon: CheckCircle, variant: 'default' as const },
  cancelled: { label: 'キャンセル', icon: XCircle, variant: 'destructive' as const },
};

export default function AdminReservations() {
  const { reservations, loading, updateReservationStatus, deleteReservation } = useReservations();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: 'pending' | 'approved' | 'cancelled') => {
    await updateReservationStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    await deleteReservation(id);
    setDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:MM format
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader title="予約管理" description="レストランの予約を管理" />
      
      <div className="grid gap-4">
        {reservations.map((reservation) => {
          const status = statusConfig[reservation.status];
          const StatusIcon = status.icon;
          
          return (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {reservation.customer_name}
                      <Badge variant={status.variant}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatDate(reservation.reservation_date)} {formatTime(reservation.reservation_time)} | {reservation.party_size}名
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={reservation.status}
                      onValueChange={(value) => handleStatusChange(reservation.id, value as any)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">承認待ち</SelectItem>
                        <SelectItem value="approved">承認済み</SelectItem>
                        <SelectItem value="cancelled">キャンセル</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setDeleteConfirm(reservation.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div>
                    <span className="font-medium">メール:</span> {reservation.customer_email}
                  </div>
                  {reservation.customer_phone && (
                    <div>
                      <span className="font-medium">電話:</span> {reservation.customer_phone}
                    </div>
                  )}
                  {reservation.special_requests && (
                    <div>
                      <span className="font-medium">特別なご要望:</span>
                      <p className="mt-1 text-muted-foreground">{reservation.special_requests}</p>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground pt-2">
                    予約日時: {new Date(reservation.created_at).toLocaleString('ja-JP')}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {reservations.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">予約がありません。</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
        title="予約を削除"
        description="この予約を削除してもよろしいですか？この操作は取り消せません。"
        confirmText="削除"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        variant="destructive"
      />
    </AdminLayout>
  );
}