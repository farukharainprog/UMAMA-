import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { FIFTEEN_WISHES, BIRTHDAY_GIRL, CREATOR_NAME, BIRTHDAY_DATE } from '../types';

export interface DownloadResult {
  success: boolean;
  filename: string;
  isMobile: boolean;
  message?: string;
}

/**
 * Detects if the user is on mobile (iOS/Android)
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

/**
 * Helper to trigger standard browser file download
 */
export function triggerFileDownload(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports an HTML element as a crisp, high-resolution PNG
 */
export async function downloadElementAsPng(
  element: HTMLElement,
  filename: string,
  pixelRatio = 2
): Promise<DownloadResult> {
  try {
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: pixelRatio,
      cacheBust: true,
      backgroundColor: '#0f172a',
    });

    triggerFileDownload(dataUrl, filename);

    return {
      success: true,
      filename,
      isMobile: isMobileDevice(),
    };
  } catch (error) {
    console.error('Failed to export element as PNG:', error);
    return {
      success: false,
      filename,
      isMobile: isMobileDevice(),
      message: 'Failed to generate image. Please try again.',
    };
  }
}

/**
 * Generates an elegant, printable PDF of the 15 Birthday Wishes for UMAMA from Malika Muneer
 */
export async function downloadWishesAsPdf(): Promise<DownloadResult> {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background luxury tone
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Golden decorative border
    doc.setDrawColor(245, 158, 11); // golden amber
    doc.setLineWidth(0.8);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
    doc.setLineWidth(0.2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Header Title
    doc.setTextColor(244, 114, 182); // soft pink
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('A SPECIAL BIRTHDAY TRIBUTE', pageWidth / 2, 22, { align: 'center' });

    doc.setTextColor(253, 224, 71); // bright gold
    doc.setFontSize(22);
    doc.text(`15 HEARTFELT WISHES FOR ${BIRTHDAY_GIRL}`, pageWidth / 2, 32, { align: 'center' });

    doc.setTextColor(226, 232, 240); // slate-200
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(`Celebrating ${BIRTHDAY_DATE} • With endless love from ${CREATOR_NAME}`, pageWidth / 2, 38, { align: 'center' });

    // Hairline divider
    doc.setDrawColor(244, 114, 182);
    doc.setLineWidth(0.3);
    doc.line(30, 42, pageWidth - 30, 42);

    // List the 15 wishes
    let currentY = 50;
    const leftMargin = 18;

    FIFTEEN_WISHES.forEach((wish, index) => {
      // Number badge / bullet
      doc.setTextColor(251, 191, 36); // golden
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${index + 1}.`, leftMargin, currentY);

      // Category
      doc.setTextColor(244, 114, 182);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`[${wish.category}]`, leftMargin + 8, currentY);

      // Wish text
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      
      const splitText = doc.splitTextToSize(wish.text, pageWidth - leftMargin - 30);
      doc.text(splitText, leftMargin + 8, currentY + 4.5);

      currentY += 13.5;
    });

    // Footer with Malika's signature
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.3);
    doc.line(30, pageHeight - 25, pageWidth - 30, pageHeight - 25);

    doc.setTextColor(253, 224, 71);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`With all my love & prayers, always — ${CREATOR_NAME}`, pageWidth / 2, pageHeight - 18, { align: 'center' });

    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text(`Happy Birthday Dear ${BIRTHDAY_GIRL} • 8 November`, pageWidth / 2, pageHeight - 12, { align: 'center' });

    const filename = `Umama_15_Birthday_Wishes_from_Malika.pdf`;
    doc.save(filename);

    return {
      success: true,
      filename,
      isMobile: isMobileDevice(),
    };
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return {
      success: false,
      filename: 'Umama_Birthday_Wishes.pdf',
      isMobile: isMobileDevice(),
      message: 'Failed to generate PDF document.',
    };
  }
}

/**
 * Downloads a direct image URL or uploaded memory photo
 */
export function downloadMemoryImage(imageUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
