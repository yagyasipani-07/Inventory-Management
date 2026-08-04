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
    <div className="bg-white text-black p-8 max-w-[210mm] mx-auto min-h-[297mm] font-sans">

      {/* ── Company Header ─────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
        {/* Left: Company details */}
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wide leading-tight">
            {COMPANY_NAME}
          </h1>
          <div className="text-xs text-gray-700 mt-1 whitespace-pre-line leading-relaxed">
            {COMPANY_ADDRESS}
          </div>
          <div className="text-xs text-gray-700 mt-1">
            <span className="font-semibold">GST:</span> {COMPANY_GST}
          </div>
          <div className="text-xs text-gray-700">
            <span className="font-semibold">Mobile:</span> {COMPANY_MOBILE}
          </div>
        </div>

        {/* Right: Document title + Challan info */}
        <div className="text-right shrink-0 ml-6">
          <h2 className="text-2xl font-bold uppercase text-gray-500 mb-3">
            Delivery Challan
          </h2>
          <table className="text-xs text-left ml-auto">
            <tbody>
              <tr>
                <td className="font-semibold pr-3 py-0.5 whitespace-nowrap">Challan No:</td>
                <td className="py-0.5">{challan.challanNumber}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-3 py-0.5 whitespace-nowrap">Date:</td>
                <td className="py-0.5">
                  {format(new Date(challan.createdAt), 'dd-MMM-yyyy')}
                </td>
              </tr>
              {challan.dispatchDate && (
                <tr>
                  <td className="font-semibold pr-3 py-0.5 whitespace-nowrap">Dispatch Date:</td>
                  <td className="py-0.5">
                    {format(new Date(challan.dispatchDate), 'dd-MMM-yyyy')}
                  </td>
                </tr>
              )}
              {challan.vehicleNumber && (
                <tr>
                  <td className="font-semibold pr-3 py-0.5 whitespace-nowrap">Vehicle No:</td>
                  <td className="py-0.5">{challan.vehicleNumber}</td>
                </tr>
              )}
              {challan.transportName && (
                <tr>
                  <td className="font-semibold pr-3 py-0.5 whitespace-nowrap">Transport:</td>
                  <td className="py-0.5">{challan.transportName}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Customer / Bill To ─────────────────────────────────────────────── */}
      <div className="mb-4 border border-gray-300 p-3 rounded-sm">
        <div className="text-xs font-bold text-gray-500 uppercase border-b border-gray-200 pb-1 mb-2">
          Consignee (Ship To)
        </div>
        <p className="font-bold text-base leading-tight">{challan.customerName}</p>
      </div>

      {/* ── Products Table ─────────────────────────────────────────────────── */}
      <div className="mb-4">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 border-y border-black">
              <th className="py-2 px-1 text-center w-8 border-r border-gray-400">
                Sl.<br />No.
              </th>
              <th className="py-2 px-2 text-left border-r border-gray-400 w-[35%]">
                Description of Goods
              </th>
              <th className="py-2 px-1 text-center w-16 border-r border-gray-400">
                Image
              </th>
              <th className="py-2 px-2 text-center border-r border-gray-400 w-24">
                Product Code
              </th>
              <th className="py-2 px-2 text-center border-r border-gray-400 w-16">
                Quantity
              </th>
              <th className="py-2 px-2 text-center border-r border-gray-400 w-16">
                Rate
              </th>
              <th className="py-2 px-2 text-center w-20">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {challan.items.map((item, index) => {
              const imageUrl = getProductImageUrl(item.productImagePath);
              return (
                <tr key={item.id} className="border-b border-gray-200 align-middle">
                  {/* Sl. No. */}
                  <td className="py-2 px-1 text-center border-r border-gray-300 align-middle">
                    {index + 1}
                  </td>

                  {/* Description */}
                  <td className="py-2 px-2 border-r border-gray-300 align-middle">
                    <span className="font-medium block">{item.productName}</span>
                    {(item.thickness || item.size) && (
                      <span className="text-gray-500 block mt-0.5">
                        {[item.thickness, item.size].filter(Boolean).join(' | ')}
                      </span>
                    )}
                  </td>

                  {/* Product Image */}
                  <td className="py-2 px-1 text-center border-r border-gray-300 align-middle">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt={item.productName}
                        className="w-12 h-12 object-contain mx-auto border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 mx-auto border border-gray-200 flex items-center justify-center text-gray-300 text-[10px]">
                        No img
                      </div>
                    )}
                  </td>

                  {/* Product Code */}
                  <td className="py-2 px-2 text-center border-r border-gray-300 align-middle font-mono">
                    {item.productCode || '—'}
                  </td>

                  {/* Quantity */}
                  <td className="py-2 px-2 text-center border-r border-gray-300 align-middle font-semibold">
                    {item.quantity}
                  </td>

                  {/* Rate — intentionally blank per client spec */}
                  <td className="py-2 px-2 border-r border-gray-300 align-middle" />

                  {/* Amount — intentionally blank per client spec */}
                  <td className="py-2 px-2 align-middle" />
                </tr>
              );
            })}

            {/* Empty padding rows to fill A4 height */}
            {Array.from({ length: Math.max(0, 8 - challan.items.length) }).map((_, i) => (
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
              <td colSpan={4} className="py-2 px-2 text-right border-r border-gray-400 text-sm">
                TOTAL
              </td>
              <td className="py-2 px-2 text-center border-r border-gray-400">
                {challan.totalQuantity}
              </td>
              {/* Rate total — blank */}
              <td className="py-2 border-r border-gray-400" />
              {/* Amount total — blank */}
              <td className="py-2" />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── Notes ──────────────────────────────────────────────────────────── */}
      {challan.notes && (
        <div className="mb-4 p-2 bg-gray-50 border border-gray-200 text-xs rounded-sm">
          <span className="font-bold">Remarks: </span>
          {challan.notes}
        </div>
      )}

      {/* ── Footer: Terms + Signature ──────────────────────────────────────── */}
      <div className="mt-8 pt-4 border-t border-gray-300 flex justify-between items-start text-xs gap-4">
        <div className="flex-1">
          <p className="font-bold mb-1 text-sm">Terms &amp; Conditions:</p>
          <ul className="list-disc pl-4 text-gray-600 space-y-1">
            <li>Goods once dispatched will not be taken back without prior written approval.</li>
            <li>All disputes subject to Bangalore jurisdiction only.</li>
            <li>E. &amp; O.E.</li>
          </ul>
        </div>
        <div className="w-52 text-center border border-gray-300 p-2 flex flex-col justify-between min-h-[80px]">
          <p className="font-bold text-xs uppercase text-gray-500 text-left">
            For {COMPANY_NAME}
          </p>
          <div className="mt-12 text-xs border-t border-gray-400 pt-1">
            Authorised Signatory
          </div>
        </div>
      </div>

      {/* ── Print Button (hidden when printing) ────────────────────────────── */}
      <div className="mt-8 text-center print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors text-sm"
        >
          Print Document
        </button>
      </div>
    </div>
  );
}
