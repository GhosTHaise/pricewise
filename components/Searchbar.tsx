"use client"
import { isValidAmazonUrl } from '@/utils'
import  {  FormEvent, useState } from 'react'

const Searchbar = () => {

    const [searchPrompt, setSearchPrompt] = useState(""); 
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValidLink = isValidAmazonUrl(searchPrompt);
        
        //alert(isValidLink ? "valid link" : "not valid link");

        if(!isValidLink) return alert("Please provide a valid Amazon link !");

        try {
            setIsLoading(true);

            //scrape our first content
        } catch (error) {
            console.log(error);
            
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <form
        className='flex flex-wrap gap-4 mt-12'
        onSubmit={handleSubmit}
    >
        <input 
            type="text" 
            className='searchbar-input' 
            placeholder='Enter product link' 
            value={searchPrompt}
            onChange={(e : React.ChangeEvent<HTMLInputElement>) => setSearchPrompt(e.target.value)}
        />
        <button
            type='submit'
            className='searchbar-btn'
            disabled={isLoading || searchPrompt === ""}
        >
            {isLoading ? "Searching..."  : "Search"}
        </button>
    </form>
  )
}

export default Searchbar