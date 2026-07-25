import { env } from "./environment";

export const storageConfig = {
  defaultBucket: env.NEXT_PUBLIC_STORAGE_BUCKET,
  buckets: {
    productImages: "product-images",
    companyAssets: "company-assets",
    challans: "challans",
    imports: "imports",
    exports: "exports",
    backups: "backups",
  },
  maxFileSize: 5 * 1024 * 1024, // 5MB limit
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
};
