import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Reservation } from '@/modules/reservation/hooks/useReservations';

// Extend jsPDF to include autoTable method
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
  lastAutoTable?: { finalY: number };
}

export const generateTodayReservationsPDF = (reservations: Reservation[]) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Logo (placeholder - you can add the actual logo later)
  doc.setFontSize(20);
  doc.text('Apaiser Restaurant', 20, 30);
  
  // Title and date
  doc.setFontSize(16);
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`本日の予約一覧 - ${today}`, 20, 50);
  
  // Prepare table data
  const tableData = reservations.map(reservation => [
    reservation.customer_name,
    `${reservation.party_size}名`,
    reservation.reservation_time.slice(0, 5), // HH:MM format
    reservation.customer_phone || '-',
    reservation.customer_email,
    reservation.special_requests || '-'
  ]);
  
  // Generate table
  doc.autoTable({
    head: [['氏名', '人数', '時間', '電話', 'メール', '備考']],
    body: tableData,
    startY: 70,
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 25 }, // 氏名
      1: { cellWidth: 15 }, // 人数
      2: { cellWidth: 20 }, // 時間
      3: { cellWidth: 30 }, // 電話
      4: { cellWidth: 50 }, // メール
      5: { cellWidth: 'auto' }, // 備考
    },
  });
  
  // Calculate total guests
  const totalGuests = reservations.reduce((sum, reservation) => sum + reservation.party_size, 0);
  
  // Add footer with total
  const finalY = doc.lastAutoTable?.finalY || 70;
  doc.setFontSize(12);
  doc.text(`合計：${totalGuests}名`, 20, finalY + 20);
  
  // Save the PDF
  doc.save(`本日の予約一覧_${new Date().toISOString().split('T')[0]}.pdf`);
};