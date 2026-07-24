export type NavItem = {
  title: string;
  href: string;
  icon: string;
  badge?: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type StatCardData = {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
};

export type DialogState = {
  open: boolean;
  data?: Record<string, unknown>;
};
