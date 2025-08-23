import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AppState } from '../types';

// Define a type for the doc object with autotable properties
// The autoTable function will add `lastAutoTable` to the doc instance.
interface jsPDFWithPlugin extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}


export const generatePdf = (state: AppState) => {
  const doc = new jsPDF() as jsPDFWithPlugin;

  const groupedStations = state.stations.reduce((acc, station) => {
    const zone = station.zone || 'UNIDADES ESPECIALES';
    if (!acc[zone]) {
      acc[zone] = [];
    }
    acc[zone].push(station);
    return acc;
  }, {} as Record<string, typeof state.stations>);

  let yPos = 20;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(200, 0, 0);
  doc.text('Reporte de Unidades de Bomberos', 105, yPos, { align: 'center' });
  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(new Date().toLocaleString(), 105, yPos, { align: 'center' });
  yPos += 15;


  const tableHeader = [['Unidad', 'Tipo', 'Estado', 'Oficial a Cargo', 'Personal']];

  Object.entries(groupedStations).forEach(([zone, stations], zoneIndex) => {
     if (zoneIndex > 0 && yPos > 250) {
        doc.addPage();
        yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setFillColor(200, 0, 0);
    doc.setTextColor(255, 255, 255);
    doc.rect(14, yPos - 5, 182, 7, 'F');
    doc.text(zone, 15, yPos);
    yPos += 10;
    
    stations.forEach(station => {
      const units = state.units.filter(u => u.stationId === station.id);
      if(units.length > 0) {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(50);
        doc.text(station.name, 15, yPos);
        yPos += 6;

        const tableBody = units.map(unit => [
          unit.id,
          unit.type,
          unit.status,
          unit.officerInCharge ? `${unit.officerInCharge.grade} ${unit.officerInCharge.lastName}` : '-',
          unit.personnelCount !== null ? unit.personnelCount.toString() : '-',
        ]);

        autoTable(doc, {
          head: tableHeader,
          body: tableBody,
          startY: yPos,
          theme: 'grid',
          headStyles: { fillColor: [41, 41, 41] },
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }
    });
  });

  doc.save('reporte_unidades.pdf');
};