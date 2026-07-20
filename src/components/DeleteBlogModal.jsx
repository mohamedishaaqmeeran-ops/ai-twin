import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

export default function DeleteBlogModal({
  open,
  blog,
  loading = false,
  onClose,
  onConfirm,
}) {
  /* =======================================================
     CLOSE WITH ESCAPE + PREVENT BACKGROUND SCROLL
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key ===
          "Escape" &&
        !loading
      ) {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    open,
    loading,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  const handleBackdropClick = (
    event
  ) => {
    if (
      event.target ===
        event.currentTarget &&
      !loading
    ) {
      onClose?.();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-blog-title"
      aria-describedby="delete-blog-description"
      onMouseDown={
        handleBackdropClick
      }
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm"
    >
      <div
        onMouseDown={(
          event
        ) =>
          event.stopPropagation()
        }
        className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card text-foreground shadow-2xl"
      >
        {/* =================================================
            HEADER ACCENT
        ================================================== */}

        <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />

        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close delete dialog"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition hover:border-border hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h3
            id="delete-blog-title"
            className="mt-6 text-2xl font-black tracking-tight text-foreground"
          >
            Delete blog?
          </h3>

          <p
            id="delete-blog-description"
            className="mt-3 text-sm font-medium leading-7 text-muted-foreground"
          >
            You are about to permanently delete{" "}
            <span className="font-black text-foreground">
              “
              {blog?.title ||
                "this blog"}
              ”
            </span>
            . This action cannot be undone.
          </p>

          {/* =================================================
              WARNING
          ================================================== */}

          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

              <div>
                <p className="text-sm font-black text-red-600 dark:text-red-400">
                  Permanent deletion
                </p>

                <p className="mt-1 text-xs font-medium leading-5 text-muted-foreground">
                  The blog content, cover image references and related publishing information will be removed.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              ACTIONS
          ================================================== */}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center rounded-[5px] border-2 border-border bg-background px-5 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[5px] bg-red-500 px-5 text-sm font-bold text-white shadow-md transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}

              {loading
                ? "Deleting..."
                : "Delete Blog"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}