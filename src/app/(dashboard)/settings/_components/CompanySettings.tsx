"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/shared/section-card";
import { useCompanySettings } from "../_hooks/useSettings";
import { LogoUploader } from "./LogoUploader";

const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  businessName: z.string().min(2, "Business name is required"),
  gstNumber: z.string().optional(),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid URL").or(z.literal("")),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  logoUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CompanySettings() {
  const { data, update, isUpdating } = useCompanySettings();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      businessName: "",
      gstNumber: "",
      email: "",
      website: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      logoUrl: "",
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
        <span className="text-muted-foreground">Loading company settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Company Information</h2>
        <p className="text-sm text-muted-foreground">
          Manage your business details, address, and branding.
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

          <SectionCard title="Branding">
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    <LogoUploader value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SectionCard>

          <SectionCard title="Basic Details">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business/Legal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter GST number (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard title="Contact Information">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard title="Address">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                    <FormMessage />
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
