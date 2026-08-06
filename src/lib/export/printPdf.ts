import { ExportDataset, getGroupField } from "@/src/app/(dashboard)/export/_services/exportService";

type ReportRow = Record<string, unknown>;

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export async function printPdfReport(title: string, rows: ReportRow[], filename: string, dataset?: string, groupBy?: string): Promise<boolean> {
  const columns = Object.keys(rows[0] || {});
  const generatedOn = new Date().toLocaleString();

  let tableHtml = '';
  const groupKey = getGroupField((dataset as ExportDataset) || "Inventory", groupBy || null);
  let usedFallback = false;
  
  if (rows.length === 0) {
    tableHtml = '<p class="empty">No data available.</p>';
  } else if (groupKey) {
    const groupedData: Record<string, ReportRow[]> = {};
    
    rows.forEach(row => {
      const groupValue = String(row[groupKey] || "Unknown");
      if (!groupedData[groupValue]) groupedData[groupValue] = [];
      groupedData[groupValue].push(row);
    });

    const groupKeys = Object.keys(groupedData);

    if (groupKeys.length > 20) {
      usedFallback = true;
      // Fallback: render one flat table with divider rows
      tableHtml += `
        <table>
          <thead>
            <tr>
              ${columns.map(col => `<th>${escapeHtml(col)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
      `;
      let currentGroup: string | null = null;
      rows.forEach(row => {
        const rowGroup = String(row[groupKey] || "Unknown");
        if (rowGroup !== currentGroup) {
          currentGroup = rowGroup;
          tableHtml += `
            <tr class="group-divider">
              <td colspan="${columns.length}" style="background-color: #f3f4f6; font-weight: bold; padding: 12px 8px; text-align: left;">
                --- Group: ${escapeHtml(currentGroup)} ---
              </td>
            </tr>
          `;
        }
        tableHtml += `
          <tr>
            ${columns.map(col => `<td>${escapeHtml(row[col])}</td>`).join('')}
          </tr>
        `;
      });
      tableHtml += `
          </tbody>
        </table>
      `;
    } else {
      for (let i = 0; i < groupKeys.length; i++) {
        const groupValue = groupKeys[i];
        const groupRows = groupedData[groupValue];
        
        tableHtml += `
          <div class="group-section">
            <div class="group-title">Group: ${escapeHtml(groupValue)}</div>
            <table>
              <thead>
                <tr>
                  ${columns.map(col => `<th>${escapeHtml(col)}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${groupRows.map(row => `
                  <tr>
                    ${columns.map(col => `<td>${escapeHtml(row[col])}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

        if ((i + 1) % 5 === 0) {
          await new Promise(r => setTimeout(r, 0));
        }
      }
    }
  } else {
    tableHtml = `
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) =>
                `<tr>${columns
                  .map((column) => `<td>${escapeHtml(row[column])}</td>`)
                  .join('')}</tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Unable to open print window');
  }

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${escapeHtml(filename)}</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: Arial, sans-serif; color: #111827; margin: 0; }
          header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
          h1 { font-size: 20px; margin: 0 0 4px; }
          .meta { color: #6b7280; font-size: 11px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { border: 1px solid #d1d5db; padding: 7px 8px; text-align: left; vertical-align: top; }
          th { background: #f3f4f6; font-weight: 700; }
          tr:nth-child(even) td { background: #fafafa; }
          .empty { border: 1px dashed #d1d5db; padding: 24px; text-align: center; color: #6b7280; }
          .actions { margin-top: 18px; text-align: center; }
          button { border: 0; background: #111827; color: white; padding: 9px 16px; border-radius: 6px; cursor: pointer; }
          @media print { .actions { display: none; } }
        </style>
      </head>
      <body>
        <header>
          <div>
            <h1>${escapeHtml(title)}</h1>
            <div class="meta">Paras Plywoods ERP</div>
          </div>
          <div class="meta">Generated on ${escapeHtml(generatedOn)}</div>
        </header>
        ${tableHtml}
        <div class="actions"><button onclick="window.print()">Save as PDF / Print</button></div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();

  return usedFallback;
}
