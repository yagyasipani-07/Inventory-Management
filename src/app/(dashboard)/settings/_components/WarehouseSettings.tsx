"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SectionCard } from "@/components/shared/section-card";
import { useWarehouseSettings } from "../_hooks/useSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  warehouseName: z.string().min(2, "Warehouse name is required"),
  warehouseCode: z.string().min(2, "Warehouse code is required"),
  defaultLocation: z.string().min(1, "Default location is required"),
  workingHours: z.string().min(1, "Working hours are required"),
  timezone: z.string().min(1, "Timezone is required"),
  defaultStockUnit: z.string().min(1, "Default stock unit is required"),
  enableLowStockAlerts: z.boolean(),
  enableStockReservation: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function WarehouseSettings() {
  const { data, update, isUpdating } = useWarehouseSettings();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      warehouseName: "",
      warehouseCode: "",
      defaultLocation: "",
      workingHours: "",
      timezone: "",
      defaultStockUnit: "",
      enableLowStockAlerts: true,
      enableStockReservation: false,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const onSubmit = (values: FormValues) => {
    update(values);
  };

  const isDirty = form.formState.isDirty;

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
        <span className="text-muted-foreground">Loading warehouse settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Warehouse Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure default warehouse operational preferences and alerts.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {isDirty && (
            <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
              <span className="font-medium">You have unsaved changes.</span>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => form.reset()}>
                  Discard
                </Button>
                <Button type="submit" size="sm" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}

          <SectionCard title="Basic Information">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="warehouseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Warehouse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="warehouseCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse Code</FormLabel>
                    <FormControl>
                      <Input placeholder="WH-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Stock Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Zone A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultStockUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Stock Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sheets">Sheets</SelectItem>
                        <SelectItem value="Pieces">Pieces</SelectItem>
                        <SelectItem value="Boxes">Boxes</SelectItem>
                        <SelectItem value="Sq.Ft">Sq.Ft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard title="Operations">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="workingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Working Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="09:00 AM - 06:00 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">IST (Asia/Kolkata)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">EST (America/New_York)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard title="Stock Policies">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="enableLowStockAlerts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Low Stock Alerts</FormLabel>
                      <FormDescription>
                        Receive notifications when item stock falls below its minimum reorder level.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enableStockReservation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Stock Reservation</FormLabel>
                      <FormDescription>
                        Automatically reserve stock when a sales order is created before dispatch.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={!isDirty || isUpdating}
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isDirty || isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
