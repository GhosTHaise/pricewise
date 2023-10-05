"use client"
import { isValidAmazonUrl } from '@/utils'
import  {  FormEvent, useState } from 'react'

const Searchbar = () => {

    const [searchPrompt, setSearchPrompt] = useState("")

    const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValidLink = isValidAmazonUrl(searchPrompt);
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
        >
            Search
        </button>
    </form>
  )
}

export default Searchbar