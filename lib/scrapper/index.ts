import { extractCurrency, extractDescription, extractPrice } from "@/utils";
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
       
        const images = 
            $("#imgBlkFront").attr("data-a-dynamic-image") ||
            $("#landingImage").attr("data-a-dynamic-image") ||
            "{}"
            ;

        const imageUrls = Object.keys(JSON.parse(images));
        
        const currency = extractCurrency($(".a-price-symbol"));
        
        const discountRate = $(".savingsPercentage").text().replace(/[-%]/g,"");

        const category = $("#nav-subnav .nav-a.nav-b span.nav-a-content").text().trim();

        const reviewsCount = extractPrice($("#centerCol #acrCustomerReviewText"));
        
        const stars = extractPrice($("#centerCol #averageCustomerReviews #acrPopover .a-size-base.a-color-base"));
        
        const description = extractDescription($);
        //console.log({title,currentPrice,originalPrice,outOfStock,images,imageUrls,currency,discountRate,category,reviewsCount,stars});

        //construct data  object with scraped information
        const data = {
            url,
            currency : currency || "$",
            image : imageUrls[0],
            title,
            currentPrice : Number(currentPrice) || Number(originalPrice),
            originalPrice : Number(currentPrice) || Number(currentPrice),
            priceHistory : [],
            discountRate : Number(discountRate) || 0,
            category,
            reviewsCount : Number(reviewsCount) || 0,
            stars : Number(stars.replace(",",".")) || 0,
            isOutOfStock : outOfStock,
            description,
            lowestPrice : Number(currentPrice) || Number(originalPrice),
            highestPrice : Number(originalPrice) || Number(currentPrice),
            average : Number(currentPrice) || Number(originalPrice),
        }

        console.log(data);
        return data;
       
    } catch (error : any) {
        throw new Error(`Failed to scrape  product : ${error.message}`);
    }
} 