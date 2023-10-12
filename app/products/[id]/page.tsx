import { getProductById } from '@/lib/actions';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    params : {
        id : string;
    }
}

const ProductDetails = async ({params : {id}} : Props) => {

  const product = await getProductById(id);

  if(!product) redirect("/");

  return (
    <div>
        {product.title}
    </div>
  )
}

export default ProductDetails