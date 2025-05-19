'use client'
import React, { useState } from 'react'
import Link from 'next/link'

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false)

    return (
        <header className='bg-blue-400 text-white shadow-md'>
            <div className='container mx-auto px-4'>
                <nav className='flex items-center justify-between h-16'>
                    {/* logo */}
                    <div className='text-2xl front-bold'>
                        <Link href='/'>Crypto converter</Link>
                    </div>

                    {/* Mobile munu button */}
                    <div className='md:hidden'>
                        <button onClick={()=> setIsNavOpen(!isNavOpen)}>
                        ☰
                        </button>
                    </div>

                    {/* Desktop navigation */}
                    <ul className='hidden md:flex space-x-8'>
                        <li><Link href='/'  prefetch={true} className='hover:text-yellow-300'>Home</Link></li>
                        <li><Link href='/history'  prefetch={true} className='hover:text-yellow-300'>History</Link></li>
                        <li><Link href='/about'  prefetch={true} className='hover:text-yellow-300'>About</Link></li>
                    </ul>
                </nav>

                {/* Mobile navigate */}
                {isNavOpen && (
                    <ul className='md:hidden py-2 space-y-2'>
                        <li><Link href='/'  prefetch={true} className='block hover:text-yellow-300'>Home</Link></li>
                        <li><Link href='/History'  prefetch={true} className='block hover:text-yellow-300'>History</Link></li>
                        <li><Link href='/About'  prefetch={true} className='block hover:text-yellow-300'>About</Link></li>


                    </ul>
                )}
            </div>
        </header>
    )
}
