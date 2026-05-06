// ======================================================
// FILE: src/templates/quotationTemplate.js
// PURPOSE:
// Adaptive A4 PDF quotation template
//
// Final Rules:
// 1-10 items  -> single page, stacked item name + description
// 11-35 items -> single page, item name : description inline
// 36+ items   -> multi-page, item name : description inline
//
// Notes:
// - Description is never hidden.
// - No max character cutting.
// - Single-page template has no forced page break.
// - Multi-page template only breaks between actual pages.
// - HTML escaping is applied to user-entered text.
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

const extractEmailPhoneFromContact = (contact = '') => {
  const emailMatch = String(contact || '').match(/Email:\s*([^\n]+)/i);
  const phoneMatch = String(contact || '').match(/Phone:\s*([^\n]+)/i);

  return {
    email: emailMatch?.[1]?.trim() || '',
    phone: phoneMatch?.[1]?.trim() || '',
  };
};

const buildItems = (services = []) => {
  if (!Array.isArray(services)) return [];

  return services.filter((item) => {
    const name = safe(item?.name).trim();
    const description = safe(item?.description).trim();
    const quantity = safe(item?.quantity).trim();
    const unitPrice = safe(item?.unitPrice).trim();

    const hasRealQuantity = quantity && quantity !== '1';

    return name || description || unitPrice || hasRealQuantity;
  });
};

const getMode = (count) => {
  if (count <= 10) return 'normal';
  if (count <= 15) return 'slightCompact';
  if (count <= 20) return 'compact';
  if (count <= 25) return 'moreCompact';
  if (count <= 30) return 'maxFit';
  if (count <= 35) return 'ultraMaxFit';

  return 'multiPage';
};

const getModeConfig = (mode) => {
  const configs = {
    normal: {
      pagePadding: '7mm 8mm',
      baseFont: 8.8,
      smallFont: 8,
      companyFont: 15,
      titleFont: 11,
      tableHeaderFont: 8.6,
      tableBodyFont: 8.6,
      tablePadding: '4px 5px',
      tableHeaderPadding: '4px 5px',
      paymentPadding: '6px 8px',
      paymentMinHeight: '62px',
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
      titleFont: 10.2,
      tableHeaderFont: 7.8,
      tableBodyFont: 7.8,
      tablePadding: '3px 4px',
      tableHeaderPadding: '3px 4px',
      paymentPadding: '5px 7px',
      paymentMinHeight: '56px',
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
      titleFont: 9.8,
      tableHeaderFont: 7.3,
      tableBodyFont: 7.3,
      tablePadding: '2.5px 4px',
      tableHeaderPadding: '3px 4px',
      paymentPadding: '5px 6px',
      paymentMinHeight: '52px',
      footerFont: 6.9,
      logoSize: 50,
      signatureWidth: 74,
      signatureHeight: 25,
      inlineDescription: true,
    },

    moreCompact: {
      pagePadding: '5.5mm 6.5mm',
      baseFont: 7.2,
      smallFont: 6.9,
      companyFont: 13,
      titleFont: 9.4,
      tableHeaderFont: 7,
      tableBodyFont: 7,
      tablePadding: '2px 3px',
      tableHeaderPadding: '2.5px 3px',
      paymentPadding: '4px 6px',
      paymentMinHeight: '48px',
      footerFont: 6.7,
      logoSize: 48,
      signatureWidth: 70,
      signatureHeight: 24,
      inlineDescription: true,
    },

    maxFit: {
      pagePadding: '5mm 6mm',
      baseFont: 6.9,
      smallFont: 6.8,
      companyFont: 12.5,
      titleFont: 9,
      tableHeaderFont: 6.8,
      tableBodyFont: 6.8,
      tablePadding: '1.6px 3px',
      tableHeaderPadding: '2px 3px',
      paymentPadding: '4px 5px',
      paymentMinHeight: '44px',
      footerFont: 6.5,
      logoSize: 44,
      signatureWidth: 66,
      signatureHeight: 22,
      inlineDescription: true,
    },

    ultraMaxFit: {
      pagePadding: '4.5mm 5.5mm',
      baseFont: 6.8,
      smallFont: 6.8,
      companyFont: 12,
      titleFont: 8.8,
      tableHeaderFont: 6.8,
      tableBodyFont: 6.8,
      tablePadding: '1.2px 2.6px',
      tableHeaderPadding: '1.8px 2.6px',
      paymentPadding: '3px 4px',
      paymentMinHeight: '40px',
      footerFont: 6.4,
      logoSize: 42,
      signatureWidth: 62,
      signatureHeight: 20,
      inlineDescription: true,
    },

    multiPage: {
      pagePadding: '6mm 7mm',
      baseFont: 7,
      smallFont: 6.9,
      companyFont: 13,
      titleFont: 9.2,
      tableHeaderFont: 6.9,
      tableBodyFont: 6.9,
      tablePadding: '2px 3px',
      tableHeaderPadding: '2px 3px',
      paymentPadding: '4px 5px',
      paymentMinHeight: '46px',
      footerFont: 6.6,
      logoSize: 48,
      signatureWidth: 70,
      signatureHeight: 24,
      inlineDescription: true,
    },
  };

  return configs[mode] || configs.normal;
};

const getValidityText = (validity) => {
  if (!validity) return '';

  const value = String(validity);

  if (value.toLowerCase().includes('day')) {
    return value;
  }

  return `${value} days`;
};

const getItemAmount = (item) => {
  return num(item?.quantity) * num(item?.unitPrice);
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
        <td colspan="5" class="empty-row">No item added</td>
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

const renderItemsTable = (items, config, startIndex = 0, title = 'Item Details') => {
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

export const generateQuotationHTML = (data = {}) => {
  const parsedCompanyContact = extractEmailPhoneFromContact(data.companyContact);

  const companyName = safe(data.companyName, 'Company Name');
  const companyAddress = safe(data.companyAddress);
  const companyEmail = safe(data.companyEmail || parsedCompanyContact.email);
  const companyPhone = safe(data.companyPhone || parsedCompanyContact.phone);

  const clientName = safe(data.clientName);
  const clientCompany = safe(data.clientCompany);
  const clientEmail = safe(data.clientEmail);
  const clientAddress = safe(data.clientAddress);
  const clientPhone = safe(data.clientPhone);

  const quotationDate = safe(data.date);
  const quotationNumber = safe(data.quotationNumber);
  const validity = safe(data.validity);

  const paymentTerms = safe(data.paymentTerms);
  const paymentMethod = safe(data.paymentMethod);
  const mobilePaymentInfo = safe(data.mobilePaymentInfo);
  const notes = safe(data.notes);

  const logoBase64 = safe(data.logoBase64);
  const signatureBase64 = safe(data.signatureBase64);
  const signatureText = safe(data.signature);

  const items = buildItems(data.services || data.items || []);
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
    data.taxPercentage !== undefined ? num(data.taxPercentage) : num(data.tax || 0);

  const taxableAmount = subtotal - discount;

  const taxAmount =
    data.taxAmount !== undefined
      ? num(data.taxAmount)
      : (taxableAmount * taxPercent) / 100;

  const grandTotal =
    data.grandTotal !== undefined ? num(data.grandTotal) : taxableAmount + taxAmount;

  const logoHTML = logoBase64
    ? `<img class="logo-img" src="data:image/jpeg;base64,${logoBase64}" alt="Logo" />`
    : '';

  const signatureHTML = signatureBase64
    ? `<img class="signature-img" src="data:image/jpeg;base64,${signatureBase64}" alt="Signature" />`
    : signatureText
    ? `<div class="signature-text">${escapeHtml(signatureText)}</div>`
    : '<div class="signature-blank"></div>';

  const headerHTML = `
    <div class="header">
      <div class="top-header">
        <div class="company-block">
          <h1 class="company-name">${escapeHtml(companyName)}</h1>
          <p class="company-subtitle">Item Service</p>

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

        <div class="logo-wrap">
          ${logoHTML}
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
            clientAddress
              ? `<p class="info-line"><span class="info-label">Address:</span> ${nl2br(clientAddress)}</p>`
              : ''
          }

          ${
            clientPhone
              ? `<p class="info-line"><span class="info-label">Contact:</span> ${escapeHtml(clientPhone)}</p>`
              : ''
          }
        </div>

        <div class="quote-meta">
          ${
            quotationDate
              ? `
                <div class="meta-row">
                  <p class="meta-label">Quotation Date:</p>
                  <p class="meta-value">${escapeHtml(quotationDate)}</p>
                </div>
              `
              : ''
          }

          ${
            quotationNumber
              ? `
                <div class="meta-row">
                  <p class="meta-label">Quotation No:</p>
                  <p class="meta-value">${escapeHtml(quotationNumber)}</p>
                </div>
              `
              : ''
          }

          ${
            validity
              ? `
                <div class="meta-row">
                  <p class="meta-label">Validity:</p>
                  <p class="meta-value">${escapeHtml(getValidityText(validity))}</p>
                </div>
              `
              : ''
          }
        </div>
      </div>
    </div>
  `;

  const miniHeaderHTML = (pageNumber) => `
    <div class="mini-header">
      <div>
        <strong>${escapeHtml(companyName)}</strong>
        ${
          quotationNumber
            ? `<span class="mini-muted"> | Quotation No: ${escapeHtml(quotationNumber)}</span>`
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
        <span>Net Amount</span>
        <span>${formatMoney(grandTotal)}</span>
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
        <p class="thanks-line"><span class="heart">❤</span> THANKS FOR YOUR INQUIRY!</p>
        <p class="notes-text">
          <strong>Notes:</strong> ${nl2br(notes || 'No additional notes added.')}
        </p>
      </div>

      <div class="bottom-footer">
        <p class="footer-text">If you have any questions about this Quotation, please contact with us</p>

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
        ${renderItemsTable(items, config, 0, 'Item Details')}
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
                isFirst ? 'Item Details' : 'Item Details Continued'
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
  <title>Quotation</title>

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

    .header {
      flex-shrink: 0;
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
      width: 74%;
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
      font-size: ${config.titleFont}px;
      line-height: 1.02;
      font-weight: 700;
    }

    .company-info-line {
      margin: 0;
      font-size: ${config.smallFont}px;
      line-height: 1.08;
    }

    .logo-wrap {
      width: ${config.logoSize}px;
      text-align: right;
    }

    .logo-img {
      max-width: ${config.logoSize}px;
      max-height: ${config.logoSize}px;
      object-fit: contain;
      display: inline-block;
    }

    .header-info {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }

    .billto {
      width: 62%;
    }

    .quote-meta {
      width: 26%;
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
    }

    .meta-label {
      margin: 0;
      font-size: ${config.smallFont}px;
      line-height: 1.02;
      font-weight: 900;
    }

    .meta-value {
      margin: 0;
      font-size: ${config.smallFont}px;
      line-height: 1.02;
      font-weight: 700;
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
      font-size: ${config.titleFont}px;
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
      padding: ${config.tableHeaderPadding};
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