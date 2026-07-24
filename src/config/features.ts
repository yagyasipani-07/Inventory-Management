export const features = {
  enableAuth: process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true',
  enableRealtimeSync: false,
  enableAdvancedAudit: true,
} as const;
