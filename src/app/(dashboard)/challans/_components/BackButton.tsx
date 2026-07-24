'use client';

import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label?: string;
}

export function BackButton({ href, label = "Back" }: BackButtonProps) {
  return (
    <Button variant="outline" asChild>
      <Link href={href}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}
