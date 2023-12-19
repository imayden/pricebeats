import React from 'react';
import { getProductById, getSimilarProducts } from '@/lib/actions';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/index';
import { formatNumber } from '@/lib/utils';
import PriceInfoCard from '@/components/PriceInfoCard';
import ProductCard from '@/components/ProductCard';
import Modal from '@/components/Modal';


type Props = {
  params: { id: string }
};

const ProductDetails = async ({ params: { id } }: Props) => {

  const product: Product = await getProductById(id);

  if (!product) redirect('/');

  const similarProducts = await getSimilarProducts(id);

  return (

    <div className='product-container'>
      <div className='flex gap-28 xl:flex-row flex-col'>
        {/* Image */}
        <div className="product-image">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>

        <div className='flex-1 flex flex-col'>
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <Link
                href={product.url}
                target={"_blank"}
                className="text-[28px] text-secondary font-semibold hover:text-primary-blue">
                {product.title}
              </Link>

              <Link
                href={product.url}
                target={"_blank"}
                className='text-primary-brand text-[20px] text-lg font-semibold'
              >
                BUY NOW ➔
              </Link>
            </div>

            <div className='flex items-center gap-3'>
              <div className='product-hearts'>
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="heart"
                  width={20}
                  height={20}
                />

                <p className='text-base font-semibold text-[#D0112B]'>
                  {product.reviewsCount}
                </p>
              </div>

              <div className='p-2 bg-white-200 rounded-10'>
                <Image
                  src='/assets/icons/bookmark.svg'
                  alt='bookmark'
                  width={20}
                  height={20}
                />
              </div>

              <div className='p-2 bg-white-200 rounded-10'>
                <Image
                  src='/assets/icons/share.svg'
                  alt='share'
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>

          <div className='product-info'>
            <div className='flex flex-col gap-2'>

              <p className='text-[36px] text-primary-brand font-bold'>
                {product.currency}
                {formatNumber(product.currentPrice)}
              </p>

              <p className='text-[22px] text-[#111111] font-semibold opacity-50 line-through'>
                {product.currency}
                {formatNumber(product.originalPrice)}
              </p>
            </div>

            <div className='flex flex-col gap-4'>
              <div className='flex gap-3'>
                <div className='product-stars'>
                  <Image
                    src='/assets/icons/star.svg'
                    alt='stars'
                    width={16}
                    height={16}
                  />
                  <p className='text-sm text-primary-orange font-semibold'>
                    {product.stars || '0'}
                  </p>
                </div>

                <div className='product-reviews'>
                  <Image
                    src='/assets/icons/comment.svg'
                    alt='comment'
                    width={16}
                    height={16}
                  />

                  <p className='text-sm text-primary font-semibold'>
                    {product.reviewsCount} Reviews
                  </p>
                </div>
              </div>

              <p className="text-sm text-black opacity-50">
                <span className="text-primary-green font-semibold">93% </span> of
                buyers have recommeded this.
              </p>
            </div>
          </div>

          <div className='my-7 flex flex-col gap-5'>
            <div className='flex gap-5 flex-wrap'>

              <PriceInfoCard
                title='Current Price'
                iconSrc='/assets/icons/price-tag.svg'
                value={`${product.currency} ${formatNumber(product.currentPrice)}`}
              />

              <PriceInfoCard
                title='Average Price'
                iconSrc='/assets/icons/chart.svg'
                value={`${product.currency} ${formatNumber(product.averagePrice)}`}
              />

              <PriceInfoCard
                title='Highest Price'
                iconSrc='/assets/icons/arrow-up.svg'
                value={`${product.currency} ${formatNumber(product.highestPrice)}`}
              />

              <PriceInfoCard
                title='Lowest Price'
                iconSrc='/assets/icons/arrow-down.svg'
                value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
              />

            </div>
          </div>

          <Modal productId={id}/>

        </div>
      </div>

      <div className='flex flex-col gap-16'>
        <div className='flex flex-col gap-5'>
          <h2 className='section-text font-dysonSansModern'>
            Description&nbsp;
            {/* <span className='text-primary-brand'>beats</span> */}
          </h2>

          <div className='flex flex-col gap-4'>
            {product?.description?.split('\n')}
          </div>
        </div>

        <button className='btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]'>
          <Image
            src="/assets/icons/bag.svg"
            alt="check"
            width={22}
            height={22}
          />

          <Link
            href={product.url}
            className='text-base text-white font-dysonSansModern'
            target='_blank'
          >
            Buy Now
          </Link>
        </button>
      </div>

      {similarProducts && similarProducts?.length > 0 && (
        <div className='py-14 flex flex-col gap-2 w-full'>
          <h2 className='section-text font-dysonSansModern'>
            Trending&nbsp;
            <span className='text-primary-brand'>Deals</span>
          </h2>

          <div className='flex flex-wrap gap-10 mt-7 w-full'>
            {similarProducts.map(
              (product) => (
                <ProductCard
                  key = {product._id}
                  product={product}
                />
              )
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default ProductDetails