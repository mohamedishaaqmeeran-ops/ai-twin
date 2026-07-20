import {
  FileText,
  Plus,
  Search,
  Star,
  Upload,
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

import BlogTable from "../components/BlogTable";
import DeleteBlogModal from "../components/DeleteBlogModal";
import Pagination from "../components/Pagination";

import {
  changeBlogFeaturedStatus,
  changeBlogPublishStatus,
  clearBlogError,
  clearBlogMessage,
  fetchAdminBlogs,
  removeBlogPost,
} from "../features/blog/blogSlice";

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-foreground">
            {value ?? 0}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   BLOG LIST
========================================================= */

export default function BlogList() {
  const dispatch = useDispatch();

  const {
    adminBlogs = [],
    adminPagination = {
      page: 1,
      totalPages: 1,
    },
    stats = {
      total: 0,
      published: 0,
      drafts: 0,
      featured: 0,
    },
    adminLoading,
    actionLoading,
    error,
    actionError,
    successMessage,
  } = useSelector(
    (state) => state.blog
  );

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("all");

  const [
    featured,
    setFeatured,
  ] = useState("");

  const [
    selectedBlog,
    setSelectedBlog,
  ] = useState(null);

  /* =======================================================
     FETCH BLOGS
  ======================================================= */

  useEffect(() => {
    const timer =
      setTimeout(() => {
        dispatch(
          fetchAdminBlogs({
            page,
            limit: 10,
            search,
            status,
            featured,
          })
        );
      }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [
    dispatch,
    page,
    search,
    status,
    featured,
  ]);

  /* =======================================================
     CLEAR MESSAGES
  ======================================================= */

  useEffect(() => {
    if (
      !successMessage &&
      !actionError
    ) {
      return undefined;
    }

    const timer =
      setTimeout(() => {
        dispatch(
          clearBlogMessage()
        );

        dispatch(
          clearBlogError()
        );
      }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    dispatch,
    successMessage,
    actionError,
  ]);

  /* =======================================================
     DELETE BLOG
  ======================================================= */

  const handleDelete =
    async () => {
      if (!selectedBlog) {
        return;
      }

      const result =
        await dispatch(
          removeBlogPost(
            selectedBlog._id
          )
        );

      if (
        removeBlogPost.fulfilled.match(
          result
        )
      ) {
        setSelectedBlog(null);

        dispatch(
          fetchAdminBlogs({
            page,
            limit: 10,
            search,
            status,
            featured,
          })
        );
      }
    };

  /* =======================================================
     TOGGLE PUBLISH
  ======================================================= */

  const togglePublish = (
    blog
  ) => {
    dispatch(
      changeBlogPublishStatus({
        blogId: blog._id,
        published:
          !blog.published,
      })
    );
  };

  /* =======================================================
     TOGGLE FEATURED
  ======================================================= */

  const toggleFeatured = (
    blog
  ) => {
    dispatch(
      changeBlogFeaturedStatus({
        blogId: blog._id,
        featured:
          !blog.featured,
      })
    );
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================== */}

        <section className="rounded-3xl border border-border bg-gradient-to-br from-pink-50/70 via-background to-orange-50/50 p-6 shadow-sm dark:from-white/5 dark:via-background dark:to-white/5 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                <FileText className="h-4 w-4 text-[var(--brand-pink)]" />

                ADMIN CONTENT
              </span>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Blog{" "}
                <span className="brand-text">
                  management
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-muted-foreground">
                Create, edit, publish and manage all blog articles from one place.
              </p>
            </div>

            <Link
              to="/admin/blogs/create"
              className="brand-gradient inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90"
            >
              <Plus className="h-5 w-5" />

              Create Blog
            </Link>
          </div>
        </section>

        {/* =================================================
            STATS
        ================================================== */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FileText}
            label="Total blogs"
            value={stats.total}
          />

          <StatCard
            icon={Upload}
            label="Published"
            value={
              stats.published
            }
          />

          <StatCard
            icon={FileText}
            label="Drafts"
            value={stats.drafts}
          />

          <StatCard
            icon={Star}
            label="Featured"
            value={
              stats.featured
            }
          />
        </section>

        {/* =================================================
            SUCCESS / ERROR MESSAGE
        ================================================== */}

        {(successMessage ||
          actionError) && (
          <div
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              actionError
                ? "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            }`}
          >
            {actionError ||
              successMessage}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {/* =================================================
            FILTERS
        ================================================== */}

        <section className="mt-7 rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(
                  event
                ) => {
                  setSearch(
                    event.target.value
                  );

                  setPage(1);
                }}
                placeholder="Search title, excerpt or category..."
                className="h-12 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-500/10"
              />
            </div>

            <select
              value={status}
              onChange={(
                event
              ) => {
                setStatus(
                  event.target.value
                );

                setPage(1);
              }}
              className="h-12 min-w-[180px] rounded-2xl border border-border bg-background px-4 text-sm font-bold text-foreground outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-500/10"
            >
              <option value="all">
                All statuses
              </option>

              <option value="published">
                Published
              </option>

              <option value="draft">
                Draft
              </option>
            </select>

            <select
              value={featured}
              onChange={(
                event
              ) => {
                setFeatured(
                  event.target.value
                );

                setPage(1);
              }}
              className="h-12 min-w-[180px] rounded-2xl border border-border bg-background px-4 text-sm font-bold text-foreground outline-none transition focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-500/10"
            >
              <option value="">
                All blogs
              </option>

              <option value="true">
                Featured only
              </option>

              <option value="false">
                Not featured
              </option>
            </select>
          </div>
        </section>

        {/* =================================================
            BLOG TABLE
        ================================================== */}

        <section className="mt-6">
          {adminLoading ? (
            <div className="h-[480px] animate-pulse rounded-3xl border border-border bg-card shadow-sm" />
          ) : adminBlogs.length ===
            0 ? (
            <div className="rounded-3xl border border-border bg-card px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                <FileText className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-2xl font-black tracking-tight">
                No blogs found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-7 text-muted-foreground">
                No blog posts match your current filters. Create a new article or change the search filters.
              </p>

              <Link
                to="/admin/blogs/create"
                className="brand-gradient mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" />

                Create Blog
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <BlogTable
                blogs={adminBlogs}
                onDelete={
                  setSelectedBlog
                }
                onTogglePublish={
                  togglePublish
                }
                onToggleFeatured={
                  toggleFeatured
                }
              />
            </div>
          )}
        </section>

        {/* =================================================
            PAGINATION
        ================================================== */}

        {adminPagination
          .totalPages > 1 && (
          <section className="mt-10 flex justify-center">
            <Pagination
              page={
                adminPagination.page
              }
              totalPages={
                adminPagination.totalPages
              }
              onPageChange={
                setPage
              }
            />
          </section>
        )}
      </div>

      {/* ===================================================
          DELETE MODAL
      ==================================================== */}

      <DeleteBlogModal
        open={Boolean(
          selectedBlog
        )}
        blog={selectedBlog}
        loading={actionLoading}
        onClose={() => {
          setSelectedBlog(null);
        }}
        onConfirm={
          handleDelete
        }
      />
    </main>
  );
}