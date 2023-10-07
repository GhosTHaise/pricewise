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
       console.log(response);
       
    } catch (error : any) {
        throw new Error(`Failed to scrape  product : ${error.message}`);
    }
} 