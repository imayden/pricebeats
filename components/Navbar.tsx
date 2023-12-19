import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

// Icons for Navbar buttons 
const navIcons = [
  {src : '/assets/icons/search.svg', alt: 'Search'},
  {src : '/assets/icons/black-heart.svg', alt: 'Favorite'},
  {src : '/assets/icons/user.svg', alt: 'Account'}
]

const Navbar = () => {
  return (
    <header className='w-full'>
      <nav className='nav'>
        <Link href='/' className='flex items-center gap-1'>

          {/* logo image */}
          <Image
            src="/assets/icons/logo.svg"
            width={27}
            height={27}
            alt="logo"
          />

          {/* logo text */}
          <p className='nav-logo'>
            <span className='font-dysonSansModern text-primary-black'>
              price
            </span>
            <span
              className='font-dysonSansModern text-primary-brand'>
              beats
              </span>
          </p>
        </Link>

        {/* Navbar buttons */}
        <div className='flex items-center gap-5'>
          {navIcons.map((icon) => (
              <Image 
                key={icon.alt}
                src={icon.src}
                alt={icon.alt}
                width={28}
                height={28}
                className='object-contain'
              />
            )
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar