// This service handles exporting text to different formats

declare const jspdf: any;

export const exportToPDF = (content: string, filename: string = 'generated-content') => {
  if (typeof jspdf === 'undefined') {
    console.error('jsPDF library not loaded');
    return;
  }

  const { jsPDF } = jspdf;
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
  });

  // Basic configuration for Hebrew support (Note: full RTL support in jsPDF is tricky without custom fonts)
  // For this implementation, we will use a basic approach. 
  // Ideally, one needs to load a Hebrew font like 'Heebo' or 'Arial' into jsPDF.
  // Since we cannot easily load local fonts here, we'll try to align text right.

  doc.setR2L(true);
  doc.setFontSize(12);
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxLineWidth = pageWidth - (margin * 2);
  
  const splitText = doc.splitTextToSize(content, maxLineWidth);
  
  doc.text(splitText, pageWidth - margin, margin, { align: 'right' });
  doc.save(`${filename}.pdf`);
};

export const exportToDOCX = (content: string, filename: string = 'generated-content') => {
  // We use a simpler HTML-to-Doc approach which is browser compatible without large libraries
  const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body style='font-family: Arial; direction: rtl;'>";
  const postHtml = "</body></html>";
  
  // Convert newlines to breaks for HTML
  const htmlContent = content.replace(/\n/g, "<br>");
  
  const html = preHtml + htmlContent + postHtml;

  const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
  });
  
  const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
  
  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);
  
  if (navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1) {
      downloadLink.setAttribute("target", "_blank");
  }
  
  downloadLink.href = url;
  downloadLink.download = `${filename}.doc`;
  downloadLink.click();
  
  document.body.removeChild(downloadLink);
};