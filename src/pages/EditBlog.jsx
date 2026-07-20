import {
  ArrowLeft,
  FileText,
  Loader2,
  Sparkles,
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
  useNavigate,
  useParams,
} from "react-router-dom";

import BlogForm from "../components/BlogForm";

import {
  clearAdminSelectedBlog,
  clearBlogError,
  fetchAdminBlogById,
  updateBlogPost,
} from "../features/blog/blogSlice";

export default function EditBlog() {
  const {
    blogId,
  } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    adminSelectedBlog,
    adminLoading,
    actionLoading,
    actionError,
    error,
  } = useSelector(
    (state) => state.blog
  );

  useEffect(() => {
    if (!blogId) {
      return undefined;
    }

    dispatch(
      fetchAdminBlogById(
        blogId
      )
    );

    return () => {
      dispatch(
        clearAdminSelectedBlog()
      );
    };
  }, [
    dispatch,
    blogId,
  ]);

  const handleSubmit = async (
    formData
  ) => {
    dispatch(
      clearBlogError()
    );

    const result =
      await dispatch(
        updateBlogPost({
          blogId,
          formData,
        })
      );

    if (
      updateBlogPost.fulfilled.match(
        result
      )
    ) {
      navigate(
        "/admin/blogs",
        {
          replace: true,
        }
      );
    }
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (
    adminLoading &&
    !adminSelectedBlog
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>

          <h1 className="mt-5 text-2xl font-black tracking-tight">
            Loading blog
          </h1>

          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Please wait while the article is loaded.
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (
    error &&
    !adminSelectedBlog
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
            <FileText className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight">
            Unable to load{" "}
            <span className="brand-text">
              blog
            </span>
          </h1>

          <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">
            {error}
          </p>

          <Link
            to="/admin/blogs"
            className="brand-gradient mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* =================================================
            PAGE HEADER
        ================================================== */}

        <section className="rounded-3xl border border-border bg-gradient-to-br from-pink-50/70 via-background to-orange-50/50 p-6 shadow-sm dark:from-white/5 dark:via-background dark:to-white/5 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                to="/admin/blogs"
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-[var(--brand-pink)]"
              >
                <ArrowLeft className="h-4 w-4" />

                Back to blogs
              </Link>

              <div className="mt-5">
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-pink-500 bg-card px-4 py-2 text-xs font-bold tracking-wide text-foreground">
                  <Sparkles className="h-4 w-4 text-[var(--brand-pink)]" />

                  ADMIN CONTENT
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Edit{" "}
                <span className="brand-text">
                  blog article
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-muted-foreground">
                Update the article content, cover image, publishing status and search metadata.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
              <FileText className="h-7 w-7" />
            </div>
          </div>
        </section>

        {/* =================================================
            ERROR MESSAGE
        ================================================== */}

        {actionError && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-300">
            {actionError}
          </div>
        )}

        {/* =================================================
            BLOG FORM
        ================================================== */}

        <section className="mt-7 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7 lg:p-8">
          {adminSelectedBlog && (
            <BlogForm
              initialData={
                adminSelectedBlog
              }
              loading={
                actionLoading
              }
              error={
                actionError
              }
              onSubmit={
                handleSubmit
              }
              submitLabel="Update Blog"
            />
          )}
        </section>
      </div>
    </main>
  );
}