"use client"
import Image from "next/image";
import { Slash, SlashIcon } from "lucide-react";
import { Facebook, Instagram, MoveUpRight, MoveRight} from "lucide-react";


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
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import Footer from "./footer/page";
import NavBar from "~/components/ui/navigation";
import { FiFacebook, FiInstagram } from "react-icons/fi";
import { TopReviews } from "./ReviewComponent";

const navLinks = [
  {name:"Home", href:"/"},
  {name:"Admin", href:"/admin"},
  {name:"Blog", href:"/blog"},
  {name:"Login", href:"/api/auth/signup"},
]



export default function Home(){
  const { data: session } = useSession();
  const pathname = usePathname();

  const Img1Style ={
    backgroundImage: 'url(/Elvis.jpg)',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'left',
    padding: '20px',
    margin: '20px'
  };
  

  const Img2Style={
    backgroundImage: 'url(/chairblur.jpeg)', 
  }

  const Img3Style={
    backgroundImage: 'url(/chair2blur.jpg)', 
  }

  return(
    <div className="overflow-x-hidden">
      <NavBar></NavBar>
      <div style={Img1Style} className="h-96">
        <section className="text-left w-1/2 mr-auto mt-auto text-white font-helvetica">
        <h3 className="text-4xl  mb-4 font-montserrat ">We Design Bespoke Smiles</h3>
        <p className="text-othergray font-helvetica">Our core treatments include Invisalign, braces, pediatric dentistry, smile design cases and teeth whitening and cleaning.</p>
        </section>
      </div>

      <div className="grid grid-auto-fit m-20">
        <Card className="justify-items-center border-none shadow-none">
        <Calendar className="mt-10 " />
          <CardHeader className="text-xl font-bold font-helvetica">Book an appointment with us</CardHeader>
          <CardContent>
            <Link href="/book">
            <Button className="bg-ssblue">Book now</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="justify-items-center border-none shadow-none">
        <Phone className="mt-10" />
          <CardHeader className="text-xl font-bold">Contact us via phone or social media</CardHeader>
          <CardContent>
          <Breadcrumb>
            <BreadcrumbList className="text-ssblack">

              <BreadcrumbItem>
              <Link href="https://www.facebook.com/smilestudioyayacentre/" target="_blank" >
              <FiFacebook className="w-8 h-8 cursor-pointer"></FiFacebook>
              </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
              <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
              <Link href="https://www.instagram.com/smilestudio_ke/" target="_blank">
              <FiInstagram className="w-8 h-8 cursor-pointer"  ></FiInstagram>
              </Link>
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
       <TopReviews/>

        

      
      <Footer></Footer>
    </div>



  )
}