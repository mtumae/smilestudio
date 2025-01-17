"use client"
import Image from "next/image";
import { Slash, SlashIcon } from "lucide-react";
import { Facebook, Instagram, MoveUpRight, MoveRight} from "lucide-react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "~/components/ui/carousel"
  



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
    backgroundImage: 'url(/signblur.jpg)', 
    margin: '40px'
  }


export default function Services(){
    return(
        <div>
            <NavBar></NavBar>
            <h1 className="text-4xl font-montserrat m-10 text-ssgray">Hygiene</h1>
            <div className="grid grid-cols-1 w-full p-5">
                <Card  className="border-none font-montserrat shadow-lg">
                    <CardHeader>
                        <CardTitle>General Cleaning</CardTitle>
                    </CardHeader>
                    <CardContent className="font-helvetica">
                        Dentistry advocates for the principle of prevention. 
                        It is recommended to have biannual cleanings and examinations. 
                        Not only do they help you quash dental problems before they arise, 
                        they leave your gums healthier, and your teeth cleaner and whiter.
                         A professional cleaning removes hard plaque that cannot be removed by 
                         brushing and flossing alone. It also involves a fluoride treatment and 
                         polish to help protect and soothe your teeth and gums. 

                        At Smile Studio the average hygiene visit lasts about one hour, 
                        this enables our doctors check your gum health, the condition of your teeth and fillings, 
                        do a thorough cleaning and polishing and offer individualised preventive advice to help you 
                        stay healthy.
                         <br></br>
                         <br></br>
                         What are some preventative measures I can take?
                            <li>Brush with a fluoride toothpaste</li>
                            <li>Use a soft-bristled toothbrush after each meal</li>
                            <li> Floss daily at least before bedtime</li>
                            <li>Use an oral rinse after flossing</li>
                            <li>Avoid sugary foods, coffee, and tobacco</li>

            
                    </CardContent>
                </Card>
                <h1 className="text-4xl font-montserrat m-10 text-ssgray">Routine Dentistry</h1>
                <Carousel>
                <CarouselContent>
                    <CarouselItem className="basis-1/3">
                        <Card className="">
                            <CardHeader>
                                <CardTitle>Fillings</CardTitle>
                            </CardHeader>
                            <CardContent>
                            Used to prevent the spread of tooth decay or correct any cosmetic damage, 
                            a filling is just one of the ways our dentists preserve your health. 
                            At Smile Studio we offer metal free composite resin fillings(white fillings).
                            Used to arrest and prevent the spread of tooth decay or correct any cosmetic damage and functional impairment,
                            a filling is just one of the ways our dentists preserve your health. Before placement, 
                            any decay must be cleaned out. We offer local anaesthesia along with sedation (when indicated)
                            to ensure maximum comfort for our patients. There are two different types of fillings:
                            amalgam (otherwise known as silver fillings) 
                            and composite resin, the colour of which can be customized to match your natural teeth.
                            </CardContent>
                        </Card>
                    
                    </CarouselItem>

                        

                    <CarouselItem className="basis-1/3">
                    <Card className="">
                        <CardHeader>
                                <CardTitle>Composite Resin</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardContent>
                            Since the colour of a composite resin filling can be customized, 
                            it is the most aesthetically pleasing option. However, 
                            it is more expensive and not as strong as an amalgam filling. 
                            Composite resin is ideal for repairing chipped or cracked teeth, filling in a gap between teeth, correcting dental discolouration, protecting any exposed tooth root from gum recession, or changing the shape of teeth. Patients may also choose composite resin for cavity fillings as they are bonded to the teeth in layers and therefore require less drilling away of the natural tooth.
                            </CardContent>
                        </CardContent>
                        </Card>
                    
                    </CarouselItem>

                    <CarouselItem className="basis-1/3">
                    <Card className="">
                        <CardHeader>
                                <CardTitle>Crowns and Bridges</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardContent>
                                A crown, otherwise known as a cap, is custom-fitted to your bite 
                                and is placed over your natural tooth or over dental implants. 
                                Crowns are recommended if one of your teeth has broken or become 
                                significantly weakened by an excess of decay or an especially large filling. 
                                The crown strengthens the tooth and maintains its usefulness and appearance.

                                A bridge refers to multiple attached crowns used to replace one or more missing 
                                teeth and can be placed over existing teeth or dental implants. 
                                We recommend this procedure for those who have an intact tooth without root decay. 
                                The tooth may be damaged or decayed on the surface.
                         
                            </CardContent>
                        </CardContent>
                        </Card>
                    
                    </CarouselItem>
                </CarouselContent>
                </Carousel>

            </div>
            <Footer></Footer>

        </div>
    )
}