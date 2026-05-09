// ======================================================
// FILE: src/templates/invoiceTemplate.js
// PURPOSE:
// Adaptive A4 PDF invoice template
//
// IMPORTANT:
// - Quotation template is not touched.
// - This template is only for Invoice PDF.
// - Supports logoBase64 and signatureBase64.
// - Supports invoiceItems/items/services fallback.
// ======================================================

const BRAND_COLOR = '#fd4475';

const escapeHtml = (value = '') => {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const nl2br = (value = '') => {
  return escapeHtml(value).replace(/\n/g, '<br/>');
};

const safe = (value, fallback = '') => {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value);
};

const num = (value) => {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatMoney = (value) => {
  const number = num(value);

  return number.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const normalizeImageSrc = (base64) => {
  if (!base64) return '';

  const value = String(base64);

  if (value.startsWith('data:image')) {
    return value;
  }

  return `data:image/jpeg;base64,${value}`;
};

const buildItems = (invoiceData = {}) => {
  const items =
    invoiceData.invoiceItems ||
    invoiceData.items ||
    invoiceData.services ||
    [];

  if (!Array.isArray(items)) return [];

  return items.filter((item) => {
    const name = safe(item?.name).trim();
    const description = safe(item?.description).trim();
    const quantity = safe(item?.quantity).trim();
    const unitPrice = safe(item?.unitPrice).trim();

    const hasRealQuantity = quantity && quantity !== '1';

    return name || description || unitPrice || hasRealQuantity;
  });
};

const getItemAmount = (item) => {
  return num(item?.quantity) * num(item?.unitPrice);
};

const getMode = (count) => {
  if (count <= 10) return 'normal';
  if (count <= 15) return 'slightCompact';
  if (count <= 25) return 'compact';
  if (count <= 35) return 'maxFit';

  return 'multiPage';
};

const getModeConfig = (mode) => {
  const configs = {
    normal: {
      pagePadding: '7mm 8mm',
      baseFont: 8.8,
      smallFont: 8,
      companyFont: 15,
      titleFont: 17,
      tableHeaderFont: 8.4,
      tableBodyFont: 8.4,
      tablePadding: '4px 5px',
      paymentPadding: '6px 8px',
      paymentMinHeight: '58px',
      footerFont: 7.6,
      logoSize: 54,
      signatureWidth: 82,
      signatureHeight: 28,
      inlineDescription: false,
    },

    slightCompact: {
      pagePadding: '6.5mm 7.5mm',
      baseFont: 8,
      smallFont: 7.5,
      companyFont: 14,
      titleFont: 16,
      tableHeaderFont: 7.8,
      tableBodyFont: 7.8,
      tablePadding: '3px 4px',
      paymentPadding: '5px 7px',
      paymentMinHeight: '52px',
      footerFont: 7,
      logoSize: 52,
      signatureWidth: 78,
      signatureHeight: 26,
      inlineDescription: true,
    },

    compact: {
      pagePadding: '6mm 7mm',
      baseFont: 7.5,
      smallFont: 7.1,
      companyFont: 13.6,
      titleFont: 15,
      tableHeaderFont: 7.2,
      tableBodyFont: 7.2,
      tablePadding: '2.5px 4px',
      paymentPadding: '5px 6px',
      paymentMinHeight: '48px',
      footerFont: 6.9,
      logoSize: 50,
      signatureWidth: 74,
      signatureHeight: 25,
      inlineDescription: true,
    },

    maxFit: {
      pagePadding: '5mm 6mm',
      baseFont: 6.9,
      smallFont: 6.8,
      companyFont: 12.5,
      titleFont: 14,
      tableHeaderFont: 6.8,
      tableBodyFont: 6.8,
      tablePadding: '1.6px 3px',
      paymentPadding: '4px 5px',
      paymentMinHeight: '42px',
      footerFont: 6.5,
      logoSize: 44,
      signatureWidth: 66,
      signatureHeight: 22,
      inlineDescription: true,
    },

    multiPage: {
      pagePadding: '6mm 7mm',
      baseFont: 7,
      smallFont: 6.9,
      companyFont: 13,
      titleFont: 14.5,
      tableHeaderFont: 6.9,
      tableBodyFont: 6.9,
      tablePadding: '2px 3px',
      paymentPadding: '4px 5px',
      paymentMinHeight: '44px',
      footerFont: 6.6,
      logoSize: 48,
      signatureWidth: 70,
      signatureHeight: 24,
      inlineDescription: true,
    },
  };

  return configs[mode] || configs.normal;
};

const getPaymentStatusMeta = (status) => {
  const key = status || 'unpaid';

  const meta = {
    unpaid: {
      label: 'Unpaid',
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fecaca',
    },
    partiallyPaid: {
      label: 'Partially Paid',
      color: '#c2410c',
      bg: '#fff7ed',
      border: '#fed7aa',
    },
    mostlyPaid: {
      label: 'Mostly Paid',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
    },
    paid: {
      label: 'Paid',
      color: '#16a34a',
      bg: '#f0fdf4',
      border: '#bbf7d0',
    },
  };

  return meta[key] || meta.unpaid;
};

const getItemDescriptionHTML = (item, inlineDescription) => {
  const itemName = safe(item?.name);
  const itemDescription = safe(item?.description);

  if (!itemName && !itemDescription) {
    return '';
  }

  if (inlineDescription) {
    if (itemName && itemDescription) {
      return `
        <div class="item-inline">
          <span class="item-name-inline">${escapeHtml(itemName)}</span>
          <span class="item-separator"> : </span>
          <span class="item-description-inline">${nl2br(itemDescription)}</span>
        </div>
      `;
    }

    return `
      <div class="item-inline">
        ${escapeHtml(itemName || itemDescription)}
      </div>
    `;
  }

  return `
    <div class="item-name">${escapeHtml(itemName)}</div>
    ${
      itemDescription
        ? `<div class="item-desc">${nl2br(itemDescription)}</div>`
        : ''
    }
  `;
};

const renderItemRows = (items, config, startIndex = 0) => {
  if (!items.length) {
    return `
      <tr>
        <td colspan="5" class="empty-row">No invoice item added</td>
      </tr>
    `;
  }

  return items
    .map((item, index) => {
      const quantity = num(item.quantity || 0);
      const rate = num(item.unitPrice || 0);
      const amount = getItemAmount(item);

      return `
        <tr>
          <td class="center col-no">${startIndex + index + 1}</td>

          <td class="desc-cell">
            ${getItemDescriptionHTML(item, config.inlineDescription)}
          </td>

          <td class="center col-qty">${formatMoney(quantity)}</td>
          <td class="right col-rate">${formatMoney(rate)}</td>
          <td class="right col-amount">${formatMoney(amount)}</td>
        </tr>
      `;
    })
    .join('');
};

const renderItemsTable = (items, config, startIndex = 0, title = 'Invoice Items') => {
  return `
    <div class="item-heading">
      <div class="item-heading-line"></div>
      <p class="item-heading-text">${escapeHtml(title)}</p>
      <div class="item-heading-line"></div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th class="center col-no">#</th>
          <th class="col-desc">Description</th>
          <th class="center col-qty">Qty</th>
          <th class="right col-rate">Rate</th>
          <th class="right col-amount">Amount</th>
        </tr>
      </thead>

      <tbody>
        ${renderItemRows(items, config, startIndex)}
      </tbody>
    </table>
  `;
};

const buildPagesForMultiPage = (items) => {
  const firstPageCapacity = 35;
  const middlePageCapacity = 58;
  const lastPageCapacity = 28;

  const pages = [];

  if (items.length <= firstPageCapacity + lastPageCapacity) {
    pages.push({
      type: 'first',
      items: items.slice(0, firstPageCapacity),
      startIndex: 0,
    });

    pages.push({
      type: 'last',
      items: items.slice(firstPageCapacity),
      startIndex: firstPageCapacity,
    });

    return pages.filter((page) => page.items.length > 0 || page.type === 'last');
  }

  pages.push({
    type: 'first',
    items: items.slice(0, firstPageCapacity),
    startIndex: 0,
  });

  let used = firstPageCapacity;
  let remaining = items.slice(firstPageCapacity);

  while (remaining.length > lastPageCapacity) {
    const shouldLeaveForLast =
      remaining.length <= middlePageCapacity + lastPageCapacity;

    const takeCount = shouldLeaveForLast
      ? remaining.length - lastPageCapacity
      : middlePageCapacity;

    pages.push({
      type: 'middle',
      items: remaining.slice(0, takeCount),
      startIndex: used,
    });

    used += takeCount;
    remaining = remaining.slice(takeCount);
  }

  pages.push({
    type: 'last',
    items: remaining,
    startIndex: used,
  });

  return pages;
};

export const generateInvoiceHTML = (data = {}) => {
  const companyName = safe(data.companyName, 'Company Name');
  const companyAddress = safe(data.companyAddress);
  const companyEmail = safe(data.companyEmail);
  const companyPhone = safe(data.companyPhone);

  const clientName = safe(data.clientName);
  const clientCompany = safe(data.clientCompany);
  const clientEmail = safe(data.clientEmail);
  const clientPhone = safe(data.clientPhone);
  const clientAddress = safe(data.clientAddress);

  const invoiceNumber = safe(data.invoiceNumber);
  const invoiceDate = safe(data.invoiceDate);
  const dueDate = safe(data.dueDate);
  const referenceQuotationNumber = safe(data.referenceQuotationNumber);

  const paymentTerms = safe(data.paymentTerms);
  const paymentMethod = safe(data.paymentMethod);
  const mobilePaymentInfo = safe(data.mobilePaymentInfo);
  const notes = safe(data.notes);

  const logoSrc = normalizeImageSrc(data.logoBase64);
  const signatureSrc = normalizeImageSrc(data.signatureBase64);
  const signatureText = safe(data.signature || data.signatureLine || '');

  const items = buildItems(data);
  const itemCount = items.length;

  const mode = getMode(itemCount);
  const config = getModeConfig(mode);
  const isMultiPage = mode === 'multiPage';

  const subtotal =
    data.subtotal !== undefined
      ? num(data.subtotal)
      : items.reduce((sum, item) => sum + getItemAmount(item), 0);

  const discount =
    data.discountAmount !== undefined
      ? num(data.discountAmount)
      : num(data.discount || 0);

  const taxPercent =
    data.taxPercentage !== undefined
      ? num(data.taxPercentage)
      : num(data.tax || 0);

  const taxableAmount = Math.max(subtotal - discount, 0);

  const taxAmount =
    data.taxAmount !== undefined
      ? num(data.taxAmount)
      : (taxableAmount * taxPercent) / 100;

  const totalAmount =
    data.totalAmount !== undefined
      ? num(data.totalAmount)
      : data.grandTotal !== undefined
      ? num(data.grandTotal)
      : taxableAmount + taxAmount;

  const paidAmount = num(data.paidAmount || 0);
  const dueAmount =
    data.dueAmount !== undefined
      ? num(data.dueAmount)
      : Math.max(totalAmount - paidAmount, 0);

  const statusMeta = getPaymentStatusMeta(data.paymentStatus || data.status);
  const statusLabel = safe(data.paymentStatusLabel, statusMeta.label);

  const logoHTML = logoSrc
    ? `<img class="logo-img" src="${logoSrc}" alt="Logo" />`
    : '';

  const signatureHTML = signatureSrc
    ? `<img class="signature-img" src="${signatureSrc}" alt="Signature" />`
    : signatureText
    ? `<div class="signature-text">${escapeHtml(signatureText)}</div>`
    : '<div class="signature-blank"></div>';

  const headerHTML = `
    <div class="header">
      <div class="top-header">
        <div class="company-block">
          <h1 class="company-name">${escapeHtml(companyName)}</h1>
          <p class="company-subtitle">Invoice</p>

          ${
            companyAddress
              ? `<p class="company-info-line">${nl2br(companyAddress)}</p>`
              : ''
          }

          ${
            companyEmail
              ? `<p class="company-info-line">Email: ${escapeHtml(companyEmail)}</p>`
              : ''
          }

          ${
            companyPhone
              ? `<p class="company-info-line">Phone: ${escapeHtml(companyPhone)}</p>`
              : ''
          }
        </div>

        <div class="right-head">
          <div class="logo-wrap">${logoHTML}</div>
          <div class="invoice-title">INVOICE</div>
        </div>
      </div>

      <div class="header-info">
        <div class="billto">
          <p class="section-title">Bill To :</p>

          ${
            clientName
              ? `<p class="info-line"><span class="info-label">Name:</span> ${escapeHtml(clientName)}</p>`
              : ''
          }

          ${
            clientCompany
              ? `<p class="info-line"><span class="info-label">Company:</span> ${escapeHtml(clientCompany)}</p>`
              : ''
          }

          ${
            clientEmail
              ? `<p class="info-line"><span class="info-label">Email:</span> ${escapeHtml(clientEmail)}</p>`
              : ''
          }

          ${
            clientPhone
              ? `<p class="info-line"><span class="info-label">Contact:</span> ${escapeHtml(clientPhone)}</p>`
              : ''
          }

          ${
            clientAddress
              ? `<p class="info-line"><span class="info-label">Address:</span> ${nl2br(clientAddress)}</p>`
              : ''
          }
        </div>

        <div class="invoice-meta">
          ${
            invoiceNumber
              ? `
                <div class="meta-row">
                <p class="meta-value">${escapeHtml(invoiceNumber)}</p>
                  <p class="meta-label">:Invoice No</p>
                </div>
              `
              : ''
          }

          ${
            invoiceDate
              ? `
                <div class="meta-row">
                <p class="meta-value">${escapeHtml(invoiceDate)}</p>
                  <p class="meta-label">:Invoice Date</p>
                </div>
              `
              : ''
          }

          ${
            dueDate
              ? `
                <div class="meta-row">
                <p class="meta-value">${escapeHtml(dueDate)}</p>
                  <p class="meta-label">:Due Date</p>
                </div>
              `
              : ''
          }

          ${
            referenceQuotationNumber
              ? `
                <div class="meta-row">
                <p class="meta-value reference-quote-value">${escapeHtml(referenceQuotationNumber)}</p>
                  <p class="meta-label reference-quote-label">:Reference Quote</p>
                </div>
              `
              : ''
          }

          <div class="status-badge">
            ${escapeHtml(statusLabel)}
          </div>
        </div>
      </div>
    </div>
  `;

  const miniHeaderHTML = (pageNumber) => `
    <div class="mini-header">
      <div>
        <strong>${escapeHtml(companyName)}</strong>
        ${
          invoiceNumber
            ? `<span class="mini-muted"> | Invoice No: ${escapeHtml(invoiceNumber)}</span>`
            : ''
        }
      </div>

      <div class="mini-muted">Page ${pageNumber}</div>
    </div>
  `;

  const summaryHTML = `
    <div class="summary-wrap">
      <div class="summary-row">
        <span class="summary-label">Subtotal</span>
        <span>${formatMoney(subtotal)}</span>
      </div>

      <div class="summary-row">
        <span class="summary-label">Discount</span>
        <span>${formatMoney(discount)}</span>
      </div>

      <div class="summary-row">
        <span class="summary-label">Tax (${formatMoney(taxPercent)}%)</span>
        <span>${formatMoney(taxAmount)}</span>
      </div>

      <div class="net-row">
        <span>Total Amount</span>
        <span>${formatMoney(totalAmount)}</span>
      </div>

      <div class="summary-row">
        <span class="summary-label">Paid Amount</span>
        <span>${formatMoney(paidAmount)}</span>
      </div>

      <div class="due-row">
        <span>Due Amount</span>
        <span>${formatMoney(dueAmount)}</span>
      </div>
    </div>
  `;

  const footerHTML = `
    <div class="footer">
      <div class="payment-row">
        <div class="payment-box">
          <p class="payment-title">Payment Terms</p>
          <p class="payment-text">${nl2br(paymentTerms || 'No payment terms added.')}</p>
        </div>

        <div class="payment-box">
          <p class="payment-title">Payment Method</p>
          <p class="payment-text">${nl2br(paymentMethod || 'No payment method added.')}</p>
        </div>
      </div>

      ${
        mobilePaymentInfo
          ? `
            <div class="mobile-payment">
              <p class="mobile-title">Mobile Payment:</p>
              <p class="mobile-text">${nl2br(mobilePaymentInfo)}</p>
            </div>
          `
          : ''
      }

      <div class="signature-wrap">
        ${signatureHTML}
        <div class="signature-line"></div>
        <div class="signature-label">Authorized Signature</div>
      </div>

      <div class="notes-section">
        <p class="thanks-line"><span class="heart">❤</span> THANK YOU FOR YOUR BUSINESS!</p>
        <p class="notes-text">
          <strong>Notes:</strong> ${nl2br(notes || 'No additional notes added.')}
        </p>
      </div>

      <div class="bottom-footer">
        <p class="footer-text">If you have any questions about this Invoice, please contact with us</p>

        <p class="footer-contact">
          ${escapeHtml(companyPhone)}
          ${companyPhone && companyEmail ? ' | ' : ''}
          ${escapeHtml(companyEmail)}
        </p>

        <p class="footer-support">Development & maintenance support by netkib.com & kibria.net</p>
      </div>
    </div>
  `;

  const singlePageHTML = `
    <div class="pdf-page single-page">
      ${headerHTML}

      <div class="middle">
        ${renderItemsTable(items, config, 0, 'Invoice Items')}
        ${summaryHTML}
      </div>

      ${footerHTML}
    </div>
  `;

  const multiPageHTML = () => {
    const pages = buildPagesForMultiPage(items);

    return pages
      .map((page, pageIndex) => {
        const pageNumber = pageIndex + 1;
        const isFirst = page.type === 'first';
        const isLast = page.type === 'last';

        return `
          <div class="pdf-page ${isFirst ? 'multi-first' : ''} ${
            isLast ? 'multi-last' : ''
          }">
            ${isFirst ? headerHTML : miniHeaderHTML(pageNumber)}

            <div class="middle multi-middle">
              ${renderItemsTable(
                page.items,
                config,
                page.startIndex,
                isFirst ? 'Invoice Items' : 'Invoice Items Continued'
              )}

              ${isLast ? summaryHTML : ''}
            </div>

            ${
              isLast
                ? footerHTML
                : `<div class="continued-footer">Continued on next page...</div>`
            }
          </div>
        `;
      })
      .join('');
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice</title>

  <style>
    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
      color: #111827;
      font-family: Arial, Helvetica, sans-serif;
      font-size: ${config.baseFont}px;
      line-height: 1.08;
    }

    .pdf-page {
      width: 210mm;
      height: 297mm;
      padding: ${config.pagePadding};
      background: #ffffff;
      overflow: hidden;
    }

    .single-page {
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 5px;
    }

    .multi-first,
    .multi-last {
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 5px;
      page-break-after: always;
    }

    .multi-last {
      page-break-after: auto;
    }

    .pdf-page:not(.multi-last):not(.single-page) {
      page-break-after: always;
    }

    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1.5px solid ${BRAND_COLOR};
      padding-bottom: 3px;
      margin-bottom: 4px;
    }

    .company-block {
      width: 72%;
    }

    .company-name {
      margin: 0 0 1px 0;
      color: ${BRAND_COLOR};
      font-size: ${config.companyFont}px;
      line-height: 1.02;
      font-weight: 900;
    }

    .company-subtitle {
      margin: 0 0 2px 0;
      color: #111827;
      font-size: ${config.baseFont}px;
      line-height: 1.02;
      font-weight: 700;
    }

    .company-info-line {
      margin: 0;
      font-size: ${config.smallFont}px;
      line-height: 1.08;
    }

    .right-head {
      width: 26%;
      text-align: right;
    }

    .logo-wrap {
      min-height: ${config.logoSize}px;
    }

    .logo-img {
      max-width: ${config.logoSize}px;
      max-height: ${config.logoSize}px;
      object-fit: contain;
      display: inline-block;
    }

    .invoice-title {
      margin-top: 2px;
      color: ${BRAND_COLOR};
      font-size: ${config.titleFont}px;
      line-height: 1;
      font-weight: 900;
      letter-spacing: 1px;
    }

    .header-info {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }

    .billto {
      width: 60%;
    }

    .invoice-meta {
      width: 34%;
      text-align: right;
    }

    .section-title {
      margin: 0 0 2px 0;
      font-size: ${config.baseFont}px;
      line-height: 1.02;
      font-weight: 900;
    }

    .info-line {
      margin: 0;
      font-size: ${config.smallFont}px;
      line-height: 1.08;
    }

    .info-label {
      font-weight: 700;
    }

    .meta-row {
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      white-space: nowrap;
    }

    .meta-label {
      margin: 0;
      font-size: ${config.smallFont}px;
      line-height: 1.02;
      font-weight: 900;
      color: #111827;
    }

    .meta-value {
      margin: 0;
      font-size: ${config.smallFont}px;
      line-height: 1.02;
      font-weight: 800;
      color: #111827;
      text-align: right;
    }

    .reference-quote-label {
      color: #fd4475;
      font-weight: 900;
    }

    .reference-quote-value {
      color: #fd4475;
      font-weight: 900;
    }

    .status-badge {
      display: inline-block;
      margin-top: 2px;
      padding: 3px 7px;
      border-radius: 10px;
      border: 1px solid ${statusMeta.border};
      background: ${statusMeta.bg};
      color: ${statusMeta.color};
      font-size: ${config.smallFont}px;
      line-height: 1;
      font-weight: 900;
    }

    .mini-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 4px;
      border-bottom: 1.2px solid ${BRAND_COLOR};
      color: #111827;
      font-size: 8px;
      line-height: 1.05;
      margin-bottom: 5px;
    }

    .mini-muted {
      color: #4b5563;
      font-size: 7px;
      font-weight: 500;
    }

    .middle {
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .multi-middle {
      display: block;
    }

    .item-heading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 2px 0 4px 0;
    }

    .item-heading-line {
      width: 56px;
      height: 1px;
      background: ${BRAND_COLOR};
    }

    .item-heading-text {
      margin: 0;
      font-size: ${config.baseFont}px;
      line-height: 1;
      font-weight: 900;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    .items-table th {
      background: ${BRAND_COLOR};
      color: #ffffff;
      border: 1px solid #d1d5db;
      padding: ${config.tablePadding};
      font-size: ${config.tableHeaderFont}px;
      line-height: 1.02;
      font-weight: 800;
      text-align: left;
    }

    .items-table td {
      border: 1px solid #d1d5db;
      padding: ${config.tablePadding};
      font-size: ${config.tableBodyFont}px;
      line-height: 1.04;
      vertical-align: top;
    }

    .center {
      text-align: center;
    }

    .right {
      text-align: right;
    }

    .col-no {
      width: 6%;
      white-space: nowrap;
    }

    .col-desc {
      width: 50%;
    }

    .col-qty {
      width: 9%;
    }

    .col-rate {
      width: 17%;
    }

    .col-amount {
      width: 18%;
    }

    .desc-cell {
      word-break: break-word;
    }

    .item-name {
      font-weight: 800;
      line-height: 1.06;
    }

    .item-desc {
      margin-top: 1px;
      color: #6b7280;
      font-size: ${config.smallFont}px;
      line-height: 1.06;
    }

    .item-inline {
      line-height: 1.04;
      word-break: break-word;
    }

    .item-name-inline {
      font-weight: 800;
    }

    .item-separator {
      color: #6b7280;
    }

    .item-description-inline {
      color: #374151;
      font-weight: 500;
    }

    .empty-row {
      text-align: center;
      color: #6b7280;
      padding: 6px 0;
    }

    .summary-wrap {
      width: 42%;
      margin-left: auto;
      margin-top: 0;
      border-left: 1px solid #d1d5db;
      border-right: 1px solid #d1d5db;
      border-bottom: 1px solid #d1d5db;
    }

    .summary-row {
      min-height: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1px 6px;
      font-size: ${config.tableBodyFont}px;
      line-height: 1.02;
    }

    .summary-label {
      font-weight: 700;
    }

    .net-row {
      min-height: 17px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 6px;
      background: ${BRAND_COLOR};
      color: #ffffff;
      font-size: ${config.baseFont}px;
      line-height: 1.02;
      font-weight: 900;
    }

    .due-row {
      min-height: 17px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 6px;
      background: #fff0f5;
      color: ${BRAND_COLOR};
      font-size: ${config.baseFont}px;
      line-height: 1.02;
      font-weight: 900;
    }

    .footer {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
      page-break-inside: avoid;
    }

    .payment-row {
      display: flex;
      gap: 6px;
    }

    .payment-box {
      flex: 1;
      min-height: ${config.paymentMinHeight};
      border: 1px solid #f2b8ca;
      border-radius: 4px;
      padding: ${config.paymentPadding};
      page-break-inside: avoid;
    }

    .payment-title {
      margin: 0 0 2px 0;
      color: ${BRAND_COLOR};
      font-size: ${config.smallFont}px;
      line-height: 1.02;
      font-weight: 900;
    }

    .payment-text {
      margin: 0;
      color: #111827;
      white-space: pre-line;
      word-break: break-word;
      font-size: ${config.smallFont}px;
      line-height: 1.08;
    }

    .mobile-payment {
      padding: 3px 0;
      border-top: 1px solid #f2b8ca;
      border-bottom: 1px solid #f2b8ca;
      page-break-inside: avoid;
    }

    .mobile-title {
      margin: 0 0 1px 0;
      font-size: ${config.smallFont}px;
      line-height: 1.02;
      font-weight: 900;
    }

    .mobile-text {
      margin: 0;
      white-space: pre-line;
      word-break: break-word;
      font-size: ${config.smallFont}px;
      line-height: 1.06;
    }

    .signature-wrap {
      text-align: right;
      page-break-inside: avoid;
    }

    .signature-img {
      max-width: ${config.signatureWidth}px;
      max-height: ${config.signatureHeight}px;
      object-fit: contain;
      display: inline-block;
    }

    .signature-text {
      font-size: ${config.smallFont}px;
      line-height: 1.05;
      font-style: italic;
      min-height: 20px;
    }

    .signature-blank {
      height: 16px;
    }

    .signature-line {
      width: 108px;
      margin-left: auto;
      margin-top: 1px;
      border-top: 1px solid #111827;
    }

    .signature-label {
      margin-top: 2px;
      font-size: ${config.smallFont}px;
      line-height: 1.02;
      font-weight: 900;
    }

    .notes-section {
      page-break-inside: avoid;
    }

    .thanks-line {
      margin: 0 0 2px 0;
      font-size: ${config.smallFont}px;
      line-height: 1.05;
      font-weight: 900;
    }

    .heart {
      color: ${BRAND_COLOR};
    }

    .notes-text {
      margin: 0;
      word-break: break-word;
      font-size: ${config.smallFont}px;
      line-height: 1.08;
    }

    .bottom-footer {
      padding-top: 2px;
      border-top: 1px solid #d1d5db;
      text-align: center;
      page-break-inside: avoid;
    }

    .footer-text {
      margin: 0;
      color: #6b7280;
      font-size: ${config.footerFont}px;
      line-height: 1.04;
    }

    .footer-contact {
      margin: 1px 0 0 0;
      color: #111827;
      font-size: ${config.footerFont}px;
      line-height: 1.04;
    }

    .footer-support {
      margin: 1px 0 0 0;
      color: ${BRAND_COLOR};
      font-size: ${config.footerFont}px;
      line-height: 1.04;
    }

    .continued-footer {
      margin-top: 5px;
      padding-top: 3px;
      border-top: 1px solid #d1d5db;
      text-align: right;
      color: #6b7280;
      font-size: 7px;
      line-height: 1.05;
    }
  </style>
</head>

<body>
  ${isMultiPage ? multiPageHTML() : singlePageHTML}
</body>
</html>
  `;
};