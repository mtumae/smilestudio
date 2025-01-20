"use client"
import Image from "next/image";
import { ArrowDownNarrowWide, Route, Slash, SlashIcon } from "lucide-react";
import { Facebook, Instagram, MoveUpRight, MoveRight} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"


import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "~/components/ui/carousel"
  
import { CirclePlus, ChevronDown, CircleHelp } from "lucide-react";
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
import Footer from "../footer/page";
import NavBar from "~/components/ui/navigation";

const Img1Style={
    backgroundImage: 'url(/teeth.jpg)',
  
  }

const Img2Style={
    backgroundImage: 'url(/mirror.jpg)', 
}
  const Img3Style={
    backgroundImage: 'url(/chairblur.jpeg)',
   
  }

  const Img4Style={
    backgroundImage: 'url(/chair2blur.jpg)',

  }

export default function Services(){
    return(
        <div  className="overflow-x-hidden">
            <NavBar></NavBar>
         
            <div  className="grid grid-auto-fit gap-4 m-10 mt-20 ">


            <h1 className="text-5xl font-montserrat m-10 mt-20 w-1/2 text-ssgray">
              Routine Dentistry
            </h1>

            <Card className="w-auto hover:border-ssblue ">
              <CardHeader className="font-montserrat text-lg">
              Fillings
              </CardHeader>
              <CardContent>
              At Smile Studio we offer metal free composite resin fillings
              used to prevent the spread of tooth decay or correct any cosmetic damage, 
              a filling is just one of the ways our dentists preserve your health.
              </CardContent>
            </Card>

            <Card className="w-auto hover:border-ssblue">
              <CardHeader className="font-montserrat text-lg grid grid-cols-2">
              Root Canal
              <Image className="-mt-1" alt="root canal" src="/root-canal.png" width={30} height={30}/>
              </CardHeader>
              <CardContent>
              Teeth that require Root Canal treatment sometimes have symptoms such as
              constant throbbing or sharp pain, 
              lingering sensitivity to hot or cold, 
              discolouration of the tooth, swelling of the adjacent gums or tenderness of the tooth.

              </CardContent>
            </Card>

            <Card className="w-auto hover:border-ssblue">
              <CardHeader className="font-montserrat text-lg">
              Extractions
              </CardHeader>
              <CardContent>
              Our dentists make every effort to preserve your natural teeth. 
              Depending on which tooth is removed, 
              we can offer you a replacement in the form of a dental implant or alternative oral
              prosthetic.
              </CardContent>
            </Card>

            <Card className=" w-auto hover:border-ssblue">
              <CardHeader className="font-montserrat text-lg">
              Crowns and Bridges
              </CardHeader>
              <CardContent>
              A bridge refers to multiple attached crowns used to replace one or more missing teeth 
              and can be placed over existing teeth or dental implants. 
              We recommend this procedure for those who have an intact tooth without root decay. 
              The tooth may be damaged or decayed on the surface.

              </CardContent>
            </Card>

            <Card className=" w-auto hover:border-ssblue">
              <CardHeader className="font-montserrat text-lg">
              Dentures
              </CardHeader>
              <CardContent>
             
              Depending on the amount of teeth missing and the health of those that are left in the mouth, 
              we may suggest partial or full dentures. During your consultation, 
              we’ll assess all your options and you can choose what you feel most comfortable with.

              </CardContent>
            </Card>

            <Card className=" w-auto hover:border-ssblue">
              <CardHeader className="font-montserrat text-lg">
              Wisdom Tooth Removal
              </CardHeader>
              <CardContent className="">
              Wisdom teeth often become a problem because there is not enough space to 
              allow them to erupt normally.
              This can also cause destruction of the neighbour’s roots in some cases.
        

              </CardContent>
            </Card>

            


  



            </div>
            <Footer></Footer>
        </div>
    )
}