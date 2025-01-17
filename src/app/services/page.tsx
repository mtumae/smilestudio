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
    backgroundImage: 'url(/teeth.jpg)',
    padding: '40px' 
  
  }

  const Img2Style={
    backgroundImage: 'url(/toothbrush.jpg)',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    display: 'flex',
    margin: '40px'
  }


export default function Services(){
    return(
        <div>
            <NavBar></NavBar>
         
                
                <div style={Img1Style} className="grid grid-cols-1 items-center">
                <h1 className="text-4xl font-montserrat m-10 text-ssgray">Routine Dentistry</h1>
                        <Card className="m-2 bg-transparent border-none">
                            <CardHeader>
                                <CardTitle className="text-2xl font-montserrat">Fillings</CardTitle>
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
            
                    

            
                    <Card className="m-2 bg-transparent">
                        <CardHeader>
                                <CardTitle className="text-2xl font-montserrat">Composite Resin</CardTitle>
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
           
                   
                    <Card className="m-2 bg-transparent border-none">
                        <CardHeader>
                                <CardTitle className="text-2xl font-montserrat">Crowns and Bridges</CardTitle>
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
                    
             
          
                </div>
        
            <Footer></Footer>

        </div>
    )
}