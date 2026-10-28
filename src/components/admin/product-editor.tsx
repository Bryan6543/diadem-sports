"use client";

/* eslint-disable @next/next/no-img-element -- admin previews may point at any URL being typed in */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ExternalLink, ImagePlus, Loader2, Plus, Star, Store, Trash2, X } from "lucide-react";
import { deleteProductAction, loadFromStoreAction, saveProductAction, uploadProductImageAction } from "@/app/admin/actions";
import { buttonClass } from "@/components/ui/primitives";
import type { Category, ImageRef, Product, Technology } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";
import { resizeInBrowser } from "./resize-image";


export function ProductEditor({
  initial,
  isNew,
  categories,
  technologies,
  storeHost,
}: {
  initial: Product;
  isNew: boolean;
  categories: Category[];
  technologies: Technology[];
  storeHost: string;
}) {
  const router = useRouter();
  const [p, setP] = useState<Product>(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, startSave] = useTransition();
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((prev) => ({ ...prev, [k]: v }));
  const category = categories.find((c) => c.slug === p.category);

  const save = () =>
    startSave(async () => {
      const res = await saveProductAction(JSON.stringify(p));
      setMsg({ ok: res.ok, text: res.message });
      if (res.ok && isNew) router.replace(`/admin/products/${encodeURIComponent(p.id)}`);
      else router.refresh();
    });

  const input = "mt-1.5 h-10 w-full border border-ink/20 bg-white px-3 text-sm focus:border-brand-deep focus:outline-none";
  const area = "mt-1.5 w-full border border-ink/20 bg-white p-3 text-sm focus:border-brand-deep focus:outline-none";
  const label = "text-sm font-semibold";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="pb-28"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin/products" className="text-sm text-muted hover:text-ink">
            ← All products
          </Link>
          <h1 className="font-display mt-2 text-4xl">{isNew ? "New product" : p.name || "Untitled"}</h1>
        </div>
        {!isNew && (
          <Link href={`/products/${p.slug}`} target="_blank" className="flex items-center gap-1 text-sm text-brand-deep hover:underline">
            View on site <ExternalLink aria-hidden className="size-3.5" />
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className={label}>
                  Name
                </label>
                <input
                  id="name"
                  className={input}
                  value={p.name}
                  required
                  onChange={(e) => {
                    const name = e.target.value;
                    setP((prev) => ({ ...prev, name, ...(slugTouched ? {} : { slug: slugify(name) }) }));
                  }}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="slug" className={label}>
                  URL slug <span className="font-normal text-muted">— diademsports.lk/products/{p.slug || "…"}</span>
                </label>
                <input
                  id="slug"
                  className={input}
                  value={p.slug}
                  required
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                />
              </div>
              <div>
                <label htmlFor="category" className={label}>
                  Collection
                </label>
                <select id="category" className={input} value={p.category} onChange={(e) => set("category", e.target.value as Product["category"])}>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="type" className={label}>
                  Type
                </label>
                <input id="type" className={input} list="type-options" value={p.type} onChange={(e) => set("type", e.target.value)} />
                <datalist id="type-options">
                  {category?.types.map((t) => <option key={t} value={t} />)}
                </datalist>
              </div>
              <div>
                <label htmlFor="sport" className={label}>
                  Sport
                </label>
                <select id="sport" className={input} value={p.sport} onChange={(e) => set("sport", e.target.value as Product["sport"])}>
                  <option value="tennis">Tennis</option>
                  <option value="pickleball">Pickleball</option>
                  <option value="all">All / both</option>
                </select>
              </div>
              <div>
                <label htmlFor="tags" className={label}>
                  Tags <span className="font-normal text-muted">(comma separated)</span>
                </label>
                <input
                  id="tags"
                  className={input}
                  value={p.tags.join(", ")}
                  onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                />
              </div>
            </div>
          </Panel>

          <Panel title="Photos">
            <ImageManager
              images={p.images}
              onChange={(images) => set("images", images)}
              productId={p.id}
              handle={p.retailerHandle}
              storeHost={storeHost}
              onStoreData={(d) => setP((prev) => ({ ...prev, ...d }))}
            />
          </Panel>

          <Panel title="Description">
            <label htmlFor="short" className={label}>
              Short description <span className="font-normal text-muted">(shown at the top of the product page and in search)</span>
            </label>
            <textarea id="short" rows={3} className={area} value={p.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
            <label htmlFor="desc" className={cn(label, "mt-4 block")}>
              Full description <span className="font-normal text-muted">(one paragraph per line)</span>
            </label>
            <textarea id="desc" rows={6} className={area} value={p.description.join("\n")} onChange={(e) => set("description", e.target.value.split("\n"))} />
            <label htmlFor="features" className={cn(label, "mt-4 block")}>
              Key features <span className="font-normal text-muted">(one per line)</span>
            </label>
            <textarea id="features" rows={5} className={area} value={p.features.join("\n")} onChange={(e) => set("features", e.target.value.split("\n"))} />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="included" className={label}>
                  What&apos;s included <span className="font-normal text-muted">(one per line)</span>
                </label>
                <textarea id="included" rows={3} className={area} value={p.included.join("\n")} onChange={(e) => set("included", e.target.value.split("\n"))} />
              </div>
              <div>
                <label htmlFor="ideal" className={label}>
                  Ideal for <span className="font-normal text-muted">(one per line)</span>
                </label>
                <textarea id="ideal" rows={3} className={area} value={p.idealFor.join("\n")} onChange={(e) => set("idealFor", e.target.value.split("\n"))} />
              </div>
            </div>
          </Panel>

          <Panel title="Specifications">
            <RowsEditor
              rows={p.specs.map((s) => [s.label, s.value])}
              headers={["Label", "Value"]}
              onChange={(rows) => set("specs", rows.map(([label, value]) => ({ label, value })))}
              addLabel="Add specification"
            />
          </Panel>

          <Panel title="Options (variants)">
            <ul className="space-y-2">
              {p.variants.map((v, i) => (
                <li key={i} className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={`v-${i}`}>
                    Option {i + 1}
                  </label>
                  <input
                    id={`v-${i}`}
                    className={cn(input, "mt-0 flex-1")}
                    value={v.name}
                    onChange={(e) => set("variants", p.variants.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                  />
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={v.available}
                      onChange={(e) => set("variants", p.variants.map((x, j) => (j === i ? { ...x, available: e.target.checked } : x)))}
                    />
                    Available
                  </label>
                  <button type="button" onClick={() => set("variants", p.variants.filter((_, j) => j !== i))} className="p-2 text-muted hover:text-red-700" aria-label={`Remove option ${v.name}`}>
                    <X aria-hidden className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => set("variants", [...p.variants, { name: "", available: true }])} className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand-deep">
              <Plus aria-hidden className="size-4" /> Add option
            </button>
          </Panel>

          <Panel title="Technologies">
            <div className="grid gap-2 sm:grid-cols-2">
              {technologies.map((t) => (
                <label key={t.slug} className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={p.technologies.includes(t.slug)}
                    onChange={(e) =>
                      set("technologies", e.target.checked ? [...p.technologies, t.slug] : p.technologies.filter((x) => x !== t.slug))
                    }
                  />
                  <span>
                    <span className="font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted">{t.appliesTo}</span>
                  </span>
                </label>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Visibility">
            <Toggle label="Published on the site" checked={p.published} onChange={(v) => set("published", v)} />
            <Toggle label="Featured (home carousel)" checked={p.featured} onChange={(v) => set("featured", v)} />
            {p.featured && (
              <div className="mt-2">
                <label htmlFor="rank" className={label}>
                  Featured order <span className="font-normal text-muted">(0 = first)</span>
                </label>
                <input
                  id="rank"
                  type="number"
                  min={0}
                  max={99}
                  className={input}
                  value={p.featuredRank ?? ""}
                  onChange={(e) => set("featuredRank", e.target.value === "" ? null : Number(e.target.value))}
                />
              </div>
            )}
            <Toggle label="Home page spotlight" checked={p.spotlight} onChange={(v) => set("spotlight", v)} />
          </Panel>

          <Panel title="Price & stock">
            <label htmlFor="price" className={label}>
              Price (Rs.)
            </label>
            <input id="price" type="number" min={0} step="1" className={input} value={p.price} onChange={(e) => set("price", Number(e.target.value))} />
            <label htmlFor="compare" className={cn(label, "mt-3 block")}>
              Was price (Rs.) <span className="font-normal text-muted">— shows a discount</span>
            </label>
            <input
              id="compare"
              type="number"
              min={0}
              step="1"
              className={input}
              value={p.compareAtPrice ?? ""}
              onChange={(e) => set("compareAtPrice", e.target.value === "" ? null : Number(e.target.value))}
            />
            <div className="mt-3">
              <Toggle label="In stock" checked={p.inStock} onChange={(v) => set("inStock", v)} />
            </div>
          </Panel>

          <Panel title={`Link to ${storeHost}`}>
            <label htmlFor="handle" className={label}>
              Store handle
            </label>
            <input
              id="handle"
              className={input}
              value={p.retailerHandle}
              onChange={(e) => {
                const h = e.target.value.trim();
                setP((prev) => ({ ...prev, retailerHandle: h, retailerUrl: h ? `https://www.${storeHost}/products/${h}` : prev.retailerUrl }));
              }}
            />
            <label htmlFor="rurl" className={cn(label, "mt-3 block")}>
              Buy now URL
            </label>
            <input id="rurl" className={input} value={p.retailerUrl} onChange={(e) => set("retailerUrl", e.target.value)} />
            <p className="mt-2 text-xs text-muted">
              Leave empty for products {storeHost} doesn&apos;t sell: the page then shows no price and no Buy button, only the wishlist.
            </p>
            {p.retailerUrl && (
              <a href={p.retailerUrl} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-1 text-xs text-brand-deep hover:underline">
                Test link <ExternalLink aria-hidden className="size-3" />
              </a>
            )}
          </Panel>

          {!isNew && <DeleteProduct id={p.id} name={p.name} />}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <p role="status" className={cn("text-sm", msg?.ok ? "text-brand-deep" : "text-red-700")}>
            {msg?.text}
          </p>
          <button type="submit" disabled={saving} className={buttonClass("brand", "py-3")}>
            {saving && <Loader2 aria-hidden className="size-4 animate-spin" />}
            {isNew ? "Create product" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white p-5" aria-label={title}>
      <h2 className="eyebrow mb-4 text-muted">{title}</h2>
      {children}
    </section>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5 text-sm">
      {label}
      <input type="checkbox" className="size-4 accent-[var(--color-brand-deep)]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function RowsEditor({
  rows,
  headers,
  onChange,
  addLabel,
}: {
  rows: [string, string][];
  headers: [string, string];
  onChange: (rows: [string, string][]) => void;
  addLabel: string;
}) {
  const update = (i: number, j: 0 | 1, v: string) => onChange(rows.map((r, k) => (k === i ? ((j === 0 ? [v, r[1]] : [r[0], v]) as [string, string]) : r)));
  return (
    <>
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="flex gap-2">
            <input aria-label={`${headers[0]} ${i + 1}`} placeholder={headers[0]} className="h-10 w-2/5 border border-ink/20 px-3 text-sm" value={r[0]} onChange={(e) => update(i, 0, e.target.value)} />
            <input aria-label={`${headers[1]} ${i + 1}`} placeholder={headers[1]} className="h-10 flex-1 border border-ink/20 px-3 text-sm" value={r[1]} onChange={(e) => update(i, 1, e.target.value)} />
            <button type="button" onClick={() => onChange(rows.filter((_, k) => k !== i))} className="p-2 text-muted hover:text-red-700" aria-label={`Remove ${r[0] || "row"}`}>
              <X aria-hidden className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onChange([...rows, ["", ""]])} className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand-deep">
        <Plus aria-hidden className="size-4" /> {addLabel}
      </button>
    </>
  );
}

function ImageManager({
  images,
  onChange,
  productId,
  handle,
  storeHost,
  onStoreData,
}: {
  images: ImageRef[];
  onChange: (images: ImageRef[]) => void;
  productId: string;
  handle: string;
  storeHost: string;
  onStoreData: (d: Partial<Product>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  const upload = async (files: FileList | File[]) => {
    setError("");
    const added: ImageRef[] = [];
    for (const original of Array.from(files)) {
      setBusy(`Uploading ${original.name}…`);
      const file = await resizeInBrowser(original, 2000);
      const fd = new FormData();
      fd.set("file", file);
      fd.set("productId", productId);
      const res = await uploadProductImageAction(fd);
      if (res.ok && res.url) added.push({ src: res.url, alt: "" });
      else setError(res.message);
    }
    if (added.length) onChange([...images, ...added]);
    setBusy("");
  };

  const move = (i: number, d: number) => {
    const next = [...images];
    const [x] = next.splice(i, 1);
    next.splice(i + d, 0, x);
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files.length) void upload(e.dataTransfer.files);
        }}
        className={cn("flex flex-col items-center justify-center gap-2 border-2 border-dashed p-6 text-center text-sm", drag ? "border-brand-deep bg-brand-wash" : "border-ink/20")}
      >
        <ImagePlus aria-hidden className="size-6 text-muted" />
        <p>
          Drag photos here, or{" "}
          <button type="button" onClick={() => fileRef.current?.click()} className="font-semibold text-brand-deep underline">
            choose files
          </button>
        </p>
        <p className="text-xs text-muted">JPEG, PNG or WebP. Resized automatically; location data is removed.</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="sr-only"
          onChange={(e) => e.target.files && void upload(e.target.files)}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <label htmlFor="img-url" className="sr-only">
          Image URL
        </label>
        <input id="img-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… image URL" className="h-10 min-w-56 flex-1 border border-ink/20 px-3 text-sm" />
        <button
          type="button"
          onClick={() => {
            if (!/^https:\/\//.test(url.trim())) return setError("Image URL must start with https://");
            onChange([...images, { src: url.trim(), alt: "" }]);
            setUrl("");
          }}
          className={buttonClass("outline", "py-2")}
        >
          Add URL
        </button>
        <button
          type="button"
          disabled={!handle}
          title={handle ? undefined : "Set the store handle first"}
          onClick={async () => {
            setBusy(`Loading from ${storeHost}…`);
            setError("");
            const res = await loadFromStoreAction(handle);
            setBusy("");
            if (!res.ok) return setError(res.message);
            if (images.length && !confirm(`Replace the ${images.length} current photo(s) with ${res.images.length} from ${storeHost}? (Price and stock will also be updated.)`)) return;
            onStoreData({ images: res.images, price: res.price, compareAtPrice: res.compareAtPrice, inStock: res.inStock, variants: res.variants });
          }}
          className={buttonClass("outline", "py-2")}
        >
          <Store aria-hidden className="size-4" /> Load from store
        </button>
      </div>
      {busy && (
        <p role="status" className="mt-2 flex items-center gap-2 text-sm text-muted">
          <Loader2 aria-hidden className="size-4 animate-spin" /> {busy}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <ul className="mt-4 space-y-2">
        {images.map((img, i) => (
          <li key={`${img.src}-${i}`} className="flex items-center gap-3 border border-line p-2">
            <img src={img.src} alt="" className="size-16 shrink-0 bg-mist object-contain" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted">
                {i === 0 && <span className="mr-1 bg-ink px-1.5 py-0.5 font-bold text-white">MAIN</span>}
                {img.src}
              </p>
              <label className="sr-only" htmlFor={`alt-${i}`}>
                Alt text for photo {i + 1}
              </label>
              <input
                id={`alt-${i}`}
                placeholder="Alt text — describe the photo"
                value={img.alt}
                onChange={(e) => onChange(images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
                className="mt-1 h-9 w-full border border-ink/20 px-2 text-sm"
              />
            </div>
            <div className="flex shrink-0 items-center">
              {i > 0 && (
                <button type="button" onClick={() => onChange([img, ...images.filter((_, j) => j !== i)])} className="p-2 text-muted hover:text-ink" aria-label={`Make photo ${i + 1} the main photo`} title="Set as main photo">
                  <Star aria-hidden className="size-4" />
                </button>
              )}
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="p-2 text-muted hover:text-ink disabled:opacity-30" aria-label={`Move photo ${i + 1} up`}>
                <ArrowUp aria-hidden className="size-4" />
              </button>
              <button type="button" disabled={i === images.length - 1} onClick={() => move(i, 1)} className="p-2 text-muted hover:text-ink disabled:opacity-30" aria-label={`Move photo ${i + 1} down`}>
                <ArrowDown aria-hidden className="size-4" />
              </button>
              <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))} className="p-2 text-muted hover:text-red-700" aria-label={`Remove photo ${i + 1}`}>
                <Trash2 aria-hidden className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!images.length && <p className="mt-3 text-sm text-muted">No photos yet.</p>}
    </div>
  );
}

function DeleteProduct({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <section className="border border-red-200 bg-white p-5">
      <h2 className="eyebrow text-red-700">Danger zone</h2>
      <p className="mt-2 text-sm text-muted">Deleting removes the product from the site. You can hide it instead with &ldquo;Published&rdquo;.</p>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm(`Delete "${name}"? This can't be undone.`)) start(async () => void (await deleteProductAction(id)));
        }}
        className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline"
      >
        <Trash2 aria-hidden className="size-4" /> Delete product
      </button>
    </section>
  );
}

