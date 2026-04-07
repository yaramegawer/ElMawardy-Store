import {
  ShopFilterAndSort,
} from "../components";
import ProductGridWithPagination from "./ProductGridWithPagination";
import { useState } from "react";

const ShopPageContent = ({ category, page, season} : { category: string; page: number; season?: string; }) => {
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [currentPage] = useState(page);

  return (
    <>
      <ShopFilterAndSort sortCriteria={sortCriteria} setSortCriteria={setSortCriteria} />
      <ProductGridWithPagination 
        sortCriteria={sortCriteria} 
        category={category} 
        season={season}
        page={currentPage}
      />
    </>
  );
};
export default ShopPageContent;
