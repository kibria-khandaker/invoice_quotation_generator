// src/templates/quotationTemplate.js: 

export const generateQuotationHTML = (data) => {

  const itemsHTML = data.services.map((item, index) => {
    const total = (item.quantity * item.unitPrice);
    const Total_UniPrice = (item.quantity * item.unitPrice);
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.unitPrice}</td>
      </tr>
    `;
  }).join('');

  return `
  <html>
    <body style="font-family: Arial; padding: 20px;">

<!-- HEADER -->
<div style="display: flex; justify-content: space-between; align-items: flex-start;">

  <!-- LEFT -->
  <div style="width: 70%;">
    <h2 style="margin: 0;">${data.companyName}</h2>
    <p style="margin: 2px 0;">${data.companyAddress}</p>
    <p style="margin: 2px 0;">${data.companyContact}</p>
  </div>

  <!-- RIGHT (LOGO PLACEHOLDER) -->
  <div style="
    width: 80px;
    height: 80px;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 80px;
    font-size: 10px;
  ">
    Logo
  </div>

</div>


<!-- BILL TO + QUOTATION INFO -->
<div style="display: flex; justify-content: space-between; margin-top: 20px;">

  <!-- LEFT -->
  <div style="width: 48%;">
    <p><strong>Bill To:</strong></p>
    <p>${data.clientName}</p>
    <p>${data.clientCompany}</p>
    <p>${data.clientAddress}</p>
  </div>

  <!-- RIGHT -->
  <div style="width: 48%; text-align: right;">
    <p><strong>Quotation Info:</strong></p>
    <p>Quotation No: ${data.quotationNumber}</p>
    <p>Date: ${data.date}</p>
    <p>Validity: ${data.validity}</p>
  </div>

</div>

<!-- TITLE CENTER -->
<h1 style="text-align:center; margin-top: 20px;">QUOTATION</h1>


      <table border="1" width="100%" cellspacing="0" cellpadding="8">
        <tr>
          <th>#</th>
          <th>Service</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
        ${itemsHTML}
      </table>

<div style="width: 60%; margin-left: auto; margin-top: 20px;">

  <div style="display: flex; justify-content: space-between;">
    <p>Subtotal:</p>
    <p>${data.subtotal}</p>
  </div>

  <div style="display: flex; justify-content: space-between;">
    <p>Discount:</p>
    <p>${data.discount}</p>
  </div>

  <div style="display: flex; justify-content: space-between;">
    <p>Tax:</p>
    <p>${data.tax}</p>
  </div>

  <div style="display: flex; justify-content: space-between; border-top: 1px solid #000; margin-top: 8px;">
    <p><strong>Total:</strong></p>
    <p><strong>${data.grandTotal}</strong></p>
  </div>

</div>

<!-- PAYMENT -->
<div style="display: flex; justify-content: space-between; margin-top: 20px;">

  <div style="width: 48%;">
    <p><strong>Payment Terms</strong></p>
    <p>${data.paymentTerms}</p>
  </div>

  <div style="width: 48%;">
    <p><strong>Payment Method</strong></p>
    <p>${data.paymentMethod}</p>
  </div>

</div>

<!-- MOBILE PAYMENT -->
<div style="margin-top: 10px; white-space: pre-line;">
  <p>${data.mobilePaymentInfo}</p>
</div>

<!-- SIGNATURE -->
<div style="text-align: right; margin-top: 40px;">
  <p>________________________</p>
  <p>${data.signature}</p>
</div>

<!-- FOOTER -->
<div style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px;">

  <p><strong>Notes</strong></p>
  <p>${data.notes}</p>

  <p style="font-size: 10px; color: #666; margin-top: 10px;">
    * This is a system generated quotation. Terms may apply.
  </p>

    <p style="font-size: 10px; color: #666; margin-top: 10px; text-align:center;"> 
      all support By netkib.com & kibria.net 
    </p>

</div>

    </body>
  </html>
  `;
};