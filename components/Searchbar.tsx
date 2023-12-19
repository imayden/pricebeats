"use client"
import { scrapeAndStoreProduct } from '@/lib/actions';
import { scrapeAmazonProduct } from '@/lib/scraper';
import { useState, FormEvent } from 'react'

const isValidAmazonProductURL = (url: string) => {
  try {
    const parseURL = new URL(url);
    const hostname = parseURL.hostname;

    // Check if hostname contains amazon.xx
    if (
      hostname.includes('amazon.com') || 
      hostname.includes('amazon.') || 
      hostname.includes('amazon')
      ) {
        return true;
      }
  } catch (error) {
    return false;
  }
}


const SearchBar = () => {

  const [searchPrompt, setSearchPrompt] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => { 
    event.preventDefault();
    console.log(searchPrompt);

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if(!isValidLink) return alert('Oops ... Your link does not belongs to Amazon, input an Amazon product link please!');

    // try {
    //   // Start loading firstly whatever
    //   setIsLoading(true);

    //   // Scrape the URL page
    //     const product = await scrapeAndStoreProduct(searchPrompt);
    // } catch (error) {
    //   console.log(error);
    // } finally{
    //   // Stop loading finally whatever
    //   setIsLoading(false);
    // }

    try {
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally{
      setIsLoading(false);
    }

  }

  return (
    <form
      className='flex flex-wrap gap-4 mt-2'
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder='Paste the Amazon product link here'
        className='searchbar-input'
        >
      </input>

      <button
        type="submit"
        className='searchbar-btn'
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'} 
      </button>
    </form>
  )
}

export default SearchBar