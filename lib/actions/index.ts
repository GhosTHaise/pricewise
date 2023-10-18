"use server"

import { revalidatePath } from "next/cache";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "@/utils";
import Product from "../modals/product.modal";
import { connectToDb } from "../mongoose";
import { scrapeAmazonProduct } from "../scrapper";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

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
        //console.log(product);
        
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

export async function getSimilarProduct(productId : string){
    try {
        connectToDb();

        const currentProduct = await Product.findById(productId);

        if(!currentProduct) return ;

        const similarProducts = await Product.find({
             _id : { $ne : productId}
        }).limit(3);

        return similarProducts;
    } catch (error) {
        console.log(error);
    }
}

export async function addUserEmailToProduct(productId : string,userEmail : string){
    console.log("Prepare Email !");
    
    try {
        connectToDb();
        
        //send your first email...
        const product = await Product.findById(productId);

        if(!product) return ;

        const userExists = product.users.some((user : User) =>  user.email === userEmail);

        if(!userExists){
            product.users.push({ email : userEmail});
            await product.save();

            const emailContent = await generateEmailBody(product, "WELCOME");
            console.log("Sending Email ...");
            await sendEmail(emailContent,[userEmail]);
            console.log("Email sent !");
        }
    } catch (error) {
        console.log(error);
    }
}