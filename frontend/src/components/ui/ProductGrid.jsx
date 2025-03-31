import ProductCard from "./ProductCard"
import { Link } from "react-router-dom"

const ProductGrid = ({ products, productType = null }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No products found</p>
      </div>
    )
  }

  // Filter products by type if productType is provided
  const filteredProducts = productType ? products.filter((product) => product.type === productType) : products

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {filteredProducts.map((product) => (
        <Link key={product.id} to={`/product/${product.id}`} className="block">
          <ProductCard product={product} />
        </Link>
      ))}
    </div>
  )
}

export default ProductGrid

