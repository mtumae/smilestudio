import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
    {name:"Home", href:"/"},
    {name:"Admin", href:"/admin"},
    {name:"News", href:"/news"},
    {name:"Login", href:"/api/auth/signup"},
  ]
  

export default function NavBar(){
    const pathname = usePathname();
    return(
        <div className="overflow-hidden">
      <Image 
        src="/logo.png"
        alt="Smile studio logo"
        width={200}
        height={200}></Image>
      <ul className="w-screen flex flex-wrap">
        

       
      {navLinks.map(link => {
      const isActive = pathname === link.href;
      return (
        <li key={`${link.name}-${link.href}`}>
          <Link className={isActive ? 'text-ssblue p-4 text-lg' : 'text-ssblack p-4 text-lg hover:text-ssblue'} href={link.href}>
            { link.name }
          </Link>
        </li>
        )
        })}
      </ul>
      </div>
       
    )
}