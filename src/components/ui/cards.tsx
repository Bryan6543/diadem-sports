import Image from "next/image";
import Link from "next/link";
import type { Article, Athlete, ImageRef } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

export function ArticleCard({
  article,
  cover,
  minutes,
  className,
  large,
}: {
  article: Article;
  cover: ImageRef;
  minutes: number;
  className?: string;
  large?: boolean;
}) {
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className={cn("relative overflow-hidden bg-ink-2", large ? "aspect-[16/10]" : "aspect-[16/11]")}>
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
          className="object-cover transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-105"
        />
      </div>
      <p className="eyebrow mt-5 text-brand-deep">
        {article.category} <span className="text-muted">· {minutes} min read</span>
      </p>
      <h3 className={cn("mt-2 font-semibold leading-tight text-ink", large ? "text-3xl" : "text-xl")}>
        <Link href={`/news/${article.slug}`} className="after:absolute after:inset-0 group-hover:text-brand-deep">
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-body">{article.excerpt}</p>
      <p className="mt-4 font-mono text-xs text-muted">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
      </p>
    </article>
  );
}

export function AthleteCard({
  athlete,
  portrait,
  className,
}: {
  athlete: Athlete;
  portrait: ImageRef & { position?: string };
  className?: string;
}) {
  return (
    <article className={cn("group relative overflow-hidden bg-ink text-white", className)}>
      <div className="relative aspect-[4/5]">
        <Image
          src={portrait.src}
          alt={portrait.alt || athlete.name}
          style={{ objectPosition: portrait.position ?? "center top" }}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 85vw"
          className="object-cover transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-105"
        />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="eyebrow text-brand-bright">
          {athlete.country} · {athlete.tour}
        </p>
        <h3 className="font-display mt-2 text-3xl">{athlete.name}</h3>
        <p className="mt-1 text-sm text-white/75">{athlete.highlight}</p>
        <p className="mt-3 border-t border-white/15 pt-3 text-xs text-white/60">
          Plays: <span className="text-white">{athlete.plays}</span>
        </p>
      </div>
    </article>
  );
}
