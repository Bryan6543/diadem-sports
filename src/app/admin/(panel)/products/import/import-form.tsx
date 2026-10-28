"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { importCsvAction, type ActionResult } from "@/app/admin/actions";
import { buttonClass } from "@/components/ui/primitives";

export function ImportForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(importCsvAction, null);
  return (
    <form action={action} className="mt-6 space-y-4 bg-white p-6">
      <div>
        <label htmlFor="file" className="text-sm font-semibold">
          CSV file
        </label>
        <input id="file" name="file" type="file" accept=".csv,text/csv" required className="mt-2 block w-full text-sm" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="diademOnly" defaultChecked /> Shopify export: only import Diadem products
      </label>
      <button type="submit" disabled={pending} className={buttonClass("dark", "py-3")}>
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />} Import
      </button>
      {state && (
        <p role="status" className={state.ok ? "text-sm text-brand-deep" : "text-sm text-red-700"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
