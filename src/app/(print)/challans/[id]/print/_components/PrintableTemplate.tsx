import { Challan } from '@/src/app/(dashboard)/challans/_services/challanService';
import { format } from 'date-fns';

interface PrintableTemplateProps {
  challan: Challan;
}

export function PrintableTemplate({ challan }: PrintableTemplateProps) {
  return (
    <div className="bg-white text-black p-8 max-w-[210mm] mx-auto min-h-[297mm]">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-wider">Paras Plywoods</h1>
          <p className="text-sm mt-1">123 Timber Market, Industrial Area</p>
          <p className="text-sm">New Delhi, 110001</p>
          <p className="text-sm">Ph: +91 98765 43210</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase text-gray-600 mb-2">Delivery Challan</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-left inline-grid">
            <span className="font-semibold">Challan No:</span>
            <span>{challan.challanNumber}</span>
            <span className="font-semibold">Created Date:</span>
            <span>{format(new Date(challan.createdAt), 'dd-MMM-yyyy')}</span>
            {challan.dispatchDate && (
              <>
                <span className="font-semibold">Dispatch Date:</span>
                <span>{format(new Date(challan.dispatchDate), 'dd-MMM-yyyy')}</span>
              </>
            )}
            <span className="font-semibold">Transport:</span>
            <span>{challan.transport || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6 border border-gray-300 p-4 rounded-sm">
        <h3 className="font-bold text-gray-700 uppercase text-sm border-b pb-1 mb-2">Bill To / Ship To</h3>
        <p className="font-bold text-lg">{challan.customerName}</p>
        <p className="text-sm mt-1">{challan.city}</p>
      </div>

      {/* Items Table */}
      <div className="min-h-[400px]">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 border-y border-black">
              <th className="py-2 px-2 text-left w-12 border-r border-gray-300">S.No</th>
              <th className="py-2 px-2 text-left border-r border-gray-300">Description of Goods</th>
              <th className="py-2 px-2 text-right w-24 border-r border-gray-300">Quantity</th>
              <th className="py-2 px-2 text-right w-32 border-r border-gray-300">Rate</th>
              <th className="py-2 px-2 text-right w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {challan.items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-2 border-r border-gray-300 text-center">{index + 1}</td>
                <td className="py-3 px-2 border-r border-gray-300">
                  <span className="font-medium">{item.productName}</span>
                  <div className="text-xs text-gray-600 mt-1">Size: {item.size} | Thick: {item.thickness}</div>
                </td>
                <td className="py-3 px-2 text-right border-r border-gray-300 font-medium">{item.quantity}</td>
                <td className="py-3 px-2 text-right border-r border-gray-300"></td>
                <td className="py-3 px-2 text-right font-medium"></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-y-2 border-black font-bold">
              <td colSpan={2} className="py-2 px-2 text-right border-r border-gray-300">TOTAL</td>
              <td className="py-2 px-2 text-right border-r border-gray-300">{challan.totalQuantity}</td>
              <td className="py-2 px-2 border-r border-gray-300"></td>
              <td className="py-2 px-2 text-right"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="mt-8 pt-4 border-t border-gray-300 flex justify-between text-sm">
        <div className="w-1/2">
          <p className="font-bold mb-1">Terms & Conditions:</p>
          <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
            <li>Goods once sold will not be taken back.</li>
            <li>Subject to Delhi Jurisdiction only.</li>
            <li>Interest @24% p.a. will be charged if bill is not paid within 30 days.</li>
          </ul>
        </div>
        <div className="w-1/3 text-center border border-gray-300 p-2 flex flex-col justify-between">
          <p className="font-bold text-xs uppercase text-gray-500 text-left">For Paras Plywoods</p>
          <div className="mt-12 text-xs border-t border-gray-400 pt-1">
            Authorized Signatory
          </div>
        </div>
      </div>

      {challan.notes && (
        <div className="mt-4 p-2 bg-gray-50 text-xs border border-gray-200">
          <span className="font-bold">Remarks:</span> {challan.notes}
        </div>
      )}

      {/* Print Button (Hidden in actual print) */}
      <div className="mt-8 text-center print:hidden">
        <button 
          onClick={() => window.print()} 
          className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Print Document
        </button>
      </div>
    </div>
  );
}
