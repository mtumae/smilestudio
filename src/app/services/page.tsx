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
                <Card style={Img1Style} className="border-none font-montserrat shadow-lg">
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

            </div>
            <Footer></Footer>

        </div>
    )
}