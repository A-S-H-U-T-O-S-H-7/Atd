'use client'
import { useThemeStore } from '@/lib/store/useThemeStore';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = ""
}) => {
  const { theme } = useThemeStore();

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 ${theme === "dark" ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      } border-t ${className}`}>
      <div className={`text-sm ${theme === "dark" ? 'text-gray-400' : 'text-gray-600'
        }`}>
        Showing <span className="font-medium">{startItem}-{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors ${currentPage === 1
            ? 'cursor-not-allowed opacity-50'
            : theme === "dark"
              ? 'hover:bg-gray-700'
              : 'hover:bg-gray-200'
            } ${theme === "dark"
              ? 'text-gray-300 border-gray-600'
              : 'text-gray-700 border-gray-300'
            } border`}
        >
          Previous
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors ${page === currentPage
              ? 'bg-emerald-600 text-white'
              : page === '...'
                ? 'cursor-default'
                : theme === "dark"
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
            ? 'cursor-not-allowed opacity-50'
            : theme === "dark"
              ? 'hover:bg-gray-700'
              : 'hover:bg-gray-200'
            } ${theme === "dark"
              ? 'text-gray-300 border-gray-600'
              : 'text-gray-700 border-gray-300'
            } border`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;