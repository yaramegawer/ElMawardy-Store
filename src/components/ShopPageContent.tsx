import {
  ShopFilterAndSort,
} from "../components";
import ProductGridWithPagination from "./ProductGridWithPagination";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ShopPageContent = ({ category, page, season } : { category: string; page: number; season?: string; }) => {
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(page);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentPage !== parseInt(params.get('page') || '1')) {
      params.set('page', currentPage.toString());
      const basePath = season ? `/shop/${season}` : (category ? `/shop/${category}` : '/shop');
      navigate(`${basePath}?${params.toString()}`, { replace: true });
    }
  }, [currentPage, season, category, navigate, searchParams]);

  return (
    <>
      <ShopFilterAndSort sortCriteria={sortCriteria} setSortCriteria={setSortCriteria} />
      <ProductGridWithPagination 
        sortCriteria={sortCriteria} 
        category={category} 
        season={season}
        page={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};
export default ShopPageContent;
