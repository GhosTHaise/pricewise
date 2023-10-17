import Product from "@/lib/modals/product.modal";
import { connectToDb } from "@/lib/mongoose";
import { scrapeAmazonProduct } from "@/lib/scrapper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "@/utils";

export async function GET(){
    try {
        connectToDb();

        const products = await  Product.find({});

        if(!products) throw new Error("No products found.");

        //1 . SCRAPE LATEST PRODUCT DETAILS AND UPDATE DB
        const updatedProducts = await Promise.all(
            products.map(async(currentProduct)=>{
                const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

                if(!scrapedProduct) throw new Error("No products found.");

                const updatedPriceHistory : any = [
                    ...scrapedProduct.priceHistory,
                    { price : scrapedProduct.currentPrice }
                ]
    
                const product  = {
                    ...scrapedProduct,
                    priceHistory : updatedPriceHistory,
                    lowestPrice : getLowestPrice(updatedPriceHistory),
                    highestPrice : getHighestPrice(updatedPriceHistory),
                    averagePrice : getAveragePrice(updatedPriceHistory) 
                }
                const newProduct = await Product.findOneAndUpdate(
                    {url : scrapedProduct.url},
                    product,
                );
            })
        ) 
    } catch (error) {
        throw new Error(`Error in GET : ${error}`);
    }
}