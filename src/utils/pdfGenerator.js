import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateSingleMonthReport = (month, players, payments) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(`Reporte de Recaudación - ${month.label}`, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

  const activePlayers = players.filter(p => p.status !== 'baja');
  const paid = [];
  const unpaid = [];

  activePlayers.forEach(p => {
    const hasPaid = payments.some(payment => payment.playerId === p.id && payment.monthKey === month.key);
    const name = p.lastName ? `${p.lastName}, ${p.name}` : p.name;
    if (hasPaid) {
      paid.push([name, 'Pagado ($25.000)']);
    } else {
      unpaid.push([name, 'Pendiente']);
    }
  });

  // Table Data
  doc.autoTable({
    head: [['Jugadoras que PAGARON', 'Estado']],
    body: paid.length > 0 ? paid : [['Nadie aún', '-']],
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] }, // var(--success)
    styles: { fontSize: 10 },
  });

  doc.autoTable({
    head: [['Jugadoras que FALTAN PAGAR', 'Estado']],
    body: unpaid.length > 0 ? unpaid : [['Ninguna', '-']],
    startY: doc.lastAutoTable.finalY + 10,
    theme: 'grid',
    headStyles: { fillColor: [239, 68, 68] }, // var(--danger)
    styles: { fontSize: 10 },
  });

  // Total Summary
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Total Recaudado en ${month.label}: $${(paid.length * 25000).toLocaleString()}`, 14, finalY);

  doc.save(`reporte_${month.label.replace(' ', '_')}.pdf`);
};
