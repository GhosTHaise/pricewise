export const isValidAmazonUrl = (url : string) => {
    try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;
        
        //Check if hostname contains amazon.com
        if(
            hostname.includes("amazon.com")
            ||
            hostname.includes("amazon")
            ||
            hostname.endsWith("amazon")
        ){
            return true;
        }
    } catch (error) {
        return false;
    }
    return false;
}

export function extractPrice(...elements : any){
    for(const element of elements){
        const priceText = element.text().trim();
        ///[^\d,]/g
        if(priceText) return priceText.replace(/[^\d.,]/g,"");
    }
    return "";
}

export function extractCurrency(element : any){
    const currentText = element.text().trim().slice(0,1);

    return currentText || ""; 
}