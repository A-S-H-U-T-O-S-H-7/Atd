'use client'
import { useThemeStore } from '@/lib/store/useThemeStore';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100, 200, 500, 1000, 2000],
  className = ""
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }

    return pages;
  };

  // -------------------------------------------------------------------------
  // handlePageClick
  //
  // For normal clicks  → call onPageChange so React state updates and the
  //                       parent's useEffect re-fetches.
  //
  // For Ctrl/Cmd click → build a URL that carries BOTH the clicked page AND
  //                       the current itemsPerPage so the new tab initialises
  //                       both values correctly and highlights the right page.
  // -------------------------------------------------------------------------
  const handlePageClick = (page, e) => {
    e.preventDefault();
    if (typeof page !== 'number') return; // ignore '...' clicks

    if (e.ctrlKey || e.metaKey) {
      const url = new URL(window.location.href);
      url.searchParams.set('page', page);       // the page the user clicked
      url.searchParams.set('limit', itemsPerPage); // the currently selected limit
      window.open(url.toString(), '_blank');
    } else {
      onPageChange(page);
    }
  };

  const btnBase = `px-3 py-2 rounded-lg text-sm font-medium transition-colors`;
  const borderCls = isDark ? 'border-gray-600' : 'border-gray-300';
  const textCls = isDark ? 'text-gray-300' : 'text-gray-700';

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      } ${className}`}
    >
      {/* ── Left: items-per-page selector + page buttons ── */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">

        {/* Items-per-page dropdown */}
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 cursor-pointer ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-emerald-500'
              : 'bg-white border-gray-300 text-gray-700 focus:ring-emerald-400'
          }`}
        >
          {itemsPerPageOptions.map((opt) => (
            <option key={opt} value={opt}>{opt} / page</option>
          ))}
        </select>

        {/* Page buttons */}
        <div className="flex items-center gap-1">

          {/* Previous */}
          <button
            onClick={(e) => handlePageClick(currentPage - 1, e)}
            disabled={currentPage === 1}
            title="Previous page (Ctrl+Click opens in new tab)"
            className={`${btnBase} border ${borderCls} ${textCls} ${
              currentPage === 1
                ? 'opacity-40 cursor-not-allowed'
                : isDark ? 'hover:bg-gray-700 cursor-pointer' : 'hover:bg-gray-200 cursor-pointer'
            }`}
          >
            Previous
          </button>

          {/* Numbered pages */}
          {getVisiblePages().map((page, idx) => (
            <button
              key={idx}
              onClick={(e) => handlePageClick(page, e)}
              disabled={page === '...'}
              title={typeof page === 'number' ? `Page ${page} (Ctrl+Click opens in new tab)` : ''}
              className={`${btnBase} ${
                page === currentPage
                  ? 'bg-emerald-600 text-white cursor-default shadow-sm'  // ← active page highlight
                  : page === '...'
                  ? `cursor-default ${isDark ? 'text-gray-500' : 'text-gray-400'}`
                  : `cursor-pointer border ${borderCls} ${textCls} ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={(e) => handlePageClick(currentPage + 1, e)}
            disabled={currentPage === totalPages}
            title="Next page (Ctrl+Click opens in new tab)"
            className={`${btnBase} border ${borderCls} ${textCls} ${
              currentPage === totalPages
                ? 'opacity-40 cursor-not-allowed'
                : isDark ? 'hover:bg-gray-700 cursor-pointer' : 'hover:bg-gray-200 cursor-pointer'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* ── Right: result count ── */}
      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Showing{' '}
        <span className="font-medium">{startItem}–{endItem}</span>
        {' '}of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>
    </div>
  );
};

export default Pagination;