"use client"
import Image from "next/image";
import { Slash, SlashIcon } from "lucide-react";
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
import Footer from "./footer/page";
import NavBar from "~/components/ui/navigation";

const navLinks = [
  {name:"Home", href:"/"},
  {name:"Admin", href:"/admin"},
  {name:"Blog", href:"/blog"},
  {name:"Login", href:"/api/auth/signup"},
]



export default function Home(){
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
      <NavBar></NavBar>
      <div style={ImgStyle} className="h-96">
        <section className="text-left w-1/2 mr-auto mt-auto text-white font-helvetica">
        <h3 className="text-4xl font-bold mb-8">We Design Bespoke Smiles</h3>
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
              <BreadcrumbSeparator>
              <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
              <Instagram></Instagram>
              </BreadcrumbItem>
              <BreadcrumbSeparator >
              <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold">0711 279 035</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          </CardContent>
        </Card>
      </div>
      <Footer></Footer>
    </div>



  )
}