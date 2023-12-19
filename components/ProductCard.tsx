import React from 'react'
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    return (
        <Link
            href={`/products/${product._id}` }
            target='_blank'
            className='product-card'>

            {/* Product Image */}
            <div className="product-card_img-container">
                <Image
                    src={product.image}
                    alt={product.title}
                    width={250}
                    height={250}
                    className="product-card_img"
                />
            </div>

            {/* Product Info */}
            <div className='flex flex-col gap-3'>
                <h3 className='product-title'>
                    {product.title}
                </h3>
            </div>

            <div className='flex justify-between'>

                {/* Product Catagory */}
                <p className='text-black opacity-50 text-lg capitalize'>
                    {product.category}
                </p>

                {/* Product Price Currency & Price */}
                <p className='text-primary-brand text-lg font-semibold'>
                    <span>{product.currency}</span>
                    <span>{product.currentPrice}</span>
                </p>
            </div>

        </Link>
    )
}

export default ProductCard