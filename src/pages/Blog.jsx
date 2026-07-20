import {
  ArrowRight,
  Search,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
} from "react-router-dom";

import BlogCard from "../components/BlogCard";
import Nav from "../components/Nav";
import Pagination from "../components/Pagination";

import {
  fetchBlogCategories,
  fetchFeaturedBlogs,
  fetchPublicBlogs,
} from "../features/blog/blogSlice";

/* =========================================================
   BLOG PAGE
========================================================= */

export default function Blog() {
  const dispatch = useDispatch();

  const {
    blogs = [],
    featuredBlogs = [],
    categories = [],
    pagination = {
      page: 1,
      totalPages: 1,
    },
    listLoading,
    error,
  } = useSelector(
    (state) => state.blog
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("");

  const [
    sort,
    setSort,
  ] = useState("latest");

  const [
    page,
    setPage,
  ] = useState(1);

  /* =======================================================
     FETCH FEATURED BLOGS AND CATEGORIES
  ======================================================= */

  useEffect(() => {
    dispatch(
      fetchFeaturedBlogs(3)
    );

    dispatch(
      fetchBlogCategories()
    );
  }, [dispatch]);

  /* =======================================================
     FETCH PUBLIC BLOGS
  ======================================================= */

  useEffect(() => {
    const timer =
      setTimeout(() => {
        dispatch(
          fetchPublicBlogs({
            page,
            limit: 9,
            search,
            category,
            sort,
          })
        );
      }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [
    dispatch,
    page,
    search,
    category,
    sort,
  ]);

  const updateSearch = (
    event
  ) => {
    setSearch(
      event.target.value
    );

    setPage(1);
  };

  const updateCategory = (
    value
  ) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Nav />

      <main>
        {/* =================================================
            HERO
        ================================================== */}

        <section className="border-b border-border bg-gradient-to-br from-pink-50/60 via-background to-orange-50/40 px-4 py-16 dark:from-white/5 dark:via-background dark:to-white/5 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />

                TWINN INSIGHTS
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                Ideas for the future of{" "}
                <span className="brand-text">
                  AI-powered commerce
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-8 text-muted-foreground sm:text-lg">
                Product updates, creator strategies, AI insights and practical guides from the Twinn team.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/signin"
                  className="brand-gradient inline-flex h-12 items-center justify-center gap-2 rounded-[5px] px-7 text-sm font-bold text-white shadow-md transition hover:opacity-90"
                >
                  Get Started

                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#all-blogs"
                  className="inline-flex h-12 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-7 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
                >
                  Explore Articles
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            FEATURED BLOGS
        ================================================== */}

        {featuredBlogs.length >
          0 && (
          <section className="px-4 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                    <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />

                    EDITOR'S PICKS
                  </span>

                  <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                    Featured{" "}
                    <span className="brand-text">
                      stories
                    </span>
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-muted-foreground">
                    Handpicked articles covering AI, creators, commerce and product updates.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredBlogs.map(
                  (blog) => (
                    <BlogCard
                      key={
                        blog._id
                      }
                      blog={blog}
                      featured
                    />
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            ALL BLOGS
        ================================================== */}

        <section
          id="all-blogs"
          className="px-4 pb-20"
        >
          <div className="mx-auto max-w-7xl">
            <div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Latest{" "}
                <span className="brand-text">
                  articles
                </span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-muted-foreground">
                Browse all Twinn insights, updates and practical guides.
              </p>
            </div>

            {/* =================================================
                FILTERS
            ================================================== */}

            <div className="mt-8 rounded-3xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={
                      search
                    }
                    onChange={
                      updateSearch
                    }
                    placeholder="Search blogs..."
                    className="h-12 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-500/10"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    value={
                      category
                    }
                    onChange={(
                      event
                    ) =>
                      updateCategory(
                        event
                          .target
                          .value
                      )
                    }
                    className="h-12 min-w-[180px] rounded-2xl border border-border bg-background px-4 text-sm font-bold text-foreground outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-500/10"
                  >
                    <option value="">
                      All categories
                    </option>

                    {categories.map(
                      (item) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={sort}
                    onChange={(
                      event
                    ) => {
                      setSort(
                        event
                          .target
                          .value
                      );

                      setPage(1);
                    }}
                    className="h-12 min-w-[170px] rounded-2xl border border-border bg-background px-4 text-sm font-bold text-foreground outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-500/10"
                  >
                    <option value="latest">
                      Latest
                    </option>

                    <option value="oldest">
                      Oldest
                    </option>

                    <option value="popular">
                      Most popular
                    </option>

                    <option value="title">
                      Title A–Z
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-semibold text-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            {/* =================================================
                BLOG GRID
            ================================================== */}

            <div className="mt-8">
              {listLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({
                    length: 6,
                  }).map(
                    (
                      _,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="h-[430px] animate-pulse rounded-3xl border border-border bg-card shadow-sm"
                      />
                    )
                  )}
                </div>
              ) : blogs.length >
                0 ? (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {blogs.map(
                      (blog) => (
                        <BlogCard
                          key={
                            blog._id
                          }
                          blog={
                            blog
                          }
                        />
                      )
                    )}
                  </div>

                  {pagination
                    .totalPages >
                    1 && (
                    <div className="mt-12 flex justify-center">
                      <Pagination
                        page={
                          pagination.page
                        }
                        totalPages={
                          pagination.totalPages
                        }
                        onPageChange={
                          setPage
                        }
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-20 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <Search className="h-8 w-8" />
                  </div>

                  <h3 className="mt-5 text-2xl font-black tracking-tight">
                    No blogs found
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-7 text-muted-foreground">
                    Try another search term, category or sorting option.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =================================================
            CTA
        ================================================== */}

        <section className="px-4 pb-16">
          <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-pink-600 to-orange-500 p-8 text-white shadow-xl sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tight">
                  Ready to build your AI Twin?
                </h2>

                <p className="mt-2 text-sm font-medium text-white/90">
                  Create your AI Twin, train it on your products and start selling live.
                </p>
              </div>

              <Link
                to="/signin"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[5px] bg-white px-7 text-sm font-black text-[var(--brand-pink)] transition hover:opacity-90"
              >
                Get Started

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

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