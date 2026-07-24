'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/src/hooks/useNetworkStatus';
import { motion, AnimatePresence } from 'framer-motion';

export function NetworkStatus() {
  const { isOnline } = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-2 pointer-events-none"
        >
          <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto text-sm font-medium">
            <WifiOff className="w-4 h-4" />
            <span>You are currently offline. Check your connection.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
