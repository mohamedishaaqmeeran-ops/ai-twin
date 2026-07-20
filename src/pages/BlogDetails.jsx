import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Eye,
  Sparkles,
  Tag,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
  useParams,
} from "react-router-dom";

import BlogCard from "../components/BlogCard";
import Nav from "../components/Nav";

import {
  clearSelectedBlog,
  fetchBlogBySlug,
  fetchRelatedBlogs,
} from "../features/blog/blogSlice";

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(new Date(value));
};

/* =========================================================
   BLOG DETAILS PAGE
========================================================= */

export default function BlogDetails() {
  const {
    slug,
  } = useParams();

  const dispatch = useDispatch();

  const {
    selectedBlog: blog,
    relatedBlogs = [],
    detailsLoading,
    error,
  } = useSelector(
    (state) => state.blog
  );

  /* =======================================================
     FETCH BLOG
  ======================================================= */

  useEffect(() => {
    if (!slug) {
      return;
    }

    dispatch(
      fetchBlogBySlug(slug)
    );

    dispatch(
      fetchRelatedBlogs({
        slug,
        limit: 3,
      })
    );

    return () => {
      dispatch(
        clearSelectedBlog()
      );
    };
  }, [
    dispatch,
    slug,
  ]);

  /* =======================================================
     SEO
  ======================================================= */

  useEffect(() => {
    if (!blog) {
      return;
    }

    document.title = `${
      blog.seoTitle ||
      blog.title
    } | Twinn`;

    let description =
      document.querySelector(
        'meta[name="description"]'
      );

    if (!description) {
      description =
        document.createElement(
          "meta"
        );

      description.setAttribute(
        "name",
        "description"
      );

      document.head.appendChild(
        description
      );
    }

    description.setAttribute(
      "content",
      blog.seoDescription ||
        blog.excerpt ||
        ""
    );
  }, [blog]);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />

        <main>
          <section className="border-b border-border bg-gradient-to-br from-pink-50/60 via-background to-orange-50/40 px-4 py-16 dark:from-white/5 dark:via-background dark:to-white/5">
            <div className="mx-auto max-w-5xl">
              <div className="h-8 w-40 animate-pulse rounded-xl bg-muted" />

              <div className="mt-8 h-6 w-28 animate-pulse rounded-full bg-muted" />

              <div className="mt-6 h-14 w-full animate-pulse rounded-2xl bg-muted" />

              <div className="mt-4 h-14 w-4/5 animate-pulse rounded-2xl bg-muted" />

              <div className="mt-6 h-6 w-3/4 animate-pulse rounded-xl bg-muted" />
            </div>
          </section>

          <section className="px-4 py-12">
            <div className="mx-auto aspect-video max-w-6xl animate-pulse rounded-3xl border border-border bg-card" />
          </section>

          <section className="px-4 pb-16">
            <div className="mx-auto max-w-4xl space-y-4">
              {[1, 2, 3, 4, 5].map(
                (item) => (
                  <div
                    key={item}
                    className="h-5 animate-pulse rounded-xl bg-muted"
                  />
                )
              )}
            </div>
          </section>
        </main>
      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (
    error ||
    !blog
  ) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />

        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-16">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <Sparkles className="h-8 w-8" />
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight">
              Blog not{" "}
              <span className="brand-text">
                found
              </span>
            </h1>

            <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">
              {error ||
                "This article is currently unavailable or may have been removed."}
            </p>

            <Link
              to="/blog"
              className="brand-gradient mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold text-white shadow-md transition hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Nav />

      <main>
        <article>
          {/* =================================================
              HERO SECTION
          ================================================== */}

          <header className="border-b border-border bg-gradient-to-br from-pink-50/60 via-background to-orange-50/40 px-4 py-14 dark:from-white/5 dark:via-background dark:to-white/5 sm:py-16">
            <div className="mx-auto max-w-5xl">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-[var(--brand-pink)]"
              >
                <ArrowLeft className="h-4 w-4" />

                Back to blogs
              </Link>

              <div className="mt-8">
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                  <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />

                  TWinn BLOG
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-pink-50 px-4 py-2 text-xs font-black text-[var(--brand-pink)] dark:bg-white/10">
                  {blog.category ||
                    "General"}
                </span>

                {blog.tags?.map(
                  (tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-muted-foreground"
                    >
                      <Tag className="h-3 w-3 text-[var(--brand-pink)]" />

                      {tag}
                    </span>
                  )
                )}
              </div>

              <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="mt-6 max-w-4xl text-base font-medium leading-8 text-muted-foreground sm:text-lg">
                  {blog.excerpt}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <MetaItem
                  icon={
                    CalendarDays
                  }
                  value={formatDate(
                    blog.createdAt
                  )}
                />

                <MetaItem
                  icon={Clock3}
                  value={`${
                    blog.readTime ||
                    1
                  } min read`}
                />

                <MetaItem
                  icon={Eye}
                  value={`${
                    blog.views ||
                    0
                  } views`}
                />
              </div>
            </div>
          </header>

          {/* =================================================
              COVER IMAGE
          ================================================== */}

          <section className="px-4 py-10 sm:py-12">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              {blog.coverImage ? (
                <img
                  src={
                    blog.coverImage
                  }
                  alt={blog.title}
                  className="max-h-[650px] min-h-[260px] w-full object-cover sm:min-h-[420px]"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-pink-100 via-orange-50 to-background dark:from-white/10 dark:via-background dark:to-white/5">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-card text-[var(--brand-pink)] shadow-sm">
                      <Sparkles className="h-8 w-8" />
                    </div>

                    <p className="mt-4 text-sm font-bold text-muted-foreground">
                      Twinn Blog
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              ARTICLE CONTENT
          ================================================== */}

          <section className="px-4 pb-16">
            <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="mb-8 flex items-center gap-3 border-b border-border pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                  <Sparkles className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--brand-pink)]">
                    Featured story
                  </p>

                  <p className="mt-1 text-sm font-bold text-muted-foreground">
                    Insights from Twinn
                  </p>
                </div>
              </div>

              <div className="whitespace-pre-wrap text-[16px] font-medium leading-8 text-muted-foreground sm:text-[17px]">
                {blog.content}
              </div>

              <div className="mt-10 border-t border-border pt-8">
                <div className="rounded-3xl bg-gradient-to-r from-pink-600 to-orange-500 p-6 text-white shadow-lg sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">
                        Ready to create your AI Twin?
                      </h2>

                      <p className="mt-2 text-sm font-medium leading-6 text-white/90">
                        Build your AI Twin and start selling live across multiple platforms.
                      </p>
                    </div>

                    <Link
                      to="/signin"
                      className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[5px] bg-white px-6 text-sm font-black text-[var(--brand-pink)] transition hover:opacity-90"
                    >
                      Get Started

                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* ===================================================
            RELATED BLOGS
        ==================================================== */}

        {relatedBlogs.length >
          0 && (
          <section className="border-t border-border bg-card/40 px-4 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                    <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />

                    KEEP READING
                  </span>

                  <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                    Related{" "}
                    <span className="brand-text">
                      articles
                    </span>
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-muted-foreground">
                    Discover more insights, ideas and updates from the Twinn team.
                  </p>
                </div>

                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm font-black text-[var(--brand-pink)] transition hover:opacity-75"
                >
                  View all blogs

                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map(
                  (item) => (
                    <BlogCard
                      key={
                        item._id
                      }
                      blog={item}
                    />
                  )
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-border bg-[#0d0d12]">
        <p className="px-4 py-5 text-center text-sm font-medium tracking-wide text-white/50">
          ©{" "}
          {new Date().getFullYear()}{" "}
          Twinn. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

/* =========================================================
   META ITEM
========================================================= */

function MetaItem({
  icon: Icon,
  value,
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-xs font-bold text-muted-foreground shadow-sm sm:text-sm">
      <Icon className="h-4 w-4 text-[var(--brand-pink)]" />

      {value}
    </span>
  );
}