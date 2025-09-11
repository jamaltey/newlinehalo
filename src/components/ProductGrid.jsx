import ProductCard from './ProductCard';
import Loading from './Loading';

const ProductGrid = ({
  products,
  total,
  loading,
  loadingMore,
  onLoadMore,
  emptyMessage = 'No products found',
}) => {
  if (loading) {
    return (
      <div className="relative pt-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {products.length ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard {...product} key={index} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[70vh] items-center justify-center">
          <h2 className="text-4xl font-medium">{emptyMessage}</h2>
        </div>
      )}
      <div className="space-y-3 p-9 text-center">
        <p className="text-xs font-bold uppercase">
          Showing {products.length} of {total}
        </p>
        {total > products.length && !loadingMore && (
          <button onClick={onLoadMore} className="btn text-dark [--btn-bg:#fff]">
            Load more ({total - products.length < 32 ? total - products.length : 32})
          </button>
        )}
        {loadingMore && (
          <div className="relative mx-auto size-12">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductGrid;

