import {
  Button,
  ProductItem,
  QuantityInput,
  StandardSelectInput,
  ColorPicker,
} from "../components";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { addProductToCartWithValidation } from "../features/cart/cartThunks";
import { useAppDispatch } from "../hooks";
import WithSelectInputWrapper from "../utils/withSelectInputWrapper";
import WithNumberInputWrapper from "../utils/withNumberInputWrapper";
import { formatCategoryName } from "../utils/formatCategoryName";
import ProductImageGallery from "../components/ProductImageGallery";
import toast from "react-hot-toast";
import { Product } from "../typings.d";
import { productApi } from "../services/productApi";

const SingleProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // defining default values for input fields
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>("");
  const params = useParams<{ id: string }>();

  // Function to clean description by removing shipping and care instructions
  const cleanDescription = (description?: string): string => {
    if (!description) return '';
    
    // Remove common shipping/returns and care instruction phrases
    const unwantedPhrases = [
      /shipping.*?returns?/gi,
      /care.*?instructions?/gi,
      /wash.*?cold/gi,
      /tumble.*?dry/gi,
      /do not bleach/gi,
      /machine wash/gi,
      /free shipping/gi,
      /easy returns/gi,
      /30 days/gi,
    ];
    
    let cleaned = description;
    unwantedPhrases.forEach(phrase => {
      cleaned = cleaned.replace(phrase, '');
    });
    
    // Clean up extra whitespace and line breaks
    return cleaned.replace(/\s+/g, ' ').trim();
  };

  // defining HOC instances
  const SelectInputUpgrade = WithSelectInputWrapper(StandardSelectInput);
  const QuantityInputUpgrade = WithNumberInputWrapper(QuantityInput);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      if (params.id) {
        try {
          console.log('Fetching product with ID:', params.id);
          setLoading(true);
          setError(null);
          const data = await productApi.getProductById(params.id);
          console.log('Product data received:', data);
          setSingleProduct(data);
          // Set default values from product data
          if (data.size && data.size.length > 0) {
            setSize(data.size[0]);
          }
          if (data.color && data.color.length > 0) {
            setColor(data.color[0]);
          }
        } catch (error) {
          console.error("Failed to fetch product:", error);
          setError("Failed to load product. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchProducts = async () => {
      try {
        console.log('Fetching all products...');
        const response = await productApi.getAllProducts();
        console.log('All products received:', response.products);
        setProducts(response.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    
    fetchSingleProduct();
    fetchProducts();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!singleProduct) return;
    
    // Clear previous validation errors
    setValidationError("");
    
    // Validate that size and color are selected
    if (!size) {
      setValidationError("Please select a size before adding to cart");
      return;
    }
    
    if (!color) {
      setValidationError("Please select a color before adding to cart");
      return;
    }
    
    // Check if selected color is in stock
    const selectedColorStock = singleProduct.colorStock?.find(cs => cs.color === color);
    if (!selectedColorStock || selectedColorStock.stock <= 0) {
      setValidationError("Selected color is out of stock");
      return;
    }
    
    if (quantity > selectedColorStock.stock) {
      setValidationError(`Only ${selectedColorStock.stock} items available in ${color}`);
      return;
    }
    
    const productData = {
      id: singleProduct._id + size + color,
      _id: singleProduct._id,
      name: singleProduct.name,
      price: singleProduct.price,
      quantity: quantity,
      description: singleProduct.description,
      images: singleProduct.images,
      defaultImage: singleProduct.defaultImage,
      cloudFolder: singleProduct.cloudFolder,
      category: singleProduct.category,
      season: singleProduct.season,
      stock: singleProduct.stock,
      size,
      color,
    };
    
    // Dispatch thunk action that handles validation
    dispatch(addProductToCartWithValidation(productData))
      .unwrap()
      .then((result) => {
        if (result.quantity < quantity) {
          toast.success(`Only ${result.quantity} items available. Quantity adjusted to maximum.`);
        }
        toast.success("Product added to cart successfully!");
        navigate('/cart');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-5 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondaryBrown mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-screen-2xl mx-auto px-5 py-20 text-center">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-secondaryBrown text-white rounded hover:bg-secondaryBrown/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show not found state
  if (!singleProduct) {
    return (
      <div className="max-w-screen-2xl mx-auto px-5 py-20 text-center">
        <p className="text-gray-600 text-lg">Product not found.</p>
        <button 
          onClick={() => window.history.back()} 
          className="mt-4 px-6 py-2 bg-secondaryBrown text-white rounded hover:bg-secondaryBrown/80 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-5 max-[400px]:px-3">
      <div className="grid grid-cols-2 gap-x-12 max-lg:grid-cols-1 max-lg:gap-x-8">
        {/* Left side - Product Images */}
        <div className="lg:col-span-1">
          <ProductImageGallery 
            images={singleProduct.images} 
            defaultImage={singleProduct.defaultImage} 
          />
        </div>
        
        {/* Right side - Product Details and Options */}
        <div className="w-full flex flex-col gap-6 mt-6 lg:mt-0">
          {/* Product Title and Price */}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold">{singleProduct?.name}</h1>
            <div className="flex justify-between items-center">
              <p className="text-base text-secondaryBrown">
                {formatCategoryName(singleProduct?.category || "")}
              </p>
              <p className="text-2xl font-bold">${ singleProduct?.price }</p>
            </div>
            {/* Stock Status */}
            <div className="mt-2">
              {singleProduct?.stock > 0 ? (
                <span className="text-green-600 font-semibold">
                  In Stock
                </span>
              ) : (
                <span className="text-red-600 font-semibold">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {cleanDescription(singleProduct?.description) || 'No description available.'}
            </p>
          </div>

          {/* Product Options */}
          <div className="flex flex-col gap-4">
            {/* Size Selection */}
            {singleProduct?.size && singleProduct.size.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Size</label>
                <SelectInputUpgrade
                  selectList={singleProduct?.size?.map(s => ({ id: s.toLowerCase(), value: s.toUpperCase() })) || []}
                  value={size.toLowerCase()}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSize(e.target.value)
                  }
                />
              </div>
            )}

            {/* Color Selection */}
            {singleProduct?.colorStock && singleProduct.colorStock.length > 0 && (
              <ColorPicker
                colors={singleProduct.colorStock}
                selectedColor={color}
                onColorChange={setColor}
              />
            )}

            {/* Quantity Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Quantity</label>
              <QuantityInputUpgrade
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuantity(parseInt(e.target.value))
                }
              />
            </div>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="text-red-600 text-sm font-medium">
              {validationError}
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            text={(() => {
              if (!singleProduct) return "Loading...";
              if (singleProduct?.stock <= 0) return "Out of Stock";
              if (!size || !color) return "Select Options";
              return "Add to Cart";
            })()}
            mode={(() => {
              if (!singleProduct) return "disabled";
              if (singleProduct?.stock <= 0) return "disabled";
              if (!size || !color) return "disabled";
              return "black";
            })()}
            onClick={handleAddToCart}
            disabled={!singleProduct || singleProduct?.stock <= 0 || !size || !color}
          />
        </div>
      </div>

      {/* Similar Products */}
      <div>
        <h2 className="text-black/90 text-5xl mt-24 mb-12 text-center max-lg:text-4xl">
          Similar Products
        </h2>
        <div className="flex flex-wrap justify-between items-center gap-y-8 mt-12 max-xl:justify-start max-xl:gap-5 ">
          {products
            .filter((product: Product) => 
              product.category === singleProduct?.category && 
              product._id !== singleProduct?._id
            )
            .slice(0, 3)
            .map((product: Product) => (
              <ProductItem
                key={product._id}
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
      </div>
    </div>
  );
};
export default SingleProduct;
