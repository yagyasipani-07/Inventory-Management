"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
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
import { useProfileSettings } from "../_hooks/useSettings";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string(),
  department: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileSettings() {
  const { data, update, isUpdating } = useProfileSettings();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
      });
    }
  }, [data, form]);

  const onSubmit = (values: FormValues) => {
    update(values);
  };

  const isDirty = form.formState.isDirty;

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
        <span className="text-muted-foreground">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">My Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and account settings.
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

          <SectionCard title="Personal Information">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl font-semibold text-primary">
                {data.name.charAt(0)}
              </div>
              <div className="grid w-full gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="name@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Role & Department">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Role</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
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
