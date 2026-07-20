import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
  Star,
  UploadCloud,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

/* =========================================================
   DEFAULT FORM
========================================================= */

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "General",
  tags: "",
  seoTitle: "",
  seoDescription: "",
  featured: false,
  published: true,
};

/* =========================================================
   SHARED INPUT CLASSES
========================================================= */

const inputClassName =
  "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-pink-500/10";

const labelClassName =
  "mb-2 block text-sm font-bold text-foreground";

const helperClassName =
  "mt-1.5 block text-xs font-medium text-muted-foreground";

/* =========================================================
   BLOG FORM
========================================================= */

export default function BlogForm({
  initialData = null,
  loading = false,
  error = "",
  onSubmit,
  submitLabel = "Save Blog",
}) {
  const navigate =
    useNavigate();

  const [
    form,
    setForm,
  ] = useState(
    emptyForm
  );

  const [
    imageFile,
    setImageFile,
  ] = useState(null);

  const [
    preview,
    setPreview,
  ] = useState("");

  const [
    validationError,
    setValidationError,
  ] = useState("");

  /* =======================================================
     LOAD INITIAL DATA
  ======================================================= */

  useEffect(() => {
    if (!initialData) {
      setForm(
        emptyForm
      );

      setImageFile(
        null
      );

      setPreview("");

      return;
    }

    setForm({
      title:
        initialData.title ||
        "",

      excerpt:
        initialData.excerpt ||
        "",

      content:
        initialData.content ||
        "",

      category:
        initialData.category ||
        "General",

      tags: Array.isArray(
        initialData.tags
      )
        ? initialData.tags.join(
            ", "
          )
        : initialData.tags ||
          "",

      seoTitle:
        initialData.seoTitle ||
        "",

      seoDescription:
        initialData.seoDescription ||
        "",

      featured: Boolean(
        initialData.featured
      ),

      published:
        initialData.published !==
        false,
    });

    setImageFile(null);

    setPreview(
      initialData.coverImage ||
        ""
    );
  }, [initialData]);

  /* =======================================================
     REVOKE PREVIEW URL
  ======================================================= */

  useEffect(() => {
    return () => {
      if (
        preview?.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          preview
        );
      }
    };
  }, [preview]);

  /* =======================================================
     WORD COUNT
  ======================================================= */

  const wordCount =
    useMemo(() => {
      if (
        !form.content.trim()
      ) {
        return 0;
      }

      return form.content
        .trim()
        .split(/\s+/)
        .length;
    }, [form.content]);

  const estimatedReadTime =
    Math.max(
      1,
      Math.ceil(
        wordCount / 200
      )
    );

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const updateField = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm(
      (current) => ({
        ...current,

        [name]:
          type ===
          "checkbox"
            ? checked
            : value,
      })
    );
  };

  /* =======================================================
     IMAGE UPLOAD
  ======================================================= */

  const handleImage = (
    event
  ) => {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setValidationError(
        "Please select a valid image file."
      );

      event.target.value =
        "";

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setValidationError(
        "Image size must be below 5 MB."
      );

      event.target.value =
        "";

      return;
    }

    if (
      preview?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        preview
      );
    }

    setImageFile(file);

    setPreview(
      URL.createObjectURL(
        file
      )
    );

    setValidationError(
      ""
    );
  };

  const removeImage = () => {
    if (
      preview?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        preview
      );
    }

    setImageFile(null);
    setPreview("");
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setValidationError(
        ""
      );

      if (
        !form.title.trim()
      ) {
        setValidationError(
          "Blog title is required."
        );

        return;
      }

      if (
        !form.excerpt.trim()
      ) {
        setValidationError(
          "Blog excerpt is required."
        );

        return;
      }

      if (
        !form.content.trim()
      ) {
        setValidationError(
          "Blog content is required."
        );

        return;
      }

      const formData =
        new FormData();

      Object.entries(
        form
      ).forEach(
        ([
          key,
          value,
        ]) => {
          formData.append(
            key,
            String(value)
          );
        }
      );

      if (imageFile) {
        formData.append(
          "coverImage",
          imageFile
        );
      }

      await onSubmit(
        formData
      );
    };

  const shownError =
    validationError ||
    error;

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="mx-auto max-w-7xl"
    >
      {/* =================================================
          FORM HEADER
      ================================================== */}

      <div className="mb-7 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            aria-label="Go back"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-foreground transition hover:border-pink-500/40 hover:bg-pink-50 hover:text-[var(--brand-pink)] dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {initialData
                ? "Edit Blog"
                : "Create Blog"}
            </h2>

            <p className="mt-1 text-sm font-medium leading-6 text-muted-foreground">
              Write, organize and publish content for your audience.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/admin/blogs"
            className="inline-flex h-12 items-center justify-center rounded-[5px] border-2 border-[var(--brand-pink)] px-6 text-sm font-bold text-[var(--brand-pink)] transition hover:bg-pink-50 dark:hover:bg-white/10"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="brand-gradient inline-flex h-12 items-center justify-center gap-2 rounded-[5px] px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}

            {loading
              ? "Saving..."
              : submitLabel}
          </button>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================== */}

      {shownError && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-300"
        >
          {shownError}
        </div>
      )}

      {/* =================================================
          FORM LAYOUT
      ================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* =================================================
            LEFT COLUMN
        ================================================== */}

        <div className="space-y-6">
          {/* ===============================================
              BLOG CONTENT
          ================================================ */}

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div>
              <h3 className="text-lg font-black tracking-tight text-foreground">
                Blog content
              </h3>

              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Add the main title, summary and article content.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span
                  className={
                    labelClassName
                  }
                >
                  Title{" "}
                  <span className="text-[var(--brand-pink)]">
                    *
                  </span>
                </span>

                <input
                  name="title"
                  value={
                    form.title
                  }
                  onChange={
                    updateField
                  }
                  placeholder="Enter a clear blog title"
                  maxLength={150}
                  disabled={
                    loading
                  }
                  className={
                    inputClassName
                  }
                />

                <span
                  className={
                    helperClassName
                  }
                >
                  {
                    form.title
                      .length
                  }
                  /150 characters
                </span>
              </label>

              <label className="block">
                <span
                  className={
                    labelClassName
                  }
                >
                  Excerpt{" "}
                  <span className="text-[var(--brand-pink)]">
                    *
                  </span>
                </span>

                <textarea
                  name="excerpt"
                  value={
                    form.excerpt
                  }
                  onChange={
                    updateField
                  }
                  placeholder="Write a short summary of the article"
                  rows={4}
                  maxLength={350}
                  disabled={
                    loading
                  }
                  className={`${inputClassName} resize-none leading-7`}
                />

                <span className="mt-1.5 block text-right text-xs font-medium text-muted-foreground">
                  {
                    form.excerpt
                      .length
                  }
                  /350
                </span>
              </label>

              <label className="block">
                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span
                    className={
                      labelClassName
                    }
                  >
                    Content{" "}
                    <span className="text-[var(--brand-pink)]">
                      *
                    </span>
                  </span>

                  <span className="text-xs font-medium text-muted-foreground">
                    {wordCount}{" "}
                    words ·{" "}
                    {
                      estimatedReadTime
                    }{" "}
                    min read
                  </span>
                </div>

                <textarea
                  name="content"
                  value={
                    form.content
                  }
                  onChange={
                    updateField
                  }
                  placeholder="Write your blog content here. Plain text and line breaks are supported."
                  rows={20}
                  disabled={
                    loading
                  }
                  className={`${inputClassName} min-h-[480px] resize-y leading-8`}
                />
              </label>
            </div>
          </section>

          {/* ===============================================
              SEO
          ================================================ */}

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div>
              <h3 className="text-lg font-black tracking-tight text-foreground">
                Search engine details
              </h3>

              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Improve how the article appears in search results.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span
                  className={
                    labelClassName
                  }
                >
                  SEO title
                </span>

                <input
                  name="seoTitle"
                  value={
                    form.seoTitle
                  }
                  onChange={
                    updateField
                  }
                  placeholder="Defaults to the blog title"
                  maxLength={70}
                  disabled={
                    loading
                  }
                  className={
                    inputClassName
                  }
                />

                <span
                  className={
                    helperClassName
                  }
                >
                  Recommended maximum:
                  60–70 characters.
                </span>
              </label>

              <label className="block">
                <span
                  className={
                    labelClassName
                  }
                >
                  SEO description
                </span>

                <textarea
                  name="seoDescription"
                  value={
                    form.seoDescription
                  }
                  onChange={
                    updateField
                  }
                  placeholder="Defaults to the blog excerpt"
                  rows={4}
                  maxLength={170}
                  disabled={
                    loading
                  }
                  className={`${inputClassName} resize-none leading-7`}
                />

                <span className="mt-1.5 block text-right text-xs font-medium text-muted-foreground">
                  {
                    form
                      .seoDescription
                      .length
                  }
                  /170
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================== */}

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          {/* ===============================================
              COVER IMAGE
          ================================================ */}

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div>
              <h3 className="font-black text-foreground">
                Cover image
              </h3>

              <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
                Use a high-quality landscape image for the article.
              </p>
            </div>

            <div className="mt-5">
              {preview ? (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
                  <img
                    src={preview}
                    alt="Blog cover preview"
                    className="aspect-video w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  <button
                    type="button"
                    onClick={
                      removeImage
                    }
                    disabled={
                      loading
                    }
                    aria-label="Remove cover image"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background px-5 text-center transition hover:border-pink-500/60 hover:bg-pink-50/50 dark:hover:bg-white/5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
                    <UploadCloud className="h-6 w-6" />
                  </div>

                  <span className="mt-3 text-sm font-black text-foreground">
                    Upload cover image
                  </span>

                  <span className="mt-1 text-xs font-medium text-muted-foreground">
                    PNG, JPG or WEBP
                  </span>

                  <span className="mt-1 text-xs font-medium text-muted-foreground">
                    Maximum 5 MB
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={
                      handleImage
                    }
                    disabled={
                      loading
                    }
                    className="hidden"
                  />
                </label>
              )}

              {preview && (
                <label className="mt-3 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 text-sm font-bold text-foreground transition hover:border-pink-500/40 hover:text-[var(--brand-pink)]">
                  <ImagePlus className="h-4 w-4" />

                  Replace image

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={
                      handleImage
                    }
                    disabled={
                      loading
                    }
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </section>

          {/* ===============================================
              ORGANIZATION
          ================================================ */}

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div>
              <h3 className="font-black text-foreground">
                Organization
              </h3>

              <p className="mt-1 text-xs font-medium text-muted-foreground">
                Group and categorize the article.
              </p>
            </div>

            <div className="mt-5 space-y-5">
              <label className="block">
                <span
                  className={
                    labelClassName
                  }
                >
                  Category
                </span>

                <input
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    updateField
                  }
                  placeholder="General"
                  disabled={
                    loading
                  }
                  className={
                    inputClassName
                  }
                />
              </label>

              <label className="block">
                <span
                  className={
                    labelClassName
                  }
                >
                  Tags
                </span>

                <input
                  name="tags"
                  value={
                    form.tags
                  }
                  onChange={
                    updateField
                  }
                  placeholder="AI, Commerce, Creator"
                  disabled={
                    loading
                  }
                  className={
                    inputClassName
                  }
                />

                <span
                  className={
                    helperClassName
                  }
                >
                  Separate multiple tags with commas.
                </span>
              </label>
            </div>
          </section>

          {/* ===============================================
              PUBLISHING
          ================================================ */}

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div>
              <h3 className="font-black text-foreground">
                Publishing
              </h3>

              <p className="mt-1 text-xs font-medium text-muted-foreground">
                Control the article visibility and placement.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <ToggleCard
                name="published"
                title="Published"
                description="Make this blog visible to the public."
                checked={
                  form.published
                }
                onChange={
                  updateField
                }
                disabled={
                  loading
                }
              />

              <ToggleCard
                name="featured"
                title="Featured"
                description="Highlight this article on the main blog page."
                checked={
                  form.featured
                }
                onChange={
                  updateField
                }
                disabled={
                  loading
                }
                icon={Star}
              />
            </div>
          </section>

          {/* ===============================================
              MOBILE SAVE
          ================================================ */}

          <button
            type="submit"
            disabled={loading}
            className="brand-gradient flex h-12 w-full items-center justify-center gap-2 rounded-[5px] text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:hidden"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}

            {loading
              ? "Saving..."
              : submitLabel}
          </button>
        </aside>
      </div>
    </form>
  );
}

/* =========================================================
   TOGGLE CARD
========================================================= */

function ToggleCard({
  name,
  title,
  description,
  checked,
  onChange,
  disabled = false,
  icon: Icon,
}) {
  return (
    <label
      className={`flex items-center justify-between gap-4 rounded-2xl border p-4 transition ${
        checked
          ? "border-pink-500/40 bg-pink-50/60 dark:bg-pink-500/10"
          : "border-border bg-background"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:border-pink-500/40"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <Icon
            className={`mt-0.5 h-5 w-5 shrink-0 ${
              checked
                ? "text-[var(--brand-pink)]"
                : "text-muted-foreground"
            }`}
            fill={
              checked
                ? "currentColor"
                : "none"
            }
          />
        )}

        <div>
          <p className="text-sm font-black text-foreground">
            {title}
          </p>

          <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-[var(--brand-pink)]"
            : "bg-muted"
        }`}
      >
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={
            onChange
          }
          disabled={
            disabled
          }
          className="sr-only"
        />

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </div>
    </label>
  );
}