'use client'
import Link from 'next/link'
import { sidebarLinks } from "@/constants";
import { usePathname, useRouter } from 'next/navigation'
import {SignedIn, SignOutButton} from '@clerk/nextjs'
import { LogOut } from 'lucide-react';

export default function LeftSidebar() {
  const pathname = usePathname()

  return (
      <section className='custom-scrollbar w-full h-full transition-all duration-300 ease-in-out px-0 flex flex-col'>
        <div className='flex w-full flex-1 flex-col gap-6 px-0 '>
      {sidebarLinks.map((link) => {
        const isActive=(pathname.includes(link.route)&&link.route.length>1)||pathname===link.route;

        return(
          <Link
            key={link.label}
            href={link.route}
            className={`leftsidebar_link ${isActive ? 'bg-blue-900/30 text-blue-400' : ''} no-underline flex items-center justify-center lg:justify-start p-2 rounded-lg transition-all duration-300 hover:bg-gray-800/50 w-full ease-in-out px-0`}>
            {(() => {
              switch (link.label.toLowerCase()) {
                case 'home':
                  return <link.imgURL size={24} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />;
                case 'search':
                  return <link.imgURL size={24} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />;
                case 'activity':
                  return <link.imgURL size={24} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />;
                case 'musicgenerator':
                  return <link.imgURL size={24} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />;
                case 'imagegenerator':
                  return <link.imgURL size={24} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />;
                case 'community':
                  return <link.imgURL size={24} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />;
                default:
                  return;
              }
            })()}
            
            <p className={`${isActive ? 'text-blue-400' : 'text-light-1'} max-lg:hidden lg:ml-4`}>{link.label}</p>
            </Link>
      )})}
      </div>
      <div className='mt-10 px-2 flex justify-center md:px-4 lg:px-6'>
        <SignedIn>
              <SignOutButton redirectUrl="/sign-in">
                <div className='flex cursor-pointer gap-2 lg:gap-5 p-2 justify-center mb-5 hover:bg-gray-800 rounded-lg transition-all duration-300 lg:w-full lg:p-4 w-full ease-in-out'>
                  <div className='flex items-center justify-center'>
                    <LogOut size={24} className="text-gray-400" />
                  </div>  
                  <p className='text-light-2 max-lg:hidden text-gray-400 lg:block'>Logout</p>
                </div>
              </SignOutButton>
            </SignedIn>
      </div>
    </section>
  )
}