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


const Img2Style={
    backgroundImage: 'url(/gradblu3.png)', 
    backgroundSize: 'cover', 
    borderRadius: '20px',
    padding: '20px'
}
  


export default function Services(){
    return(
        <div className="overflow-x-hidden">
            <NavBar></NavBar>
        </div>
    )
}