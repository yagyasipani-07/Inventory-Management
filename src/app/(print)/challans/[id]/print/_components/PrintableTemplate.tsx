import { Challan } from '@/src/app/(dashboard)/challans/_services/challanService';
import { format } from 'date-fns';

// ─── Client-specified company constants ───────────────────────────────────────
const COMPANY_NAME    = 'Decorative Panels & Doors Pvt. Ltd.';
const COMPANY_ADDRESS = 'No. 274/2 & 274/3-1, New Timber Yard Layout,\nMysore Road, Bangalore – 560026';
const COMPANY_GST     = '29AAECD4720H1ZQ';
const COMPANY_MOBILE  = '9739117766';
const SUPABASE_URL    = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const STORAGE_BUCKET  = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'paras-plywoods-bucket';

function getProductImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath || !SUPABASE_URL) return null;
  // imagePath is stored as a relative path in Supabase Storage
  if (imagePath.startsWith('http')) return imagePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${imagePath}`;
}

interface PrintableTemplateProps {
  challan: Challan;
}

export function PrintableTemplate({ challan }: PrintableTemplateProps) {
  return (
    <div className="bg-white text-black p-4 w-[148mm] min-h-[210mm] mx-auto font-sans text-[10px]">

      {/* ── Company Header ─────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
        {/* Left: Logo & Company details */}
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 border-2 border-black flex items-center justify-center font-bold text-lg shrink-0 rounded-sm">
            DP&D
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wide leading-tight">
              {COMPANY_NAME}
            </h1>
            <div className="text-[9px] text-gray-700 mt-0.5 whitespace-pre-line leading-snug">
              {COMPANY_ADDRESS}
            </div>
            <div className="text-[9px] text-gray-700 mt-0.5">
              <span className="font-semibold">GST:</span> {COMPANY_GST} | <span className="font-semibold">Mob:</span> {COMPANY_MOBILE}
            </div>
          </div>
        </div>

        {/* Right: Document title + Challan info */}
        <div className="text-right shrink-0 ml-2">
          <h2 className="text-lg font-bold uppercase text-gray-500 mb-1">
            Delivery Challan
          </h2>
          <table className="text-[9px] text-left ml-auto">
            <tbody>
              <tr>
                <td className="font-semibold pr-2 py-0 whitespace-nowrap">Challan No:</td>
                <td className="py-0">{challan.challanNumber}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-2 py-0 whitespace-nowrap">Date:</td>
                <td className="py-0">
                  {format(new Date(challan.createdAt), 'dd-MMM-yyyy')}
                </td>
              </tr>
              {challan.dispatchDate && (
                <tr>
                  <td className="font-semibold pr-2 py-0 whitespace-nowrap">Dispatch Date:</td>
                  <td className="py-0">
                    {format(new Date(challan.dispatchDate), 'dd-MMM-yyyy')}
                  </td>
                </tr>
              )}
              {challan.vehicleNumber && (
                <tr>
                  <td className="font-semibold pr-2 py-0 whitespace-nowrap">Vehicle No:</td>
                  <td className="py-0">{challan.vehicleNumber}</td>
                </tr>
              )}
              {challan.transportName && (
                <tr>
                  <td className="font-semibold pr-2 py-0 whitespace-nowrap">Transport:</td>
                  <td className="py-0">{challan.transportName}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Customer / Bill To ─────────────────────────────────────────────── */}
      <div className="mb-2 border border-gray-300 p-2 rounded-sm">
        <div className="text-[9px] font-bold text-gray-500 uppercase border-b border-gray-200 pb-0.5 mb-1">
          Consignee (Ship To)
        </div>
        <p className="font-bold text-[11px] leading-tight">{challan.customerName}</p>
      </div>

      {/* ── Products Table ─────────────────────────────────────────────────── */}
      <div className="mb-2 min-h-[90mm]">
        <table className="w-full text-[9px] border-collapse">
          <thead>
            <tr className="bg-gray-100 border-y border-black">
              <th className="py-1 px-1 text-center w-6 border-r border-gray-400">Sl</th>
              <th className="py-1 px-1 text-center w-10 border-r border-gray-400">Image</th>
              <th className="py-1 px-1 text-center border-r border-gray-400 w-16">Code</th>
              <th className="py-1 px-1 text-left border-r border-gray-400">Description</th>
              <th className="py-1 px-1 text-center border-r border-gray-400 w-10">Qty</th>
              <th className="py-1 px-1 text-center border-r border-gray-400 w-12">Rate</th>
              <th className="py-1 px-1 text-center w-14">Amount</th>
            </tr>
          </thead>
          <tbody>
            {challan.items.map((item, index) => {
              const imageUrl = getProductImageUrl(item.productImagePath);
              return (
                <tr key={item.id} className="border-b border-gray-200 align-middle">
                  <td className="py-1.5 px-1 text-center border-r border-gray-300 align-middle">
                    {index + 1}
                  </td>
                  <td className="py-1.5 px-1 text-center border-r border-gray-300 align-middle">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={item.productName} className="w-8 h-8 object-contain mx-auto border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 mx-auto border border-gray-200 flex items-center justify-center text-gray-300 text-[7px]">Img</div>
                    )}
                  </td>
                  <td className="py-1.5 px-1 text-center border-r border-gray-300 align-middle font-mono">
                    {item.productCode || '—'}
                  </td>
                  <td className="py-1.5 px-1 border-r border-gray-300 align-middle">
                    <span className="font-medium block">{item.productName}</span>
                    {(item.thickness || item.size) && (
                      <span className="text-gray-500 block text-[8px] mt-0.5">
                        {[item.thickness, item.size].filter(Boolean).join(' | ')}
                      </span>
                    )}
                  </td>
                  <td className="py-1.5 px-1 text-center border-r border-gray-300 align-middle font-semibold">
                    {item.quantity}
                  </td>
                  <td className="py-1.5 px-1 border-r border-gray-300 align-middle" />
                  <td className="py-1.5 px-1 align-middle" />
                </tr>
              );
            })}

            {/* Empty padding rows to fill height */}
            {Array.from({ length: Math.max(0, 5 - challan.items.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="border-b border-gray-100">
                <td className="py-3 border-r border-gray-300">&nbsp;</td>
                <td className="py-3 border-r border-gray-300" />
                <td className="py-3 border-r border-gray-300" />
                <td className="py-3 border-r border-gray-300" />
                <td className="py-3 border-r border-gray-300" />
                <td className="py-3 border-r border-gray-300" />
                <td className="py-3" />
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-y-2 border-black font-bold bg-gray-50">
              <td colSpan={4} className="py-1.5 px-1 text-right border-r border-gray-400">
                TOTAL
              </td>
              <td className="py-1.5 px-1 text-center border-r border-gray-400">
                {challan.totalQuantity}
              </td>
              <td className="py-1.5 border-r border-gray-400" />
              <td className="py-1.5" />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Notes ──────────────────────────────────────────────────────────── */}
      {challan.notes && (
        <div className="mb-4 p-1.5 bg-gray-50 border border-gray-200 rounded-sm">
          <span className="font-bold">Remarks: </span>
          {challan.notes}
        </div>
      )}

      {/* ── Footer: Signature Only ──────────────────────────────────────── */}
      <div className="mt-4 pt-2 border-t border-gray-300 flex justify-end">
        <div className="w-40 text-center border border-gray-300 p-1.5 flex flex-col justify-between min-h-[60px]">
          <p className="font-bold text-[9px] uppercase text-gray-500 text-left">
            For {COMPANY_NAME}
          </p>
          <div className="mt-8 text-[9px] border-t border-gray-400 pt-0.5">
            Authorised Signatory
          </div>
        </div>
      </div>

      {/* ── Print Button (hidden when printing) ────────────────────────────── */}
      <div className="mt-6 text-center print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-4 py-1.5 rounded-md font-medium hover:bg-gray-800 transition-colors text-sm"
        >
          Print Document
        </button>
      </div>
    </div>
  );
}
