import { jsPDF } from 'jspdf';
import { CalculationResult } from '../types';
import { formatINR, formatPercent } from './formatters';
import { AppLanguage, translations } from './translations';
import { saveOrShareNativePdf, isNativeAndroid, printNativePdfReport } from './nativeBridge';

export interface GenerateReportOptions {
  result: CalculationResult;
  language: AppLanguage;
}

export interface PdfGenerationResult {
  success: boolean;
  filename: string;
  blobUrl?: string;
  error?: string;
}

/**
 * Safely resolves the jsPDF constructor across various ESM / CommonJS bundlers
 */
function createJsPdfDoc(options?: any) {
  const Constructor: any =
    typeof jsPDF === 'function'
      ? jsPDF
      : (jsPDF as any)?.jsPDF || (jsPDF as any)?.default || (window as any)?.jspdf?.jsPDF;
  if (!Constructor) {
    throw new Error('jsPDF constructor not available');
  }
  return new Constructor(options);
}

/**
 * Safely sanitizes product name to create a valid, clean file name.
 * e.g. "Gulab Jamun" -> "Profit-Calculator-Pro-Gulab-Jamun.pdf"
 */
export function generatePdfFilename(productName: string | undefined): string {
  const raw = (productName || '').trim();
  if (!raw) {
    return 'Profit-Calculator-Pro-Report.pdf';
  }
  // Replace invalid characters, replace multiple whitespace with hyphens
  const clean = raw
    .replace(/[/\\?%*:|"<>#]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);

  return `Profit-Calculator-Pro-${clean || 'Report'}.pdf`;
}

/**
 * Helper to draw a rounded rectangle on a CanvasRenderingContext2D
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillColor?: string,
  strokeColor?: string,
  lineWidth: number = 1
) {
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Renders the business report directly onto a high-resolution 2D HTML5 Canvas.
 * This runs natively in 100% of browsers without CSS parsing or external dependencies.
 */
export function renderReportToCanvas({ result, language }: GenerateReportOptions): HTMLCanvasElement {
  const t = translations[language] || translations.en;
  const pName = result.productName || t.unnamedProduct;
  const isProfit = result.isProfit;
  const isLoss = result.isLoss;

  const dateStr = result.timestamp
    ? new Date(result.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-IN');

  const statusLabel = isProfit
    ? (t.profitStatusTitle || 'PROFIT')
    : isLoss
    ? (t.lossStatusTitle || 'LOSS')
    : (t.breakEvenStatusTitle || 'BREAK-EVEN');

  const statusColor = isProfit ? '#0f766e' : isLoss ? '#be123c' : '#334155';
  const statusBg = isProfit ? '#f0fdfa' : isLoss ? '#fff1f2' : '#f8fafc';
  const statusBorder = isProfit ? '#99f6e4' : isLoss ? '#fecdd3' : '#cbd5e1';

  // Create high-resolution Canvas (1200 x 1650 for crisp A4 rendering)
  const width = 1200;
  const height = 1650;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // 1. Clear & Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  const fontSans = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", "Mukta", sans-serif';

  const marginX = 80;
  let currentY = 80;

  // 2. Header Section
  ctx.fillStyle = '#2563EB';
  ctx.font = `900 16px ${fontSans}`;
  ctx.textAlign = 'left';
  ctx.fillText('NOMAN', marginX, currentY);

  ctx.fillStyle = '#0F172A';
  ctx.font = `900 30px ${fontSans}`;
  ctx.fillText('PROFIT CALCULATOR PRO', marginX, currentY + 30);

  ctx.fillStyle = '#475569';
  ctx.font = `700 16px ${fontSans}`;
  ctx.fillText(t.businessReportTitle || 'Business Profit Report', marginX, currentY + 54);

  // Header Right (Date & ID)
  ctx.textAlign = 'right';
  ctx.font = `600 16px ${fontSans}`;
  ctx.fillStyle = '#64748B';
  ctx.fillText(`Date: ${dateStr}`, width - marginX, currentY + 10);
  ctx.fillText(`Report ID: #${result.id ? result.id.slice(-6).toUpperCase() : 'REPORT'}`, width - marginX, currentY + 36);

  currentY += 68;

  // Header Divider
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(marginX, currentY, width - marginX * 2, 4);

  currentY += 36;

  // 3. Product Hero Banner Card
  const heroCardHeight = 140;
  drawRoundedRect(
    ctx,
    marginX,
    currentY,
    width - marginX * 2,
    heroCardHeight,
    16,
    '#F8FAFC',
    '#CBD5E1',
    2
  );

  // Hero Content: Left
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748B';
  ctx.font = `800 14px ${fontSans}`;
  ctx.fillText((t.productNameLabel || 'PRODUCT').toUpperCase(), marginX + 32, currentY + 36);

  ctx.fillStyle = '#0F172A';
  ctx.font = `900 28px ${fontSans}`;
  ctx.fillText(pName, marginX + 32, currentY + 74);

  ctx.fillStyle = '#475569';
  ctx.font = `600 17px ${fontSans}`;
  const subDetails = `${result.quantity.toLocaleString('en-IN')} ${t.pcsLabel} • ${t.costPriceLabel}: ${formatINR(result.costPrice)} / ${t.perUnit} • ${t.sellingPriceLabel}: ${formatINR(result.sellingPrice)} / ${t.perUnit}`;
  ctx.fillText(subDetails, marginX + 32, currentY + 108);

  // Hero Content: Status Badge on Right
  const badgeWidth = 160;
  const badgeHeight = 44;
  const badgeX = width - marginX - 32 - badgeWidth;
  const badgeY = currentY + 48;
  drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 22, statusBg, statusBorder, 2);

  ctx.textAlign = 'center';
  ctx.fillStyle = statusColor;
  ctx.font = `900 16px ${fontSans}`;
  ctx.fillText(statusLabel, badgeX + badgeWidth / 2, badgeY + 28);

  currentY += heroCardHeight + 40;

  // 4. Section 1: Financial Breakdown
  ctx.textAlign = 'left';
  ctx.fillStyle = '#334155';
  ctx.font = `900 16px ${fontSans}`;
  ctx.fillText('1. FINANCIAL BREAKDOWN', marginX, currentY);

  currentY += 18;

  // Table Container
  const tableWidth = width - marginX * 2;
  const tableX = marginX;

  // Columns:
  // Particulars (0..480), Unit Price (480..680), Qty (680..840), Total Amount (840..1040)
  const col1X = tableX + 24;
  const col2X = tableX + 540;
  const col3X = tableX + 740;
  const col4X = tableX + tableWidth - 24;

  // Table Header
  const thHeight = 48;
  drawRoundedRect(ctx, tableX, currentY, tableWidth, thHeight, 8, '#F1F5F9', '#CBD5E1', 1);

  ctx.fillStyle = '#475569';
  ctx.font = `800 14px ${fontSans}`;
  ctx.textAlign = 'left';
  ctx.fillText('PARTICULARS', col1X, currentY + 30);
  ctx.textAlign = 'right';
  ctx.fillText('RATE / UNIT', col2X, currentY + 30);
  ctx.fillText('QUANTITY', col3X, currentY + 30);
  ctx.fillText('TOTAL AMOUNT', col4X, currentY + 30);

  currentY += thHeight;

  // Table Row 1: Total Sales
  const rowHeight = 62;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(tableX, currentY, tableWidth, rowHeight);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.strokeRect(tableX, currentY, tableWidth, rowHeight);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = `700 18px ${fontSans}`;
  ctx.fillText(`${t.totalSalesLabel} (${t.sellingPriceLabel})`, col1X, currentY + 38);

  ctx.textAlign = 'right';
  ctx.font = `600 18px ${fontSans}`;
  ctx.fillText(formatINR(result.sellingPrice), col2X, currentY + 38);
  ctx.fillText(result.quantity.toLocaleString('en-IN'), col3X, currentY + 38);
  ctx.font = `900 19px ${fontSans}`;
  ctx.fillText(formatINR(result.totalSales), col4X, currentY + 38);

  currentY += rowHeight;

  // Table Row 2: Total Cost
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(tableX, currentY, tableWidth, rowHeight);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.strokeRect(tableX, currentY, tableWidth, rowHeight);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = `700 18px ${fontSans}`;
  ctx.fillText(`${t.totalCostLabel} (${t.costPriceLabel})`, col1X, currentY + 38);

  ctx.textAlign = 'right';
  ctx.font = `600 18px ${fontSans}`;
  ctx.fillText(formatINR(result.costPrice), col2X, currentY + 38);
  ctx.fillText(result.quantity.toLocaleString('en-IN'), col3X, currentY + 38);
  ctx.font = `900 19px ${fontSans}`;
  ctx.fillText(formatINR(result.totalCost), col4X, currentY + 38);

  currentY += rowHeight;

  // Table Row 3: Net Profit (Highlighted)
  const netRowHeight = 72;
  drawRoundedRect(ctx, tableX, currentY, tableWidth, netRowHeight, 0, statusBg, statusBorder, 2);

  ctx.textAlign = 'left';
  ctx.fillStyle = statusColor;
  ctx.font = `900 20px ${fontSans}`;
  ctx.fillText(isLoss ? t.netLossLabel : t.netProfitLabel, col1X, currentY + 44);

  ctx.textAlign = 'right';
  ctx.font = `800 19px ${fontSans}`;
  ctx.fillText(formatINR(result.profitPerPiece, true), col2X, currentY + 44);
  ctx.fillText(result.quantity.toLocaleString('en-IN'), col3X, currentY + 44);
  ctx.font = `900 24px ${fontSans}`;
  ctx.fillText(formatINR(result.totalProfit, true), col4X, currentY + 44);

  currentY += netRowHeight + 50;

  // 5. Section 2: Key Performance Indicators
  ctx.textAlign = 'left';
  ctx.fillStyle = '#334155';
  ctx.font = `900 16px ${fontSans}`;
  ctx.fillText('2. KEY PERFORMANCE METRICS', marginX, currentY);

  currentY += 20;

  const cardGap = 20;
  const numCards = 3;
  const metricCardWidth = (tableWidth - cardGap * (numCards - 1)) / numCards;
  const metricCardHeight = 120;

  // Metric Card 1: Profit Per Piece
  const card1X = marginX;
  drawRoundedRect(ctx, card1X, currentY, metricCardWidth, metricCardHeight, 14, '#F8FAFC', '#E2E8F0', 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748B';
  ctx.font = `800 14px ${fontSans}`;
  ctx.fillText(t.profitPerPieceLabel.toUpperCase(), card1X + metricCardWidth / 2, currentY + 40);
  ctx.fillStyle = statusColor;
  ctx.font = `900 26px ${fontSans}`;
  ctx.fillText(formatINR(result.profitPerPiece, true), card1X + metricCardWidth / 2, currentY + 84);

  // Metric Card 2: ROI %
  const card2X = card1X + metricCardWidth + cardGap;
  drawRoundedRect(ctx, card2X, currentY, metricCardWidth, metricCardHeight, 14, '#F8FAFC', '#E2E8F0', 2);
  ctx.fillStyle = '#64748B';
  ctx.font = `800 14px ${fontSans}`;
  ctx.fillText(t.roiLabel.toUpperCase(), card2X + metricCardWidth / 2, currentY + 40);
  ctx.fillStyle = '#0F172A';
  ctx.font = `900 26px ${fontSans}`;
  ctx.fillText(formatPercent(result.profitPercentage, true), card2X + metricCardWidth / 2, currentY + 84);

  // Metric Card 3: Margin %
  const card3X = card2X + metricCardWidth + cardGap;
  drawRoundedRect(ctx, card3X, currentY, metricCardWidth, metricCardHeight, 14, '#F8FAFC', '#E2E8F0', 2);
  ctx.fillStyle = '#64748B';
  ctx.font = `800 14px ${fontSans}`;
  ctx.fillText(t.marginLabel.toUpperCase(), card3X + metricCardWidth / 2, currentY + 40);
  ctx.fillStyle = '#0F172A';
  ctx.font = `900 26px ${fontSans}`;
  ctx.fillText(formatPercent(result.profitMarginOnSales, true), card3X + metricCardWidth / 2, currentY + 84);

  currentY += metricCardHeight + 80;

  // 6. Footer Section
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(marginX, height - 100);
  ctx.lineTo(width - marginX, height - 100);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748B';
  ctx.font = `400 13px ${fontSans}`;
  ctx.fillText('Powered by ', marginX, height - 65);

  const pbWidth = ctx.measureText('Powered by ').width;
  ctx.fillStyle = '#0F172A';
  ctx.font = `700 13px ${fontSans}`;
  ctx.fillText('NOMAN', marginX + pbWidth, height - 65);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#94A3B8';
  ctx.font = `600 13px ${fontSans}`;
  ctx.fillText('Official Business Report • Page 1 of 1', width - marginX, height - 65);

  return canvas;
}

/**
 * Generates an actual PDF file and initiates the browser download/save workflow.
 * Works client-side with zero external API calls or user data transmission.
 */
export async function generateAndDownloadPdf(options: GenerateReportOptions): Promise<PdfGenerationResult> {
  const { result, language } = options;
  const t = translations[language] || translations.en;
  const filename = generatePdfFilename(result.productName);

  try {
    // 1. Render report to native 2D Canvas
    const canvas = renderReportToCanvas(options);

    // 2. Convert Canvas to PNG data URL
    const imgData = canvas.toDataURL('image/png', 1.0);

    // 3. Initialize jsPDF (A4 portrait: 210mm x 297mm)
    const pdf = createJsPdfDoc({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Calculate dimensions with 12mm page margin
    const marginMm = 12;
    const pageWidthMm = 210;
    const contentWidthMm = pageWidthMm - marginMm * 2; // 186mm
    const contentHeightMm = (canvas.height * contentWidthMm) / canvas.width;

    pdf.addImage(imgData, 'PNG', marginMm, marginMm, contentWidthMm, contentHeightMm, undefined, 'FAST');

    // 4. Generate Blob, Base64 and Object URL
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const pdfBase64 = pdf.output('datauristring');

    // 5. Native Android save or Web download
    const nativeSaved = await saveOrShareNativePdf(
      pdfBase64,
      filename,
      `${result.productName || 'Profit Report'} - NOMAN Profit Calculator Pro`
    );

    let downloadTriggered = nativeSaved;
    if (!downloadTriggered) {
      try {
        if (typeof pdf.save === 'function') {
          pdf.save(filename);
          downloadTriggered = true;
        }
      } catch (saveErr) {
        console.warn('pdf.save failed, trying DOM anchor fallback:', saveErr);
      }
    }

    if (!downloadTriggered) {
      try {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 1500);
        downloadTriggered = true;
      } catch (linkErr) {
        console.warn('Anchor fallback also failed:', linkErr);
      }
    }

    return {
      success: true,
      filename,
      blobUrl,
    };
  } catch (err) {
    console.error('PDF Generation Error:', err);
    return {
      success: false,
      filename,
      error: t.pdfGenError || 'Could not generate PDF. Please try again.',
    };
  }
}

/**
 * Generates clean plain text report for clipboard copying / messaging
 */
export function generatePlainTextReport({ result, language }: GenerateReportOptions): string {
  const t = translations[language] || translations.en;
  const pName = result.productName || t.unnamedProduct;
  const isProfit = result.isProfit;
  const isLoss = result.isLoss;

  const profitStatusText = isProfit
    ? `${t.netProfitLabel}: ${formatINR(result.totalProfit)} (+${formatINR(result.profitPerPiece)} / ${t.perUnit})`
    : isLoss
    ? `${t.netLossLabel}: ${formatINR(Math.abs(result.totalProfit))} (-${formatINR(Math.abs(result.profitPerPiece))} / ${t.perUnit})`
    : `${t.breakEvenStatusTitle}: ₹0.00`;

  const dateStr = result.timestamp
    ? new Date(result.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-IN');

  return `========================================
NOMAN
PROFIT CALCULATOR PRO
${t.businessReportTitle || 'Business Profit Report'}
========================================
Date: ${dateStr}
Product: ${pName}

FINANCIAL BREAKDOWN:
----------------------------------------
• ${t.costPriceLabel}: ${formatINR(result.costPrice)} / ${t.perUnit}
• ${t.sellingPriceLabel}: ${formatINR(result.sellingPrice)} / ${t.perUnit}
• ${t.quantityLabel}: ${result.quantity.toLocaleString('en-IN')} ${t.pcsLabel}

REVENUE & PROFIT:
----------------------------------------
• ${t.totalSalesLabel}: ${formatINR(result.totalSales)}
• ${t.totalCostLabel}: ${formatINR(result.totalCost)}
• ${profitStatusText}

PERFORMANCE METRICS:
----------------------------------------
• ${t.profitPerPieceLabel}: ${formatINR(result.profitPerPiece, true)}
• ${t.roiLabel}: ${formatPercent(result.profitPercentage, true)}
• ${t.marginLabel}: ${formatPercent(result.profitMarginOnSales, true)}
========================================
Powered by NOMAN`;
}

/**
 * Generates standalone styled HTML for printable PDF / browser print dialog
 */
export function generatePrintableHTML({ result, language }: GenerateReportOptions): string {
  const t = translations[language] || translations.en;
  const pName = result.productName || t.unnamedProduct;
  const isProfit = result.isProfit;
  const isLoss = result.isLoss;

  const dateStr = result.timestamp
    ? new Date(result.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-IN');

  const statusLabel = isProfit
    ? (t.profitStatusTitle || 'PROFIT')
    : isLoss
    ? (t.lossStatusTitle || 'LOSS')
    : (t.breakEvenStatusTitle || 'BREAK-EVEN');

  const statusColor = isProfit ? '#0f766e' : isLoss ? '#be123c' : '#475569';
  const statusBg = isProfit ? '#f0fdfa' : isLoss ? '#fff1f2' : '#f8fafc';

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profit Report - ${pName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", "Mukta", sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.5;
      padding: 24px;
    }
    .report-card {
      max-width: 680px;
      margin: 0 auto;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 32px;
      background: #ffffff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .brand-subtitle {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      margin-top: 4px;
    }
    .report-meta {
      text-align: right;
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    .product-hero {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 18px 24px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .product-name {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
    }
    .product-meta {
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
      margin-top: 2px;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: ${statusBg};
      color: ${statusColor};
      border: 1px solid ${statusColor}40;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.75px;
      color: #475569;
      margin-bottom: 12px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .data-table th, .data-table td {
      padding: 12px 14px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .data-table th {
      background: #f8fafc;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    .data-table td.numeric {
      text-align: right;
      font-weight: 700;
    }
    .profit-highlight-row {
      background: ${statusBg};
      font-weight: 900;
    }
    .profit-highlight-row td {
      font-size: 16px;
      color: ${statusColor};
      border-top: 2px solid ${statusColor};
      border-bottom: 2px solid ${statusColor};
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px;
      text-align: center;
    }
    .metric-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
    }
    .metric-value {
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #94a3b8;
      font-weight: 600;
    }
    .powered-by-brand {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .powered-by-prefix {
      font-size: 11px;
      font-weight: 400;
      color: #64748b;
    }
    .powered-by-name {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #0f172a;
      text-transform: uppercase;
    }
    @media print {
      body {
        padding: 0;
        background: #ffffff !important;
      }
      .report-card {
        border: none;
        padding: 0;
        max-width: 100% !important;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="report-card">
    <div class="header">
      <div>
        <div style="font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #2563eb; text-transform: uppercase; margin-bottom: 2px;">NOMAN</div>
        <div class="brand-title">PROFIT CALCULATOR PRO</div>
        <div class="brand-subtitle">${t.businessReportTitle || 'Official Profit & Financial Summary'}</div>
      </div>
      <div class="report-meta">
        <div><strong>Date:</strong> ${dateStr}</div>
        <div><strong>Report ID:</strong> #${result.id ? result.id.slice(-6).toUpperCase() : 'REPORT'}</div>
      </div>
    </div>

    <div class="product-hero">
      <div>
        <div class="product-name">${pName}</div>
        <div class="product-meta">${result.quantity.toLocaleString('en-IN')} ${t.pcsLabel} @ ${formatINR(result.sellingPrice)} / ${t.perUnit}</div>
      </div>
      <div>
        <span class="status-badge">${statusLabel}</span>
      </div>
    </div>

    <div class="section-title">1. Financial Breakdown</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Particulars</th>
          <th style="text-align: right;">Unit Value</th>
          <th style="text-align: right;">Quantity</th>
          <th style="text-align: right;">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${t.totalSalesLabel}</strong> (${t.sellingPriceLabel})</td>
          <td class="numeric">${formatINR(result.sellingPrice)}</td>
          <td class="numeric">${result.quantity.toLocaleString('en-IN')}</td>
          <td class="numeric">${formatINR(result.totalSales)}</td>
        </tr>
        <tr>
          <td><strong>${t.totalCostLabel}</strong> (${t.costPriceLabel})</td>
          <td class="numeric">${formatINR(result.costPrice)}</td>
          <td class="numeric">${result.quantity.toLocaleString('en-IN')}</td>
          <td class="numeric">${formatINR(result.totalCost)}</td>
        </tr>
        <tr class="profit-highlight-row">
          <td><strong>${isLoss ? t.netLossLabel : t.netProfitLabel}</strong></td>
          <td class="numeric">${formatINR(result.profitPerPiece, true)}</td>
          <td class="numeric">${result.quantity.toLocaleString('en-IN')}</td>
          <td class="numeric">${formatINR(result.totalProfit, true)}</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">2. Key Performance Metrics</div>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">${t.profitPerPieceLabel}</div>
        <div class="metric-value" style="color: ${statusColor};">${formatINR(result.profitPerPiece, true)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">${t.roiLabel}</div>
        <div class="metric-value">${formatPercent(result.profitPercentage, true)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">${t.marginLabel}</div>
        <div class="metric-value">${formatPercent(result.profitMarginOnSales, true)}</div>
      </div>
    </div>

    <div class="footer">
      <span class="powered-by-name">Powered by NOMAN</span>
      <span>Page 1 of 1</span>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Triggers printing using the native browser print API for 100% reliable execution
 */
export function triggerDirectPrint(options: GenerateReportOptions): boolean {
  console.log('Print Debug: button clicked → print handler started');

  // Android Native Flow: Route directly to Android PrintManager system framework
  if (isNativeAndroid()) {
    try {
      const canvas = renderReportToCanvas(options);
      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdf = createJsPdfDoc({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const marginMm = 12;
      const pageWidthMm = 210;
      const contentWidthMm = pageWidthMm - marginMm * 2;
      const contentHeightMm = (canvas.height * contentWidthMm) / canvas.width;

      pdf.addImage(imgData, 'PNG', marginMm, marginMm, contentWidthMm, contentHeightMm, undefined, 'FAST');

      const base64Data = pdf.output('datauristring');
      const filename = generatePdfFilename(options.result.productName);
      printNativePdfReport(base64Data, filename);
      return true;
    } catch (err) {
      console.error('Android PrintManager trigger error:', err);
      return false;
    }
  }

  try {
    const htmlContent = generatePrintableHTML(options);

    // Strategy 1: Open a dedicated print document window on user tap to bypass iframe sandbox limits
    let popupSuccess = false;
    try {
      const printWindow = window.open('', '_blank', 'width=850,height=900,menubar=no,toolbar=no,location=no,status=no');
      if (printWindow && !printWindow.closed) {
        printWindow.document.open();
        const autoPrintScript = `
          <script>
            window.addEventListener('DOMContentLoaded', function() {
              setTimeout(function() {
                window.focus();
                try {
                  window.print();
                } catch(e) {
                  console.warn('Auto print call failed inside popup:', e);
                }
              }, 250);
            });
          </script>
          <div class="no-print" style="position:fixed;bottom:20px;right:20px;z-index:99999;">
            <button onclick="window.focus();window.print();" style="background:#2563eb;color:#ffffff;font-family:sans-serif;font-weight:bold;font-size:14px;padding:12px 24px;border:none;border-radius:10px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);cursor:pointer;">
              🖨️ Print Report
            </button>
          </div>
        </body>`;
        const enrichedHtml = htmlContent.replace('</body>', autoPrintScript);
        printWindow.document.write(enrichedHtml);
        printWindow.document.close();
        popupSuccess = true;
      }
    } catch (popupErr) {
      console.warn('Popup print strategy failed, trying inline and window.print():', popupErr);
    }

    // Strategy 2: If popup was prevented by sandbox or browser, invoke window.print() on the current frame
    if (!popupSuccess) {
      try {
        window.print();
        return true;
      } catch (windowPrintErr) {
        console.warn('Direct window.print() failed, trying hidden iframe fallback:', windowPrintErr);
        
        // Strategy 3: Hidden iframe DOM injection
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.border = '0';
        iframe.style.opacity = '0.01';
        iframe.style.pointerEvents = 'none';
        iframe.style.zIndex = '-9999';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document || iframe.contentDocument;
        if (doc) {
          doc.open();
          doc.write(htmlContent);
          doc.close();

          setTimeout(() => {
            try {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();
            } catch (iframeErr) {
              console.warn('Iframe print failed:', iframeErr);
            } finally {
              setTimeout(() => {
                if (document.body.contains(iframe)) {
                  iframe.remove();
                }
              }, 3000);
            }
          }, 300);
        }
      }
    }

    return true;
  } catch (err) {
    console.error('Error triggering direct print:', err);
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  }
}
