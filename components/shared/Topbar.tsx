import '../../app/globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { OrganizationSwitcher, SignedIn, SignOutButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
export default function Topbar() {
  return (
    <nav className='topbar'>
        <Link href="/" className="flex items-center gap-4 no-underline">
          <div className="flex items-center justify-center rounded-full bg-gray-800/50 p-1 sm:p-2 shadow-md transition-all duration-300 hover:shadow-lg">
            <Image src="/logo.webp" alt="logo" width={28} height={28} className="object-contain sm:w-8 sm:h-8" />
          </div>
          <p className="text-heading3-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 font-semibold max-xsl:hidden">Threads</p>
        </Link>

        <div className='flex items-center gap-1'>
          <div className='block md:hidden'>
            <SignedIn>
              <SignOutButton>
                <div className='flex cursor-pointer'>
                  <div className="flex items-center justify-center rounded-full bg-gray-800/50 p-1">
                    <Image src='/logo.webp' alt='sign out' width={24} height={24} className="object-contain" />
                  </div>
                </div>
              </SignOutButton>
            </SignedIn>
          </div>
        <OrganizationSwitcher 
        appearance={{
          baseTheme:dark,
          elements: {
          organizationSwitcherTrigger:
          "py-2 px-4"
        }}} 
        />
        </div>
    </nav>
  )
}