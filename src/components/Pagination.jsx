import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   PAGINATION
========================================================= */

export default function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  const start = Math.max(
    1,
    page - 2
  );

  const end = Math.min(
    totalPages,
    page + 2
  );

  for (
    let value = start;
    value <= end;
    value += 1
  ) {
    pages.push(value);
  }

  const goToPage = (
    value
  ) => {
    if (
      value < 1 ||
      value > totalPages ||
      value === page
    ) {
      return;
    }

    onPageChange?.(value);
  };

  const buttonClass =
    "inline-flex h-11 items-center justify-center rounded-2xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)] disabled:pointer-events-none disabled:opacity-40";

  const pageClass = (
    active
  ) =>
    active
      ? "brand-gradient flex h-11 min-w-[44px] items-center justify-center rounded-2xl px-4 text-sm font-black text-white shadow-md"
      : "flex h-11 min-w-[44px] items-center justify-center rounded-2xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)]";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
    >
      {/* ===============================================
          PREVIOUS
      ================================================ */}

      <button
        type="button"
        onClick={() =>
          goToPage(page - 1)
        }
        disabled={page <= 1}
        aria-label="Previous page"
        className={buttonClass}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">
          Previous
        </span>
      </button>

      {/* ===============================================
          PAGE NUMBERS
      ================================================ */}

      <div className="flex flex-wrap items-center justify-center gap-2">
        {start > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                goToPage(1)
              }
              className={pageClass(
                false
              )}
            >
              1
            </button>

            {start > 2 && (
              <span className="px-1 text-sm font-bold text-muted-foreground">
                …
              </span>
            )}
          </>
        )}

        {pages.map(
          (value) => (
            <button
              key={value}
              type="button"
              aria-current={
                value === page
                  ? "page"
                  : undefined
              }
              onClick={() =>
                goToPage(
                  value
                )
              }
              className={pageClass(
                value === page
              )}
            >
              {value}
            </button>
          )
        )}

        {end < totalPages && (
          <>
            {end <
              totalPages -
                1 && (
              <span className="px-1 text-sm font-bold text-muted-foreground">
                …
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                goToPage(
                  totalPages
                )
              }
              className={pageClass(
                false
              )}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* ===============================================
          NEXT
      ================================================ */}

      <button
        type="button"
        onClick={() =>
          goToPage(page + 1)
        }
        disabled={
          page >= totalPages
        }
        aria-label="Next page"
        className={buttonClass}
      >
        <span className="hidden sm:inline">
          Next
        </span>

        <ChevronRight className="ml-2 h-4 w-4" />
      </button>
    </nav>
  );
}