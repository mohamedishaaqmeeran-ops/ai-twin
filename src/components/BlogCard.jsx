import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Eye,
  Sparkles,
  Star,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (
  value
) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(value)
  );
};

/* =========================================================
   BLOG CARD
========================================================= */

export default function BlogCard({
  blog,
  featured = false,
}) {
  if (!blog) {
    return null;
  }

  return (
    <article className="group h-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-lg">
      <Link
        to={`/blog/${blog.slug}`}
        className="flex h-full flex-col"
      >
        {/* =================================================
            COVER IMAGE
        ================================================== */}

        <div className="relative aspect-[16/10] overflow-hidden bg-background">
          {blog.coverImage ? (
            <img
              src={
                blog.coverImage
              }
              alt={blog.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-pink-100 via-orange-50 to-background dark:from-white/10 dark:via-background dark:to-white/5">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-[var(--brand-pink)] shadow-sm">
                  <Sparkles className="h-7 w-7" />
                </div>

                <span className="mt-3 block text-sm font-bold text-muted-foreground">
                  Twinn Blog
                </span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

          {/* =================================================
              BADGES
          ================================================== */}

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
              {blog.category ||
                "General"}
            </span>

            {(featured ||
              blog.featured) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                <Star
                  className="h-3 w-3"
                  fill="currentColor"
                />

                Featured
              </span>
            )}
          </div>
        </div>

        {/* =================================================
            CARD CONTENT
        ================================================== */}

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-[var(--brand-pink)]" />

              {formatDate(
                blog.createdAt
              )}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-[var(--brand-pink)]" />

              {blog.readTime ||
                1}{" "}
              min read
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-[var(--brand-pink)]" />

              {blog.views ||
                0}
            </span>
          </div>

          <h2 className="mt-4 line-clamp-2 text-xl font-black leading-snug tracking-tight text-foreground transition group-hover:text-[var(--brand-pink)]">
            {blog.title}
          </h2>

          {blog.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm font-medium leading-7 text-muted-foreground">
              {blog.excerpt}
            </p>
          )}

          <div className="mt-auto pt-6">
            <span className="inline-flex items-center gap-2 text-sm font-black text-[var(--brand-pink)]">
              Read article

              <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}