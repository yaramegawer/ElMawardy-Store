import { Link } from "react-router-dom";
import { formatCategoryName } from "../utils/formatCategoryName";

const ProductItem = ({
  id,
  image,
  title,
  category,
  price,
  discount,
  popularity: _popularity,
  stock: _stock,
}: {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
  discount: number;
  popularity: number;
  stock: number;
}) => {
  const isInStock = _stock > 0;
  const hasDiscount = discount > 0;
  const originalPrice = hasDiscount ? price / (1 - discount / 100) : price;

  return (
    <div className="w-[400px] flex flex-col gap-2 justify-between h-full md:max-lg:w-[350px] max-md:w-[48%] max-sm:w-[48%] max-[400px]:w-[48%]">
      <Link
        to={`/product/${id}`}
        className="w-full h-[300px] max-md:h-[200px] overflow-hidden relative"
      >
        <img 
          src={image} 
          alt={title} 
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-300 ${
            !isInStock ? 'grayscale opacity-60' : 'hover:scale-105'
          }`}
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg font-semibold text-sm z-10">
            -{discount}%
          </div>
        )}
        {!isInStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-lg">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      <Link
        to={`/product/${id}`}
        className="text-black text-center text-3xl tracking-[1.02px] max-md:text-2xl h-[2.5rem] flex items-center justify-center overflow-hidden"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}
      >
        <h2>{title}</h2>
      </Link>
      <p className="text-secondaryBrown text-lg tracking-wide text-center max-md:text-base">
        {formatCategoryName(category)}{" "}
      </p>
      <div className="text-center">
        {hasDiscount ? (
          <div className="flex flex-col items-center gap-1">
            <p className="text-red-500 text-2xl font-bold max-md:text-xl">
              {price.toFixed(2)} egp
            </p>
            <p className="text-gray-500 text-lg line-through max-md:text-base">
              {originalPrice.toFixed(2)} egp
            </p>
          </div>
        ) : (
          <p className="text-black text-2xl font-bold max-md:text-xl">
            {price.toFixed(2)} egp
          </p>
        )}
      </div>
      <div className="w-full flex flex-col gap-1">
        <div className="text-center mb-2">
          {isInStock ? (
            <span className="text-green-600 font-semibold">In Stock</span>
          ) : (
            <span className="text-red-600 font-semibold">Out of Stock</span>
          )}
        </div>
        <Link
          to={`/product/${id}`}
          className={`text-center text-xl font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center max-md:text-base ${
            isInStock 
              ? 'text-white bg-secondaryBrown hover:bg-secondaryBrown/90' 
              : 'text-gray-400 bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isInStock ? 'View product' : 'Out of Stock'}
        </Link>
      </div>
    </div>
  );
};
export default ProductItem;
