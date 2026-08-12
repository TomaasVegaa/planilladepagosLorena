import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  autoTable(doc, {
    head: [['Jugadoras que PAGARON', 'Estado']],
    body: paid.length > 0 ? paid : [['Nadie aún', '-']],
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] }, // var(--success)
    styles: { fontSize: 10 },
  });

  autoTable(doc, {
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

export const generateConsorcioReport = (
  month, 
  owners, 
  payments, 
  finances, 
  expenses, 
  totals
) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(`Informe de Consorcio - ${month.label}`, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

  // 1. Ingresos de Propietarios
  const ownerPayments = owners.map(owner => {
    const p = payments.find(pay => pay.owner_id === owner.id);
    const amount = p ? parseFloat(p.amount || 0) : 0;
    return [
      owner.order_num.toString(), 
      owner.name, 
      `$${amount.toLocaleString()}`
    ];
  });

  autoTable(doc, {
    head: [['Ord', 'Propietario', 'Monto Pagado']],
    body: ownerPayments,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }, // var(--primary)
    styles: { fontSize: 9 },
  });

  // 2. Ingresos Globales
  let lastY = doc.lastAutoTable.finalY + 10;
  
  const globalesData = [
    ['Aportes Extra', `$${parseFloat(finances.aportes_extra || 0).toLocaleString()}`],
    ['Rendimiento NX', `$${parseFloat(finances.rendimiento_nx || 0).toLocaleString()}`],
    ['Otros Ingresos', `$${parseFloat(finances.otros_ingresos || 0).toLocaleString()}`]
  ];

  autoTable(doc, {
    head: [['Ingresos Globales', 'Monto']],
    body: globalesData,
    startY: lastY,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] }, // var(--success)
    styles: { fontSize: 9 },
  });

  // 3. Gastos
  lastY = doc.lastAutoTable.finalY + 10;
  
  const expensesData = expenses.length > 0 
    ? expenses.map(e => [e.detail, `-$${parseFloat(e.amount || 0).toLocaleString()}`])
    : [['Sin gastos registrados', '$0']];

  autoTable(doc, {
    head: [['Detalle de Gastos', 'Monto']],
    body: expensesData,
    startY: lastY,
    theme: 'grid',
    headStyles: { fillColor: [239, 68, 68] }, // var(--danger)
    styles: { fontSize: 9 },
  });

  // 4. Resumen
  lastY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setTextColor(0);
  
  doc.text(`Total Ingresos del Mes: $${totals.ingresos.toLocaleString()}`, 14, lastY);
  doc.text(`Total Gastos del Mes: -$${totals.gastos.toLocaleString()}`, 14, lastY + 7);
  
  doc.setFontSize(14);
  doc.setTextColor(totals.acumulado >= 0 ? 16 : 239, totals.acumulado >= 0 ? 185 : 68, totals.acumulado >= 0 ? 129 : 68);
  doc.text(`Saldo Acumulado: $${totals.acumulado.toLocaleString()}`, 14, lastY + 17);

  doc.save(`consorcio_${month.label.replace(' ', '_')}.pdf`);
};
