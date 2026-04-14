// src/templates/quotationTemplate.js: 

export const generateQuotationHTML = (data) => {

  const itemsHTML = data.services.map((item, index) => {
    const total = (item.quantity * item.unitPrice);
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>${item.quantity}</td>
        <td>${item.unitPrice}</td>
        <td>${total}</td>
      </tr>
    `;
  }).join('');

  return `
  <html>
    <body style="font-family: Arial; padding: 20px;">

      <h2>${data.companyName}</h2>
      <p>${data.companyAddress}</p>
      <p>${data.companyContact}</p>

      <h1 style="text-align:center;">QUOTATION</h1>

      <p>Quotation No: ${data.quotationNumber}</p>
      <p>Date: ${data.date}</p>
      <p>Validity: ${data.validity}</p>

      <h3>Bill To:</h3>
      <p>${data.clientName}</p>
      <p>${data.clientCompany}</p>
      <p>${data.clientAddress}</p>

      <table border="1" width="100%" cellspacing="0" cellpadding="8">
        <tr>
          <th>#</th>
          <th>Service</th>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
        ${itemsHTML}
      </table>

      <h3>Subtotal: ${data.subtotal}</h3>
      <h3>Discount: ${data.discount}</h3>
      <h3>Tax: ${data.tax}</h3>
      <h2>Total: ${data.grandTotal}</h2>

      <h3>Payment Terms</h3>
      <p>${data.paymentTerms}</p>

      <h3>Payment Method</h3>
      <p>${data.paymentMethod}</p>

      <h3>Signature</h3>
      <p>${data.signature}</p>

      <h3>Notes</h3>
      <p>${data.notes}</p>

    </body>
  </html>
  `;
};