"use server"

import { revalidatePath } from "next/cache";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "@/utils";
import Product from "../modals/product.modal";
import { connectToDb } from "../mongoose";
import { scrapeAmazonProduct } from "../scrapper";

export async function scrapeAndStoreProduct(productUrl : string){
    if(!productUrl) return;

    try {
        await connectToDb()

        const scrapedProduct = await scrapeAmazonProduct(productUrl);

        if(!scrapedProduct) return ;

        let product = scrapedProduct;

        const existingProduct = await Product.findOne({
            url : scrapedProduct.url
        });

        if(existingProduct){
            const updatedPriceHistory : any = [
                ...existingProduct.priceHistory,
                { price : scrapedProduct.currentPrice }
            ]

            product  = {
                ...scrapedProduct,
                priceHistory : updatedPriceHistory,
                lowestPrice : getLowestPrice(updatedPriceHistory),
                highestPrice : getHighestPrice(updatedPriceHistory),
                averagePrice : getAveragePrice(updatedPriceHistory) 
            }
        }
        console.log(product);
        
        const newProduct = await Product.findOneAndUpdate(
                {url : scrapedProduct.url},
                product,
                {upsert : true,new : true}
        );

        revalidatePath(`/products/${newProduct._id}`);
    } catch (error : any) {
        throw new Error(`Failed to create/update product : ${error.message}`)
    }
}

export async function getProductById(productId : string){
    try {
        connectToDb();

        const product = await Product.findOne({_id : productId});
        
        if(!product) return ;

        return product;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllProducts(){
    try {
        connectToDb();

        const products = await Product.find();

        if(!products) return ;

        return products;
    } catch (error) {
        console.log(error);
    }
}