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
    backgroundImage: 'url(/mirror.jpg)',
    padding: '40px',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
}
  const Img3Style={
    backgroundImage: 'url(/toothbrush.jpg)',
    padding: '40px',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'left',
    margin: '20px',
    borderRadius: '10px',
    
  }

  const Img4Style={
    backgroundImage: 'url(/chair.jpeg)',
    padding: '40px',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'left',
    margin: '20px',
    borderRadius: '10px',
    
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
            
                    

            
                    <Card className="m-2 bg-transparent border-none">
                        <CardHeader>
                                <CardTitle className="text-2xl font-montserrat ">Composite Resin</CardTitle>
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

                    <Card className="m-10 bg-transparent border-none">
                        <CardHeader>
                                <CardTitle className="text-2xl font-montserrat">Extractions</CardTitle>
                        </CardHeader>
                        <CardContent>
                           
                            Our dentists make every effort to preserve your natural teeth. 
                            However, extractions are necessary when decay has made the tooth unsalvageable 
                            or when you have an advanced periodontal disease. When a tooth is malformed, damaged, 
                            impacted or ingrown, different procedures are used, but all extractions are considered minor surgery. 
                            Depending on which tooth is removed, 
                            we can offer you a replacement in the form of a dental implant or alternative oral prosthetic.
                           
                        </CardContent>
                    </Card>

                    <Card className="m-10 bg-transparent border-none">
                        <CardHeader>
                                <CardTitle className="text-2xl font-montserrat">Root Canal</CardTitle>
                        </CardHeader>
                        <CardContent>
                       
                            Root canal treatment is done to save teeth severely damaged by decay, 
                            severe wear or trauma. The alternative is normally extraction, with or without replacement, 
                            usually with Dental Implants. In most cases, 
                            Root Canal treatment is the more conservative and cost effective option.
                            Teeth that require Root Canal treatment often, but not always, have symptoms. This can be any of the following: Constant throbbing or sharp pain, lingering sensitivity to hot or cold, discolouration of the tooth, swelling of the adjacent gums or tenderness of the tooth, pain on biting or chewing and a history of trauma. Sometimes there are no signs or symptoms and a diagnosis 
                            of infection is made by chance during clinical examination and/or when taking routine x-rays. 
                          
                        </CardContent>
                    </Card>
                    
                <div  className="grid grid-cols-1 items-center bg-mutedblu">
              
                        <h1 className="text-4xl font-montserrat m-10 text-black">Dentures</h1>
                        <div className="m-10 ">
                        Missing teeth can make your cheeks look hollow and your mouth look sunken. 
                        More importantly, your diet can suffer. Those missing multiple teeth in a row may want to 
                        consider dentures for both cosmetic purposes and overall wellness. 
                        Depending on the amount of teeth missing and the health of those that are left in the mouth, 
                        we may suggest partial or full dentures. During your consultation, 
                        we’ll assess all your options and you can choose what you feel most comfortable with.
                        </div>
                    

                <Card className="m-10 bg-transparent">
                    <CardHeader>
                    <h1 className="m-2 bg-transparent border-none text-xl font-montserrat">Partial</h1></CardHeader>
                    <CardContent>
                    Root canal treatment is done to save teeth severely damaged by decay, 
                            severe wear or trauma. The alternative is normally extraction, with or without replacement, 
                            usually with Dental Implants. In most cases, 
                            Root Canal treatment is the more conservative and cost effective option.
                            Teeth that require Root Canal treatment often, but not always, have symptoms. This can be any of the following: Constant throbbing or sharp pain, lingering sensitivity to hot or cold, discolouration of the tooth, swelling of the adjacent gums or tenderness of the tooth, pain on biting or chewing and a history of trauma. Sometimes there are no signs or symptoms and a diagnosis 
                            of infection is made by chance during clinical examination and/or when taking routine x-rays.
                            </CardContent>
                    
                </Card>

                <Card className="m-10 bg-transparent">
                    <CardHeader>
                    <h1 className="m-2 bg-transparent border-none text-xl font-montserrat">Complete</h1></CardHeader>
                    <CardContent>
                    When your dental arch no longer has any teeth, a 
                    complete denture is the optimal solution. You can choose 
                    the traditional kind that latches to the gum line or choose to have dentures
                     that are anchored by dental implants. The latter option has the best hold, but involves surgery. 
                    Our dentists can discuss all the details so you can make an informed decision.
                    </CardContent>
                    
                </Card>
                </div>
               

               <div className="grid grid-auto-fit ">
                    <div style={Img4Style} className="h-96">

                    </div>

                    <Card className="m-10 bg-transparent border-none">
                    <CardHeader>
                    <h1 className=" bg-transparent  text-xl font-montserrat">Extractions</h1></CardHeader>
                    <CardContent>
                    Our dentists make every effort to preserve your natural teeth. 
                    However, extractions are necessary when decay has made the tooth unsalvageable 
                    or when you have an advanced periodontal disease. When a tooth is malformed, damaged, 
                    impacted or ingrown, different procedures are used, but all extractions are considered minor surgery. 
                    Depending on which tooth is removed,
                     we can offer you a replacement in the form of a dental implant or alternative oral prosthetic.
                    </CardContent>
                    
                </Card>
               </div>

               <div className="grid grid-auto-fit">
               <Card className="m-10 bg-transparent border-none h-auto">
                    <CardHeader>
                    <h1 className=" bg-transparent  text-xl font-montserrat">Wisdom Tooth Removal</h1></CardHeader>
                    <CardContent>
                    Wisdom teeth often become a problem because there is not enough space to allow them to 
                    erupt normally. A space shortage will cause them to get trapped behind the existing teeth, 
                    becoming impacted. This could lead to the tooth either erupting partially or not at all.
                    A partially erupted tooth is very difficult to keep clean through normal brushing and flossing. 
                    Over time, the accumulation of bacteria, sugars and acids may cause a cavity to form leading to 
                    decay of the impacted tooth and possibly its healthy neighbour. The trapped bacteria and food 
                    debris can also cause bad breath 
                    (halitosis) or gum infection around the wisdom tooth (pericoronitis).
                    If the tooth is completely impacted, it can cause a deep bony ache as it 
                    pushes against the roots of its neighbour. This can also cause destruction of the neighbour’s 
                    roots in some cases. It is also believed that this vertical force can contribute to the 
                    crowding of the front teeth, causing them to overlap or appear twisted.
                    </CardContent>
                    
                </Card>

                    <div style={Img3Style} className="h-96">

                    </div>

                    
               </div>

                        
            <Footer></Footer>

        </div>
    )
}