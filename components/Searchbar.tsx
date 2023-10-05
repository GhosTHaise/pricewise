"use client"
import  {  useState } from 'react'

const Searchbar = () => {

    const [searchPrompt, setSearchPrompt] = useState("")

    const handleSubmit = () => {

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
            onChange={(e) => setSearchPrompt(e.target.value)}
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