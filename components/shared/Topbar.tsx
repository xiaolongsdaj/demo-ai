'use client'
import '../../app/globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { SignedIn, SignedOut, SignOutButton, useAuth } from '@clerk/nextjs'
import { sidebarLinks } from "@/constants"
import { usePathname } from 'next/navigation'
import { LogOut, ChevronDown, Menu, X } from 'lucide-react'
import SignIn from '@/components/forms/SignIn'

export default function Topbar() {
  const pathname = usePathname()
  const [exploreOpen, setExploreOpen] = useState(false) // 探索菜单状态
  const [userMenuOpen, setUserMenuOpen] = useState(false) // 用户菜单状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navbarVisible, setNavbarVisible] = useState(true)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [showSignIn, setShowSignIn] = useState(false) // 登录表单状态
  const [userInfo, setUserInfo] = useState({ image: '/user.webp', userName: '用户' }) // 用户信息状态
  const { isSignedIn } = useAuth() // 获取登录状态
  
  const exploreRef = useRef<HTMLDivElement>(null) // 探索菜单ref
  const userMenuRef = useRef<HTMLDivElement>(null) // 用户菜单ref
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // 分离Home链接和其他链接
  const homeLink = sidebarLinks[0]
  const dropdownLinks = sidebarLinks.slice(1)
  useEffect(() => {
    //从localStorage获取用户信息，并在isSignedIn状态改变时重新获取
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedInfo = JSON.parse(storedUserInfo);
      // 确保获取到有效数据
      if (parsedInfo.image && parsedInfo.userName) {
        setUserInfo(parsedInfo);
      }
    }
  }, [isSignedIn]); 
  
  
  // 监听滚动事件，为导航栏添加滚动效果和隐藏/显示功能
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setScrolled(scrollTop > 10)
      
      // 检测滚动方向并更新导航栏显示状态
      if (scrollTop > lastScrollTop && scrollTop > 10) {
        // 向下滚动且超过一定距离时隐藏导航栏
        setNavbarVisible(false)
      } else {
        // 向上滚动时显示导航栏
        setNavbarVisible(true)
      }
      
      setLastScrollTop(scrollTop)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollTop])
  
  // 点击外部区域关闭下拉菜单、移动菜单和登录框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSignIn])
  
  // 处理窗口大小变化，在大屏幕上自动关闭移动菜单
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
    <nav className={`fixed top-0 left-0 right-0 z-50 transform transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) ${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg shadow-black/20 py-2' : 'bg-gray-900/80 py-3'} ${navbarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      {/* 添加一个细微的分隔线作为视觉辅助 */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent transform origin-bottom transition-transform duration-300 ${navbarVisible ? 'scale-x-100' : 'scale-x-0'}`}></div>
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <div className="flex items-center justify-center rounded-full">
              <Image src="/logo.webp" alt="logo" width={32} height={32} className="rounded-full object-cover transition-transform duration-700 group-hover:scale-110 rotate-3" />
            </div>
            <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 group-hover:from-blue-300 group-hover:to-purple-400 hidden sm:block">
              音乐创作助手
            </p>
          </Link>

          {/* Mobile Menu Button - Only visible on small screens */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/70 text-gray-300 hover:bg-gray-700/70 transition-all duration-300 z-50"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X size={20} className="transition-transform duration-300" />
            ) : (
              <Menu size={20} className="transition-transform duration-300" />
            )}
          </button>
          
          {/* Mobile Menu - Slide in from left */}
          <div 
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900/98 backdrop-blur-lg shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            ref={mobileMenuRef}
          >
            <div className="p-5 pt-16">
              <div className="space-y-2">
                {/* Home Link for mobile */}
                <Link
                  href={homeLink.route}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 ${pathname === homeLink.route ? 'bg-blue-600/90 text-white' : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${pathname === homeLink.route ? 'bg-white/20' : 'bg-gray-800'}`}>
                    <homeLink.imgURL size={18} />
                  </div>
                  <span className="font-medium">{homeLink.label}</span>
                </Link>
                
                {/* Other links for mobile */}
                {dropdownLinks.map((link) => {
                  const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
                  
                  return (
                    <Link
                      key={link.label}
                      href={link.route}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 ${isActive ? 'bg-blue-600/90 text-white' : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-800'}`}>
                        <link.imgURL size={18} />
                      </div>
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
              
              {/* Mobile logout button */}
              <div className="mt-8">
                <SignedIn>
                  <SignOutButton redirectUrl="/sign-in">
                    <button className='flex items-center gap-3 px-4 py-3 rounded-xl w-full bg-gray-800/70 text-gray-300 hover:bg-red-900/30 hover:text-red-400 transition-all duration-300'>
                      <LogOut size={18} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </SignOutButton>
                </SignedIn>
              </div>
            </div>
          </div>
          
          {/* Navigation Links - Hidden on mobile, shown on larger screens */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Home Link - Always visible */}
            <Link
              href={homeLink.route}
              className={`flex items-center px-4 py-2.5 rounded-full transition-all duration-400 transform ${pathname === homeLink.route ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-105'}`}
            >
              <homeLink.imgURL size={20} className="mr-2" />
              <span className="hidden lg:inline-block">{homeLink.label}</span>
            </Link>
            
            {/* Dropdown Menu for other links */}
            <div className="relative" ref={exploreRef}>
              <button
                onClick={() => {
                  setExploreOpen(!exploreOpen);
                  setUserMenuOpen(false); // 点击探索时关闭用户菜单
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-400 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-105 ${exploreOpen ? 'bg-gray-700/70 text-white scale-105' : ''}`}
                aria-expanded={exploreOpen}
                aria-haspopup="true"
              >
                <span className="hidden lg:inline-block font-medium">探索</span>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-500 ease-in-out ${exploreOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {/* Dropdown content with enhanced animation */}
              <div 
                className={`absolute top-full left-0 mt-2 w-60 rounded-xl shadow-2xl bg-gray-800/95 backdrop-blur-md border border-gray-700/50 z-50 overflow-hidden transition-all duration-500 ease-out transform origin-top-left ${exploreOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-[-8px] pointer-events-none'}`}
                aria-label="Navigation menu"
              >
                <div className="py-1">
                  {dropdownLinks.map((link, index) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
                    
                    return (
                      <Link
                        key={link.label}
                        href={link.route}
                        className={`flex items-center gap-3 px-5 py-3.5 w-full text-left transition-all duration-400 transform hover:translate-x-1 ${isActive ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white' : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'}`}
                        onClick={() => setExploreOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-transform duration-300 ${isActive ? 'bg-white/20' : 'bg-gray-700/50'}`}>
                          <link.imgURL size={18} className="transition-transform duration-300 hover:scale-110"/>
                        </div>
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right section with user controls */}
            <div className='flex items-center gap-3'>
              
              {/* 未登录状态显示登录按钮 */}
              <SignedOut>
                <button
                  onClick={() => setShowSignIn(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all duration-400 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <span className="text-sm font-medium">登录</span>
                </button>
              </SignedOut>
              
              {/* 登录状态显示用户头像和下拉菜单 */}
              <SignedIn>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setUserMenuOpen(!userMenuOpen);
                      setExploreOpen(false); // 点击用户头像时关闭探索菜单
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-800/70 border-2 border-transparent hover:border-blue-500/50 transition-all duration-400 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    {/* 显示用户头像 */}
                    <Image 
                      src={userInfo.image} 
                      alt={`${userInfo.userName}的头像`} 
                      width={36} 
                      height={36} 
                      className="rounded-full object-cover"
                    />
                    {/* 显示用户名 */}
                    <span className="text-sm font-medium text-white hidden sm:inline-block">
                      {userInfo.userName}
                    </span>
                  </button>
                   
                  {/* 简化的下拉菜单，仅保留退出功能 */}
                  <div 
                    className={`absolute top-full right-0 mt-2 w-40 rounded-xl shadow-2xl bg-gray-800/95 backdrop-blur-md border border-gray-700/50 z-50 overflow-hidden transition-all duration-300 ease-out transform origin-top-right ${userMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-[-8px] pointer-events-none'}`}
                  >
                        <div className="py-1">
                          <SignOutButton redirectUrl="/">
                            <button className="flex items-center gap-3 px-5 py-3 w-full text-left transition-all duration-300">
                              <LogOut size={18} className="text-gray-400" />
                              <span className="font-medium">退出登录</span>
                            </button>
                          </SignOutButton>
                        </div>
                      </div>
                    </div>
              </SignedIn>
          </div>
        </div>
      </div>
    </nav>
      <SignIn 
      show={showSignIn} 
      onClose={() => setShowSignIn(false)} 
      />
    </>
  )
}