import { useCallback, useEffect, useState } from "react";
import { productApi, Product, ProductsResponse } from "../services/productApi";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setShowingProducts,
  setTotalProducts,
} from "../features/shop/shopSlice";
import ProductGrid from "./ProductGrid";
import ShowingPagination from "./ShowingPagination";

const ProductGridWithPagination = ({
  searchQuery,
  sortCriteria,
  category,
  season,
  page,
  limit,
  onPageChange,
}: {
  searchQuery?: string;
  sortCriteria?: string;
  category?: string;
  season?: string;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<ProductsResponse['pagination'] | null>(null);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const { totalProducts } = useAppSelector((state) => state.shop);
  const dispatch = useAppDispatch();

  // Memoize the function to prevent unnecessary re-renders
  const getProducts = useCallback(
    async (query: string, sort: string, pageNum: number) => {
      try {
        let response: ProductsResponse;
        
        if (query) {
          response = await productApi.searchProducts(query, pageNum);
        } else {
          response = await productApi.getAllProducts(pageNum, category, season);
        }

        let filteredProducts = response.products;

        // Apply client-side sorting if needed
        if (sort === "price-asc") {
          filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
        } else if (sort === "price-desc") {
          filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
        } else if (sort === "popularity") {
          filteredProducts = [...filteredProducts].sort(() => 0 - 0); // No popularity field, keep original order
        }

        // Update pagination info
        setPagination(response.pagination);
        
        // Update Redux state
        if (totalProducts !== response.pagination.totalProducts) {
          dispatch(setTotalProducts(response.pagination.totalProducts));
        }

        // Apply limit if specified
        if (limit) {
          const limitedProducts = filteredProducts.slice(0, limit);
          setProducts(limitedProducts);
          dispatch(setShowingProducts(limitedProducts.length));
        } else {
          setProducts(filteredProducts);
          dispatch(setShowingProducts(filteredProducts.length));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
        dispatch(setShowingProducts(0));
      }
    },
    [category, season, totalProducts, dispatch]
  );

  useEffect(() => {
    getProducts(searchQuery || "", sortCriteria || "", currentPage);
  }, [searchQuery, sortCriteria, currentPage, getProducts]);

  // Update page when onPageChange is called
  useEffect(() => {
    if (onPageChange && page !== undefined) {
      onPageChange(currentPage);
    }
  }, [currentPage, onPageChange, page]);

  // Handle page changes from pagination controls
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <ProductGrid products={products} />
      <ShowingPagination 
        page={currentPage} 
        category={category || ""} 
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ProductGridWithPagination;
