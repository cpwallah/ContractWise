// "use client"
// import { cn } from "@/lib/utils";
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Button } from "./ui/button";
// import { resolve } from "path";
// import { UserButon } from "./shared/user-button";


// const navItems:{name:string,href:string}[]=[
//     {name:"Dasboard",href:"/dashboard"},
//     {name:"Pricing",href:"/pricing"},
//     {name:"Private Policy",href:"/privacy"}

// ]


// export function Header(){
//     const pathname=usePathname();
//     return <header className="sticky px-4 top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
//        <div className="container flex h-16 items-center">
//         <div className="mr-4  hidden md:flex">
//             <Link href={"/"} className="mr-6 flex items-center space-x-2">
//                LOGO
//             </Link>
//             <nav className="flex items-center space-x-7 text-sm font-medium">
//                 {navItems.map((item)=>(
//                     <Link key={item.name} href={item.href} className={cn("transition-colors hover:text-foreground/80",
//                         pathname===item.href?"text-foreground":"text-foreground/60"
//                     )}>
//                         {item.name}
//                     </Link>
//                 ))}
//             </nav>
//         </div>
//         <UserButon/>
//        </div>
//         </header>

// }

"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { UserButon } from "./shared/user-button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems: { name: string; href: string }[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Pricing", href: "/pricing" },
  { name: "Privacy Policy", href: "/privacy" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl border-b border-border/20 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:pl-8 lg:pr-8">
        {/* Logo and Nav Container */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 drop-shadow-md">
              ContractWise
            </span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-12 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 rounded-lg transition-all duration-300 ease-in-out font-semibold tracking-wide",
                  pathname === item.href
                    ? "text-blue-600 bg-blue-100/50 shadow-sm"
                    : "text-foreground/80 hover:bg-blue-50/70 hover:text-blue-600 hover:shadow-sm",
                  "border border-transparent hover:border-blue-200/50"
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute inset-x-2 bottom-1 h-1 bg-blue-500 rounded-full opacity-20" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-blue-50/50 rounded-full transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-foreground/70" />
          ) : (
            <Menu className="h-5 w-5 text-foreground/70" />
          )}
        </Button>

        {/* User Button (Desktop) */}
        <div className="hidden md:flex items-center">
          <UserButon />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border/20 shadow-lg animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 tracking-wide",
                  pathname === item.href
                    ? "text-blue-600 bg-blue-100/50 shadow-sm"
                    : "text-foreground/80 hover:bg-blue-50/70 hover:text-blue-600",
                  "border border-transparent hover:border-blue-200/50"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <UserButon />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}