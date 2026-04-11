import { HiChevronUp, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { ProductsResponse } from "../services/productApi";

const ShowingPagination = ({
  page,
  category,
  pagination,
  onPageChange,
}: {
  page: number;
  category: string;
  pagination?: ProductsResponse['pagination'] | null;
  onPageChange?: (page: number) => void;
}) => {
  const { totalProducts, showingProducts } = useAppSelector(state => state.shop);
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    const basePath = category ? `/shop/${category}` : '/shop';
    navigate(`${basePath}?page=${newPage}`);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const totalPages = pagination?.totalPages || 1;
  const currentPage = page;
  
  // Generate page numbers to show
  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisible - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="px-5 max-[400px]:px-3 mt-12 mb-24">
      <div className="flex flex-col gap-6 justify-center items-center w-full mx-auto max-sm:w-3/4 max-sm:gap-5">
        <p className="text-xl max-sm:text-lg mb-4">
          Showing {showingProducts} of {pagination?.totalProducts || totalProducts}
        </p>
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`px-3 py-2 rounded-lg border ${
              currentPage <= 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            } border`}
          >
            <HiChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {visiblePages.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-2 rounded-lg border ${
                pageNum === currentPage
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              } border`}
            >
              {pageNum}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-3 py-2 rounded-lg border ${
              currentPage >= totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            } border`}
          >
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>

                
        <a href="#gridTop" className="flex justify-center items-center text-xl gap-2 max-sm:text-lg">
          Back to Top <HiChevronUp />
        </a>
      </div>
    </div>
  );
};
export default ShowingPagination;
