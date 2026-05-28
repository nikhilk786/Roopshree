import NewsletterSection from "@/components/shop/Newsletter";
import HeroSection from "@/components/shop/Hero";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopProducts from "@/components/shop/ShopProducts";
import {
  getCatalogCategories,
  getCatalogProductPage,
} from "@/services/product.service";

const page = async ({
  searchParams,
}: {
  searchParams?: Promise<{
    category?: string;
    page?: string;
    sort?: string;
  }>;
}) => {
  const params = await searchParams;
  const currentPage = Number(params?.page ?? 1);
  const pageSize = 12;
  const [{ items, total }, categories] = await Promise.all([
    getCatalogProductPage({
      limit: pageSize,
      offset: (Math.max(currentPage, 1) - 1) * pageSize,
      categorySlug: params?.category,
      sortBy:
        params?.sort === "newest" ||
        params?.sort === "price-low" ||
        params?.sort === "price-high"
          ? params.sort
          : "featured",
    }),
    getCatalogCategories(8),
  ]);

  console.log( "items are", items)
  return (
    <main className="flex-1 overflow-x-hidden">
      <HeroSection />
      <section className="max-w-full overflow-x-hidden bg-white py-10 md:py-14">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="mb-5 hidden gap-4 text-xs font-medium text-[#111] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
            <p>Home &nbsp;&gt;&nbsp; Shop</p>
            <p>All Categories</p>
          </div>
          <div className="grid min-w-0 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <ShopFilters />
            <ShopProducts
              products={items}
              categories={categories}
              total={total}
              currentPage={Math.max(currentPage, 1)}
            />
          </div>
          <NewsletterSection />
        </div>
      </section>
    </main>
  );
};

export default page;
