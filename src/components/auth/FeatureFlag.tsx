'use client';

import React from 'react';
import { featuresConfig } from '@/src/config';

type FeatureKey = keyof typeof featuresConfig;

export function FeatureFlag({ feature, children, fallback = null }: { feature: FeatureKey, children: React.ReactNode, fallback?: React.ReactNode }) {
  const isEnabled = featuresConfig[feature];

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
