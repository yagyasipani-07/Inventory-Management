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
import { usePrintSettings } from "../_hooks/useSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LivePrintPreview } from "./LivePrintPreview";

const formSchema = z.object({
  companyLogo: z.boolean(),
  companyFooter: z.boolean(),
  authorizedSignature: z.boolean(),
  defaultPrinterName: z.string().min(2, "Printer name is required"),
  paperSize: z.string(),
  margins: z.string(),
  printHeader: z.boolean(),
  printFooter: z.boolean(),
  showCompanyStampArea: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function PrintSettings() {
  const { data, update, isUpdating } = usePrintSettings();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyLogo: true,
      companyFooter: true,
      authorizedSignature: true,
      defaultPrinterName: "",
      paperSize: "A4",
      margins: "Standard",
      printHeader: true,
      printFooter: true,
      showCompanyStampArea: true,
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
        <span className="text-muted-foreground">Loading print settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Print Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure how challans and reports are printed.
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

          <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              <SectionCard title="Printer Configuration">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="defaultPrinterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Printer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., HP LaserJet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paperSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paper Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select paper size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                            <SelectItem value="A5">A5 (148 × 210 mm)</SelectItem>
                            <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="margins"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Margins</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select margins" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Standard">Standard (1 inch)</SelectItem>
                            <SelectItem value="Narrow">Narrow (0.5 inch)</SelectItem>
                            <SelectItem value="None">None (Borderless)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </SectionCard>

              <SectionCard title="Template Visibility">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="printHeader"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Print Header</FormLabel>
                          <FormDescription>
                            Include the company header at the top of the printed document.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={(val) => {
                            field.onChange(val);
                            // We need a slight hack here for real-time preview updating before form save
                            // Alternatively, just let form state dictate preview, but our preview uses React Query.
                            // To keep it simple, we save instantly on toggle to update the preview, or we rely on form state in the preview.
                            // Since preview uses usePrintSettings, we must call update to see it live.
                            update({ printHeader: val });
                          }} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyLogo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Company Logo</FormLabel>
                          <FormDescription>
                            Show the company logo in the header.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={(val) => {
                            field.onChange(val);
                            update({ companyLogo: val });
                          }} disabled={!form.watch("printHeader")} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="printFooter"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Print Footer</FormLabel>
                          <FormDescription>
                            Include the footer area at the bottom of the document.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={(val) => {
                            field.onChange(val);
                            update({ printFooter: val });
                          }} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyFooter"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Terms & Conditions</FormLabel>
                          <FormDescription>
                            Show standard terms and conditions in the footer.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={(val) => {
                            field.onChange(val);
                            update({ companyFooter: val });
                          }} disabled={!form.watch("printFooter")} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="showCompanyStampArea"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Company Stamp Area</FormLabel>
                          <FormDescription>
                            Leave space for a physical company stamp.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={(val) => {
                            field.onChange(val);
                            update({ showCompanyStampArea: val });
                          }} disabled={!form.watch("printFooter")} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="authorizedSignature"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Authorized Signature</FormLabel>
                          <FormDescription>
                            Show a signature line in the footer.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={(val) => {
                            field.onChange(val);
                            update({ authorizedSignature: val });
                          }} disabled={!form.watch("printFooter")} />
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
            </div>

            <div className="hidden xl:block">
              <div className="sticky top-6">
                <LivePrintPreview />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
