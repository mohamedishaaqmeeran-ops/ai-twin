import {
  CalendarDays,
  Edit3,
  Eye,
  FileText,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
};

/* =========================================================
   BLOG TABLE
========================================================= */

export default function BlogTable({
  blogs = [],
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}) {
  const [
    openMenu,
    setOpenMenu,
  ] = useState(null);

  const menuRef =
    useRef(null);

  /* =======================================================
     CLOSE ACTION MENU
  ======================================================= */

  useEffect(() => {
    const closeMenu = (
      event
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {
        setOpenMenu(null);
      }
    };

    const closeWithEscape = (
      event
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      closeMenu
    );

    document.addEventListener(
      "keydown",
      closeWithEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeMenu
      );

      document.removeEventListener(
        "keydown",
        closeWithEscape
      );
    };
  }, []);

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!blogs.length) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-border bg-card px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-[var(--brand-pink)] dark:bg-white/10">
          <FileText className="h-8 w-8" />
        </div>

        <h3 className="mt-5 text-xl font-black tracking-tight text-foreground">
          No blogs found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-7 text-muted-foreground">
          Create your first blog article or change the current search and filter options.
        </p>

        <Link
          to="/admin/blogs/create"
          className="brand-gradient mt-6 inline-flex h-11 items-center justify-center rounded-[5px] px-6 text-sm font-bold text-white shadow-md transition hover:opacity-90"
        >
          Create Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* =================================================
          DESKTOP TABLE
      ================================================== */}

      <div className="hidden overflow-visible rounded-3xl border border-border bg-card shadow-sm lg:block">
        <div className="overflow-x-auto rounded-3xl">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-4">
                  Blog
                </th>

                <th className="px-5 py-4">
                  Category
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Performance
                </th>

                <th className="px-5 py-4">
                  Date
                </th>

                <th className="px-5 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {blogs.map(
                (blog) => (
                  <tr
                    key={
                      blog._id
                    }
                    className="border-b border-border transition last:border-0 hover:bg-muted/20"
                  >
                    {/* =====================================
                        BLOG
                    ====================================== */}

                    <td className="min-w-[340px] px-5 py-4">
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/admin/blogs/${blog._id}/edit`}
                          className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-background"
                        >
                          {blog.coverImage ? (
                            <img
                              src={
                                blog.coverImage
                              }
                              alt={
                                blog.title
                              }
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-100 via-orange-50 to-background dark:from-white/10 dark:via-background dark:to-white/5">
                              <FileText className="h-5 w-5 text-[var(--brand-pink)]" />
                            </div>
                          )}
                        </Link>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/blogs/${blog._id}/edit`}
                              className="line-clamp-1 font-black text-foreground transition hover:text-[var(--brand-pink)]"
                            >
                              {blog.title}
                            </Link>

                            {blog.featured && (
                              <Star
                                className="h-4 w-4 shrink-0 text-amber-500"
                                fill="currentColor"
                              />
                            )}
                          </div>

                          <p className="mt-1 line-clamp-1 max-w-[260px] text-xs font-medium text-muted-foreground">
                            /blog/
                            {blog.slug}
                          </p>

                          {blog.excerpt && (
                            <p className="mt-1.5 line-clamp-1 max-w-[300px] text-xs text-muted-foreground">
                              {blog.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* =====================================
                        CATEGORY
                    ====================================== */}

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground">
                        {blog.category ||
                          "General"}
                      </span>
                    </td>

                    {/* =====================================
                        STATUS
                    ====================================== */}

                    <td className="px-5 py-4">
                      <StatusBadge
                        published={
                          blog.published
                        }
                      />
                    </td>

                    {/* =====================================
                        PERFORMANCE
                    ====================================== */}

                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-muted-foreground">
                        <Eye className="h-4 w-4 text-[var(--brand-pink)]" />

                        {blog.views ||
                          0}{" "}
                        views
                      </div>
                    </td>

                    {/* =====================================
                        DATE
                    ====================================== */}

                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-muted-foreground">
                        <CalendarDays className="h-4 w-4 text-[var(--brand-pink)]" />

                        {formatDate(
                          blog.createdAt
                        )}
                      </div>
                    </td>

                    {/* =====================================
                        ACTIONS
                    ====================================== */}

                    <td className="relative px-5 py-4 text-right">
                      <ActionMenu
                        blog={blog}
                        openMenu={
                          openMenu
                        }
                        setOpenMenu={
                          setOpenMenu
                        }
                        menuRef={
                          menuRef
                        }
                        onDelete={
                          onDelete
                        }
                        onTogglePublish={
                          onTogglePublish
                        }
                        onToggleFeatured={
                          onToggleFeatured
                        }
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
          MOBILE AND TABLET CARDS
      ================================================== */}

      <div className="grid gap-4 lg:hidden">
        {blogs.map(
          (blog) => (
            <article
              key={
                blog._id
              }
              className="rounded-3xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <Link
                  to={`/admin/blogs/${blog._id}/edit`}
                  className="h-20 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-background sm:h-24 sm:w-32"
                >
                  {blog.coverImage ? (
                    <img
                      src={
                        blog.coverImage
                      }
                      alt={
                        blog.title
                      }
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-100 via-orange-50 to-background dark:from-white/10 dark:via-background dark:to-white/5">
                      <FileText className="h-6 w-6 text-[var(--brand-pink)]" />
                    </div>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        to={`/admin/blogs/${blog._id}/edit`}
                        className="line-clamp-2 font-black leading-6 text-foreground transition hover:text-[var(--brand-pink)]"
                      >
                        {blog.title}
                      </Link>

                      <p className="mt-1 line-clamp-1 text-xs font-medium text-muted-foreground">
                        {blog.category ||
                          "General"}
                      </p>
                    </div>

                    <ActionMenu
                      blog={blog}
                      openMenu={
                        openMenu
                      }
                      setOpenMenu={
                        setOpenMenu
                      }
                      menuRef={
                        menuRef
                      }
                      onDelete={
                        onDelete
                      }
                      onTogglePublish={
                        onTogglePublish
                      }
                      onToggleFeatured={
                        onToggleFeatured
                      }
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusBadge
                      published={
                        blog.published
                      }
                    />

                    {blog.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Star
                          className="h-3 w-3"
                          fill="currentColor"
                        />

                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs font-semibold text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[var(--brand-pink)]" />

                  {blog.views ||
                    0}{" "}
                  views
                </div>

                <div className="inline-flex items-center justify-end gap-2">
                  <CalendarDays className="h-4 w-4 text-[var(--brand-pink)]" />

                  {formatDate(
                    blog.createdAt
                  )}
                </div>
              </div>
            </article>
          )
        )}
      </div>
    </>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  published,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${
        published
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          published
            ? "bg-emerald-500"
            : "bg-amber-500"
        }`}
      />

      {published
        ? "Published"
        : "Draft"}
    </span>
  );
}

/* =========================================================
   ACTION MENU
========================================================= */

function ActionMenu({
  blog,
  openMenu,
  setOpenMenu,
  menuRef,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}) {
  const isOpen =
    openMenu ===
    blog._id;

  const closeMenu = () => {
    setOpenMenu(null);
  };

  return (
    <div
      ref={
        isOpen
          ? menuRef
          : null
      }
      className="relative inline-block"
    >
      <button
        type="button"
        onClick={() =>
          setOpenMenu(
            isOpen
              ? null
              : blog._id
          )
        }
        aria-label={`Open actions for ${blog.title}`}
        aria-expanded={
          isOpen
        }
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition hover:border-border hover:bg-background hover:text-foreground"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-border bg-card p-2 text-left shadow-2xl">
          <Link
            to={`/blog/${blog.slug}`}
            target="_blank"
            rel="noreferrer"
            onClick={
              closeMenu
            }
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-background hover:text-foreground"
          >
            <Eye className="h-4 w-4" />

            Preview
          </Link>

          <Link
            to={`/admin/blogs/${blog._id}/edit`}
            onClick={
              closeMenu
            }
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-background hover:text-foreground"
          >
            <Edit3 className="h-4 w-4" />

            Edit
          </Link>

          <button
            type="button"
            onClick={() => {
              onTogglePublish?.(
                blog
              );

              closeMenu();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-background hover:text-foreground"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                blog.published
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
            />

            {blog.published
              ? "Move to draft"
              : "Publish"}
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleFeatured?.(
                blog
              );

              closeMenu();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-background hover:text-foreground"
          >
            <Star
              className={`h-4 w-4 ${
                blog.featured
                  ? "text-amber-500"
                  : ""
              }`}
              fill={
                blog.featured
                  ? "currentColor"
                  : "none"
              }
            />

            {blog.featured
              ? "Remove featured"
              : "Mark featured"}
          </button>

          <div className="my-1 border-t border-border" />

          <button
            type="button"
            onClick={() => {
              onDelete?.(
                blog
              );

              closeMenu();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />

            Delete
          </button>
        </div>
      )}
    </div>
  );
}