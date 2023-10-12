import { getProductById } from '@/lib/actions';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    params : {
        id : string;
    }
}

const ProductDetails = async ({params : {id}} : Props) => {

  const product : Product = await getProductById(id);

  if(!product) redirect("/");

  return (
    <div className='product-container'>
        <div className='flex gap-28 xl:flex-row flex-col'>
          <div className='product-image'>
            <Image
              src={product.image}
              alt={product.title}
              height={400}
              width={580}
              className='mx-auto'
            />
          </div>

          <div
            className='flex-1 flex flex-col'
          >
            <div
              className='flex justify-between items-start gap-5 flex-wrap pb-6'
            >
              <div
                className='flex flex-col gap-3'
              >
                  <p
                    className='text-[28px] text-secondary font-semibold'
                  >
                    {product.title}
                  </p>
                  <Link
                    className='text-base text-black opacity-50'
                    href={product.url}
                    target='_blank'
                  >
                    Visit Product
                  </Link>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ProductDetails