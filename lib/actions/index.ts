"use server"

import { connectToDb } from "../mongoose";
import { scrapeAmazonProduct } from "../scrapper";

export async function scrapeAndStoreProduct(productUrl : string){
    if(!productUrl) return;

    try {
        await connectToDb()

        const scraperProduct = await scrapeAmazonProduct(productUrl);

        if(!scraperProduct) return ;

    } catch (error : any) {
        throw new Error(`Failed to create/update product : ${error.message}`)
    }
}