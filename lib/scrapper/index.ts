import { extractPrice } from "@/utils";
import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeAmazonProduct(url : string){
    if(!url) return ;

    //brightData proxy configuration 
    const username = String(process.env.NEXT_BRIGHT_DATA_USERNAME);
    const password = String(process.env.NEXT_BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (10000 * Math.random()) | 0;
    
    const options = {
        auth : {
            username : `${username}-${session_id}`,
            password,
            host : "brd.superproxy.io",
            port,
            rejectUnauthorized : false
        }
    }
    
    try {
        //fetch product page
       const response = await axios.get(url,options);

       const $ = cheerio.load(response.data);

       //extract the product title
       const title = $('#productTitle').text().trim();
       const currentPrice = extractPrice(
            $(".priceToPay span.a-price-whole"),
            $("a.size.base.a-color-price"),
            $(".a-button-selected .a-color-base"),
       );
        const originalPrice = extractPrice(
            $("#priceblock_ourprice"),
            $(".a-price.a-text-price span.a-offscreen"),
            $(".a-price.a-text-price"),
            $("#listPrice"),
            $("#priceblock_dealprice"),
            $(".a-size-base.a-color-price")
        );

        const outOfStock = ["currently unvailable","Actuellement indisponible."].includes($("#availability span").text().trim().toLocaleLowerCase());
       
        const image = 
            $("imgBlkFront").attr("data-a-dynamic-image") ||
            $("landingImage").attr("data-a-dynamic-image");

        console.log({title,currentPrice,originalPrice,outOfStock,image});
       
    } catch (error : any) {
        throw new Error(`Failed to scrape  product : ${error.message}`);
    }
} 