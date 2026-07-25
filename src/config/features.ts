export const featuresConfig = {
  enableAudit: true,
  enableExport: false,
  enableImport: true,
  enablePrinting: true,
  enableImages: false,
  enableAuthentication: process.env.NEXT_PUBLIC_AUTH_ENABLED === "true",
};
