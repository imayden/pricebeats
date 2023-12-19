import Image from 'next/image';
import SearchBar from '@/components/Searchbar';
import HeroCarousel from '@/components/HeroCarousel';
import { getAllProducts } from '@/lib/actions';
import ProductCard from '@/components/ProductCard';

const Home = async () => {

  const allProducts = await getAllProducts();

  return (
    <>
      {/* title section */}
      <section className="px-6 md:px-20 py-24 border-lightgray-500 ">
        <div className="flex max-xl:flex-col gap-16"> 
          <div className="flex flex-col justify-center">
            <p className="small-text font-dysonSansModern ">
              START SAVING TODAY
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>

            {/* home title */}
            <h1 className='head-text font-dysonSansModern'>
              <span className='text-primary-brand'>beat</span> the peaks&nbsp;·&nbsp; 
              <span className='text-primary-brand'>catch</span> the lows
            </h1>
            {/* description */}
            <p className='mt-6'>
              Website description here
            </p>

            {/* serach bar */}
            <SearchBar />

          </div>

          {/* hero carousel */}
          < HeroCarousel />
        </div>
      </section>

      {/* content section */}
      <section className='trending-section'>

        {/* title */}
        <h2 className='section-text font-dysonSansModern'>
          trending&nbsp;
          <span className='text-primary-brand'>beats</span>
        </h2>


        {/* item wrapper */}
        <div className='flex flex-wrap gap-x-8 gap-y-16'>
          {allProducts?.map((product) => (
            <ProductCard
              key={product.id} product={product}
            />
          ))
          }
        </div>

      </section>
    </>
  )
}

export default Home