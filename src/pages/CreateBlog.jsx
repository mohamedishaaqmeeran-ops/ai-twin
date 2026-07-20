import {
  ArrowLeft,
  FileText,
  Sparkles,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import BlogForm from "../components/BlogForm";

import {
  clearBlogError,
  createBlogPost,
} from "../features/blog/blogSlice";

export default function CreateBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    actionLoading,
    actionError,
  } = useSelector(
    (state) => state.blog
  );

  const handleSubmit = async (
    formData
  ) => {
    dispatch(
      clearBlogError()
    );

    const result =
      await dispatch(
        createBlogPost(
          formData
        )
      );

    if (
      createBlogPost.fulfilled.match(
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
                Create a new{" "}
                <span className="brand-text">
                  blog
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-muted-foreground">
                Add a new article, upload a cover image and publish it for your audience.
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
            FORM
        ================================================== */}

        <section className="mt-7 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7 lg:p-8">
          <BlogForm
            loading={
              actionLoading
            }
            error={
              actionError
            }
            onSubmit={
              handleSubmit
            }
            submitLabel="Create Blog"
          />
        </section>
      </div>
    </main>
  );
}