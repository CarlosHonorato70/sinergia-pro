import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId, filename) => {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(image, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(filename);
};

export const generateReport = (patientName, data) => {
  const pdf = new jsPDF();
  
  pdf.setFontSize(20);
  pdf.text('Relatório Terapêutico', 20, 20);
  
  pdf.setFontSize(12);
  pdf.text(`Paciente: ${patientName}`, 20, 40);
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 50);
  
  pdf.setFontSize(14);
  pdf.text('Resumo do Progresso', 20, 70);
  
  pdf.setFontSize(11);
  let yPos = 85;
  data.forEach((item) => {
    pdf.text(`${item.label}: ${item.value}`, 20, yPos);
    yPos += 10;
  });
  
  pdf.save(`relatorio_${patientName}_${new Date().getTime()}.pdf`);
};
