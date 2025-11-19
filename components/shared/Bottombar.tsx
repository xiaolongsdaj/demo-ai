'use client'
import { sidebarLinks } from "@/constants";
import Link from 'next/link'
import {usePathname, useRouter } from 'next/navigation'
import { Search, Home, Heart, Users, UserPlus } from 'lucide-react'


export default function Bottombar() {
  const pathname=usePathname()
  const router=useRouter()
  return (
    <section className='bottombar'>
      <div className='bottombar_container'>
        {sidebarLinks.map((link) => {
        const isActive=(pathname.includes(link.route)&&link.route.length>1)||pathname===link.route;
        return(
          <Link
            href={link.route}
            key={link.label}
            className={`bottombar_link ${isActive ? 'bg-blue-900/30 text-blue-400' : ''} no-underline`}>
            {/* 根据标签选择合适的图标 */}
            {(() => {
              switch (link.label.toLowerCase()) {
                case 'home':
                  return <Home size={24} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />;
                case 'search':
                  return <Search size={24} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />;
                case 'activity':
                  return <Heart size={24} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />;
                case 'create thread':
                  return <Users size={24} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />;
                case 'create community':
                  return <UserPlus size={24} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />;
                default:
                  return null;
              }
            })()}
            <p className={`${isActive ? 'text-blue-400' : 'text-gray-400'} max-sm:hidden`}>{link.label.split(/\s+/)[0]}</p>
          </Link>
      )})}
      </div>
    </section>
  )
}