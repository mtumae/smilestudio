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
    margin: '20px',
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
      

        <div className="grid grid-auto-fit m-10 gap-2">
              <Card style={Img2Style} className=" p-5">
                <CardHeader>
                <CardTitle className="text-xl font-bold font-montserrat text-white">Implants: A Brief History</CardTitle>
                <CardDescription className="text-white">Smile Studio Kenya</CardDescription>
                </CardHeader>
                <CardContent className=" text-white">
                Most patients may not automatically associate the word “implants” with oral health. 
                Most patients may also not know much about the history of dental implants, 
                and the role they have played and continue to play in restorative dental health.
                With over 95% success rates, dental implants are an excellent tooth replacement solution.
                </CardContent>
                <CardFooter className="text-ssblue hover:text-white cursor-pointer">
                  read more <MoveRight className="ml-4 mt-1"/>
                </CardFooter>
              </Card> 

              <Card style={Img3Style} className="p-5">
                <CardHeader>
                <CardTitle className="text-xl font-bold font-montserrat text-white">Why you should find out if you might have gum disease?</CardTitle  >
                <CardDescription className="text-white">Smile Studio Kenya</CardDescription>
                </CardHeader>
                <CardContent className=" text-white">
                Gum disease is when your gums become swollen, sore or infected. 
                Gum disease may not cause pain as it gets worse, 
                so many don’t often notice that they have it until it’s too late. 
                What are the signs of gum disease?
                </CardContent>
                <CardFooter className="text-ssblue hover:text-white cursor-pointer">
                  read more <MoveRight className="ml-4 mt-1"/>
                </CardFooter>
              </Card>          
        </div>
      <Footer></Footer>
    </div>



  )
}