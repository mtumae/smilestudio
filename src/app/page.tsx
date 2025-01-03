"use client"
import Image from "next/image";
import { Facebook, Instagram, MoveUpRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Calendar, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { SocialIcon } from 'react-social-icons'
import { Label } from "@radix-ui/react-dropdown-menu";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";


const navLinks = [
  {name:"Home", href:"/"},
  {name:"Admin", href:"/admin"},
  {name:"Blog", href:"/blog"},
  {name:"Login", href:"/api/auth/signup"},
]



export default function NavBar({ links }: { links: Array<Record<string, string>>}){
  const { data: session } = useSession();
  const pathname = usePathname();

  const ImgStyle ={
    backgroundImage: 'url(/Elvis.jpg)',
  
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'left',
    padding: '20px',
    margin: '20px',
  };

  return(
    <div className="overflow-x-hidden">
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


      <div style={ImgStyle} className="h-96">
        <section className="text-left w-1/2 mr-auto mt-auto text-white font-helvetica">
        <h3 className="text-xl font-bold">We Design Bespoke Smiles</h3>
        <p>Our core treatments include Invisalign, braces, pediatric dentistry, smile design cases and teeth whitening and cleaning.</p>
        </section>
      </div>



      <div className="grid grid-auto-fit m-10 gap-4">
        <Card className="justify-items-center border-none">
        <Calendar className="m-10" />
          <CardHeader className="text-xl font-bold font-helvetica">Book an appointment with us</CardHeader>
          <CardContent>
            <Button className="bg-ssblue">Book now</Button>
          </CardContent>
        </Card>

        <Card className="justify-items-center border-none">
        <Phone className="m-10" />
          <CardHeader className="text-xl font-bold">Contact us via phone or social media</CardHeader>
          <CardContent>
          <Breadcrumb>
            <BreadcrumbList className="text-ssblack">
              <BreadcrumbItem>
              <Facebook></Facebook>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
              <Instagram></Instagram>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold">0711 279 035</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          </CardContent>
        </Card>
      </div>
    </div>


  )
}