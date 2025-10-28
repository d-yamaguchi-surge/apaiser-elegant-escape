import { Reservation } from '@/modules/reservation/hooks/useReservations';

export const generateTodayReservationsPDF = (reservations: Reservation[]) => {
  // Create a printable HTML document
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('ポップアップがブロックされました。ポップアップを許可してください。');
    return;
  }

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalGuests = reservations.reduce((sum, reservation) => sum + reservation.party_size, 0);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>本日の予約一覧 - ${today}</title>
        <style>
          @media print {
            @page { margin: 2cm; }
            body { margin: 0; }
          }
          body {
            font-family: 'MS Gothic', 'Hiragino Kaku Gothic Pro', sans-serif;
            padding: 20px;
            color: #000;
          }
          h1 {
            font-size: 20px;
            margin-bottom: 10px;
          }
          h2 {
            font-size: 16px;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #ddd;
            font-weight: bold;
          }
          .total {
            margin-top: 20px;
            font-size: 14px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>Apaiser Restaurant</h1>
        <h2>本日の予約一覧 - ${today}</h2>
        <table>
          <thead>
            <tr>
              <th>氏名</th>
              <th>人数</th>
              <th>時間</th>
              <th>電話</th>
              <th>メール</th>
              <th>備考</th>
            </tr>
          </thead>
          <tbody>
            ${reservations.map(reservation => `
              <tr>
                <td>${reservation.customer_name}</td>
                <td>${reservation.party_size}名</td>
                <td>${reservation.reservation_time.slice(0, 5)}</td>
                <td>${reservation.customer_phone || '-'}</td>
                <td>${reservation.customer_email}</td>
                <td>${reservation.special_requests || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">合計：${totalGuests}名</div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};