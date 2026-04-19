import React from "react";
import ProductItem from "./ProductItem";
import { nanoid } from "nanoid";
import { Product } from "../typings";

const ProductGrid = ({ 
  products 
}: { 
  products?: Product[]; 
}) => {
  return (
    <div
      id="gridTop"
      className="max-w-screen-2xl flex flex-wrap justify-between items-center gap-y-8 mx-auto mt-12 max-xl:justify-start max-xl:gap-5 px-5 max-md:gap-4 max-sm:gap-3 max-[400px]:px-3 max-[400px]:gap-2"
    >
      {products &&
        products.map((product: Product) => (
          <ProductItem
            key={nanoid()}
            id={product._id}
            image={product.defaultImage.url}
            title={product.name}
            category={product.category}
            price={product.price}
            discount={product.discount || 0}
            popularity={0}
            stock={product.stock}
          />
        ))}
    </div>
  );
};
// Memoize the component to prevent unnecessary re-renders because of React.cloneElement
export default React.memo(ProductGrid);
