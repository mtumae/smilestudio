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
    backgroundImage: 'url(/gradblu3.png)', 
    backgroundSize: 'cover', 
    borderRadius: '20px',
    padding: '20px'
}
  const Img3Style={
    backgroundImage: 'url(/gradblu2.png)',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    borderRadius: '20px',
    padding: '20px'
  }

  const Img4Style={
    backgroundImage: 'url(/gradblu.png)',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    padding: '40px',
    borderRadius: '20px',
  }



export default function Services(){
    return(
        <div className="overflow-x-hidden">
            <NavBar></NavBar>
            <div style={Img4Style} className="grid grid-auto-fit gap-4 m-10 mt-20 ">
            <h1 className="text-5xl font-montserrat ml-3 mt-20 w-1/2 text-ssgray">
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
            <div style={Img3Style} className="grid grid-auto-fit gap-8 m-10 mt-20 ">
                <Card className=" w-auto hover:border-ssblue col-span-3">
                  <CardContent className="p-10">
                  Dentistry advocates for the principle of prevention. It is recommended to have biannual 
                  cleanings and examinations. 
                  At Smile Studio the average hygiene visit lasts about one hour, 
                  this enables our doctors check your gum health, the condition of your teeth and fillings, 
                  do a thorough cleaning and polishing and offer individualised preventive advice to help you
                  stay healthy.
                  </CardContent>
                </Card>


            <h1 className="text-5xl font-montserrat ml-3 mt-8 w-1/2 text-ssgray">
              General Cleaning
            </h1>

            <h1 className="text-5xl font-montserrat ml-3 mt-8 w-1/2 text-ssgray">
              Paediatric Dentistry
            </h1>

            <Card className=" w-auto hover:border-ssblue col-span-3">
              <CardContent className="p-10">
              It is never too early to bring your kids in for a dental check up.
               As soon as the first teeth appear in the mouth at about 6 months the dental journey begins. 
               Unfortunately most people's first dental visits were a result of pain, which, 
              combined with anxiety leads to a negative mindset towards dentistry in general.
              A good first dental experience can encourage a lifelong positive attitude toward oral care and dentistry.
              
              </CardContent>
            </Card>
            </div>

            <div style={Img2Style} className="grid grid-auto-fit gap-8 m-10 mt-20 ">
            <h1 className="text-5xl font-montserrat ml-3 mt-8 w-1/2 text-ssgray">
              Cosmetic
            </h1>

            <Card className=" w-auto hover:border-ssblue">
              <CardHeader className="font-montserrat text-lg">
              Veneers
              </CardHeader>
              <CardContent>
              If you’re looking to cosmetically correct or enhance the appearance of
               one or more teeth, we suggest veneers. They are very thin, porcelain 
               or resin shells that you can customize in color and shape. 
              They are non-invasive and are resistant to future stains.
              </CardContent>
            </Card>

            <Card className=" w-auto hover:border-ssblue ">
              <CardHeader className="font-montserrat text-lg">
              Whitening
              </CardHeader>
              <CardContent>
              Professional teeth whitening is faster, more effective, 
              and longer lasting that treatments you find over the counter. 
              We can brighten your teeth by
              five to ten shades in a single session. 
              </CardContent>
            </Card>

            <Card className=" w-auto hover:border-ssblue">
              <CardHeader className="font-montserrat text-lg">
              Whitening
              </CardHeader>
              <CardContent>
              Professional teeth whitening is faster, more effective, 
              and longer lasting that treatments you find over the counter. 
              We can brighten your teeth by
              five to ten shades in a single session. 
              </CardContent>
            </Card>

           

            <Card className=" w-auto hover:border-ssblue m-10 col-span-2">
              <CardHeader className="font-montserrat text-lg">
              What is orthodontics?
              </CardHeader>
              <CardContent>
              Orthodontic treatment is used to improve the appearance, position 
              and function of crooked, crowded, protruding or abnormally arranged teeth. 
              Orthodontic treatment can also be used to close gaps between the teeth.
              
              </CardContent>
            </Card>

            


            <h1 className="text-5xl font-montserrat m-10 mt-8 w-1/2 text-ssgray">
              Orthodontics
            </h1>





            
            </div>
            <Footer></Footer>
        </div>
    )
}