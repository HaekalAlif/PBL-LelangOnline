'use client'

import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

const Searchbar: React.FC = () => {
    const [activeSearch, setActiveSearch] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')

    const sampleWords = ["apple", "banana", "cherry", "grape", "orange", "pineapple", "strawberry", "watermelon"]

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setSearchTerm(value)

        if (value === '') {
            setActiveSearch([])
            return
        }

        setActiveSearch(sampleWords.filter((w) => w.toLowerCase().includes(value.toLowerCase())).slice(0, 8))
    }

    return (
        <form className='w-[500px] relative'>
            <div className="relative">
                <input
                    type="search"
                    placeholder='Type Here'
                    className='w-full p-4 rounded-full bg-slate-800 text-white'
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button type="submit" className='absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-slate-600 rounded-full'>
                    <AiOutlineSearch />
                </button>
            </div>

            {activeSearch.length > 0 && (
                <div className="absolute top-20 p-4 bg-slate-800 text-white w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">
                    {activeSearch.map((s, index) => (
                        <span key={index}>{s}</span>
                    ))}
                </div>
            )}
        </form>
    )
}

export default Searchbar
