import Product from "@/lib/modals/product.modal";
import { connectToDb } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scrapper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/utils";
import { NextResponse } from "next/server";

export const maxDuration = 10; //5minutes

export const dynamic = "force-dynamic";

export const revalidate = 0;

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
                const updatedProduct = await Product.findOneAndUpdate(
                    {url : product.url},
                    product,
                );

                //2 . CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINlY
                const emailNotifType = getEmailNotifType(scrapedProduct,currentProduct);

                if(emailNotifType && updatedProduct.users.length > 0){
                    const productInfo = {
                        title : updatedProduct.title,
                        url : updatedProduct.url
                    };

                    const email = await generateEmailBody(productInfo,emailNotifType);

                    const userEmails =  updatedProduct.users.map((user : any) => user.email);

                    await sendEmail(email,userEmails);
                }
                return updatedProduct;
            })
        );

        return NextResponse.json({
            message : "ok",
            data : updatedProducts
        })
    } catch (error) {
        throw new Error(`Error in GET : ${error}`);
    }
}