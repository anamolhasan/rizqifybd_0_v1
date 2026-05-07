import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='flex justify-between items-center max-w-7xl py-3 bg-amber-200 font-bold'>
        <div>
            <Link href={'/'}>Rizqify</Link>
        </div>
        <div className='space-x-5'>
            <Link href={'/'}>Home</Link>
            <Link href={'/about'}>About</Link>
            <Link href={'/contact'}>Contact</Link>
        </div>
        <div className='space-x-5'>
            <Link href={'/log-in'}>Log in</Link>
            <Link href={'/register'}>Register</Link>
        </div>
    </div>
  )
}

export default Navbar