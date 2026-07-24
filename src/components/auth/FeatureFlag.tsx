'use client';

import React from 'react';
import { features } from '@/src/config';

type FeatureKey = keyof typeof features;

export function FeatureFlag({ feature, children, fallback = null }: { feature: FeatureKey, children: React.ReactNode, fallback?: React.ReactNode }) {
  const isEnabled = features[feature];

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
