"use client"
import { useState, useEffect } from "react";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import MobileMenu from "./mobile-menu";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`text-white fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 transition-all lg:px-10 lg:py-6 ${isScrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
    >
      <div className="flex items-center space-x-2 md:space-x-10">
        <Link href="/">
          <img
            src="/netflix_png_logo.png"
            width={120}
            height={120}
            className="cursor-pointer object-contain"
            alt="Netflix Logo"
          />
        </Link>

        {/* Mobile Menu Button - Hidden on desktop */}
        <div className="md:hidden">
          <MobileMenu />
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <ul className="hidden space-x-4 md:flex">
          <li className="headerLink">
            <Link href="/">Home</Link>
          </li>
          <li className="headerLink">
            <Link href="/tv-shows">TV Shows</Link>
          </li>
          <li className="headerLink">
            <Link href="/movies">Movies</Link>
          </li>
          <li className="headerLink">
            <Link href="/new-popular">New & Popular</Link>
          </li>
          <li className="headerLink">
            <Link href="/my-list">My List</Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center space-x-4 text-sm font-light">
        <Search className="hidden h-6 w-6 sm:inline cursor-pointer" />
        <p className="hidden lg:inline cursor-pointer">Kids</p>
        <Bell className="h-6 w-6 cursor-pointer" />
        <Link href="/account">
          <div className="flex items-center space-x-2">
            {/* <div className="h-8 w-8 rounded bg-blue-600"> */}
            <UserButton />
            {/* </div> */}
            <ChevronDown className="hidden h-4 w-4 md:inline" />
          </div>
        </Link>
      </div>
    </header>
  );
}
