// src/templates/quotationTemplate.js: 

export const generateQuotationHTML = (data) => {
  const { clientName, items, total } = data;

  const itemsHTML = items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.price}</td>
        </tr>
      `
    )
    .join('');

  return `
    <html>
      <body style="font-family: Arial; padding: 20px;">
        <h1 style="text-align: center;">Quotation</h1>

        <p><strong>Client Name:</strong> ${clientName}</p>

        <table border="1" cellspacing="0" cellpadding="10" width="100%">
          <thead>
            <tr>
              <th>#</th>
              <th>Service</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <h2 style="text-align: right;">Total: ${total}</h2>
      </body>
    </html>
  `;
};