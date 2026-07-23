type LineItem = {
  productCode?: string | null
  qty?: number | null
  rate?: number | null
}

export function ChallanTemplate({ challanNumber, customerName, lineItems = [] }: { challanNumber: string; customerName: string; lineItems?: LineItem[] }) {
  const totalQty = (lineItems || []).reduce((sum, item) => sum + Number(item.qty || 0), 0)
  const totalAmount = (lineItems || []).reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0), 0)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', border: '1px solid #000', padding: 24 }}>
      <h2 style={{ textAlign: 'center' }}>Paras Plywoods</h2>
      <h3 style={{ textAlign: 'center' }}>Dispatch Challan</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div><strong>Customer:</strong> {customerName}</div>
        </div>
        <div>
          <div><strong>Challan No:</strong> {challanNumber}</div>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: 8 }}>Particular</th>
            <th style={{ border: '1px solid #000', padding: 8 }}>Qty</th>
            <th style={{ border: '1px solid #000', padding: 8 }}>Rate</th>
            <th style={{ border: '1px solid #000', padding: 8 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {(lineItems || []).map((item, index) => (
            <tr key={`${item.productCode}-${index}`}>
              <td style={{ border: '1px solid #000', padding: 8 }}>{item.productCode ?? 'Item'}</td>
              <td style={{ border: '1px solid #000', padding: 8 }}>{item.qty ?? 0}</td>
              <td style={{ border: '1px solid #000', padding: 8 }}>{item.rate ?? 0}</td>
              <td style={{ border: '1px solid #000', padding: 8 }}>{(Number(item.qty || 0) * Number(item.rate || 0)).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td style={{ border: '1px solid #000', padding: 8, fontWeight: 700 }}>Total</td>
            <td style={{ border: '1px solid #000', padding: 8, fontWeight: 700 }}>{totalQty}</td>
            <td style={{ border: '1px solid #000', padding: 8 }}></td>
            <td style={{ border: '1px solid #000', padding: 8, fontWeight: 700 }}>{totalAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
