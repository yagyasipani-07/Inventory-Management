"use client";

import { useCompanySettings, usePrintSettings } from "../_hooks/useSettings";

export function LivePrintPreview() {
  const { data: companySettings } = useCompanySettings();
  const { data: printSettings } = usePrintSettings();

  if (!companySettings || !printSettings) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-muted/30">
        <span className="text-sm text-muted-foreground">Loading preview...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-border bg-muted/20 p-4">
      <h3 className="mb-4 text-sm font-medium text-foreground">Live Preview</h3>
      
      {/* Paper Mockup */}
      <div className="mx-auto flex w-full max-w-sm flex-col rounded bg-white p-6 shadow-sm ring-1 ring-black/5" style={{ aspectRatio: '1 / 1.414' }}>
        
        {/* Header Area */}
        {printSettings.printHeader && (
          <div className="mb-6 flex items-start justify-between border-b pb-4 border-slate-200">
            <div>
              {printSettings.companyLogo ? (
                <div className="mb-2 h-10 w-24 rounded bg-slate-100 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400 font-medium">LOGO</span>
                </div>
              ) : null}
              <h4 className="text-sm font-bold text-slate-800">{companySettings.businessName}</h4>
              <div className="mt-1 flex flex-col gap-0.5 text-[8px] text-slate-500">
                <span>{companySettings.city}, {companySettings.state}</span>
                {companySettings.gstNumber && <span>GST: {companySettings.gstNumber}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-widest">CHALLAN</div>
              <div className="mt-1 text-[8px] text-slate-500">Date: {new Date().toLocaleDateString()}</div>
              <div className="text-[8px] text-slate-500">No: DUMMY-001</div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1">
          <div className="mb-4 text-[9px] font-medium text-slate-700">Bill To:</div>
          <div className="mb-4 h-12 w-32 rounded bg-slate-50"></div>

          <div className="w-full border border-slate-200">
            <div className="flex border-b border-slate-200 bg-slate-50 p-1 text-[8px] font-semibold text-slate-600">
              <div className="flex-1">Item Description</div>
              <div className="w-12 text-right">Qty</div>
              <div className="w-16 text-right">Amount</div>
            </div>
            <div className="flex border-b border-slate-100 p-1 text-[8px] text-slate-600">
              <div className="flex-1">Plywood 18mm</div>
              <div className="w-12 text-right">50</div>
              <div className="w-16 text-right">₹ 2,500</div>
            </div>
            <div className="flex p-1 text-[8px] text-slate-600">
              <div className="flex-1">Teak Wood</div>
              <div className="w-12 text-right">120</div>
              <div className="w-16 text-right">₹ 14,400</div>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        {printSettings.printFooter && (
          <div className="mt-6 flex items-end justify-between border-t pt-4 border-slate-200">
            <div className="text-[7px] text-slate-400">
              {printSettings.companyFooter && (
                <>
                  <p className="font-semibold text-slate-500">Terms & Conditions:</p>
                  <ul className="ml-2 list-disc">
                    <li>Goods once sold will not be taken back.</li>
                    <li>Subject to {companySettings.city} jurisdiction.</li>
                  </ul>
                </>
              )}
            </div>
            <div className="flex flex-col items-center gap-4">
              {printSettings.showCompanyStampArea && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-slate-300 text-[8px] text-slate-300">
                  Stamp
                </div>
              )}
              {printSettings.authorizedSignature && (
                <div className="text-center">
                  <div className="mb-1 h-px w-24 bg-slate-800"></div>
                  <span className="text-[7px] font-medium text-slate-600">Authorized Signatory</span>
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
