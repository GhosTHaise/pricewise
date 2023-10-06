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