"use client"

import Home from "../page"
import Footer from "../footer/page"
import { Button } from "~/components/ui/button"
import NavBar from "~/components/ui/navigation"
import Autoplay from "embla-carousel-autoplay"
import { MoveRight } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card"

  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "~/components/ui/carousel"
  


  const posts = {
    title : "",
    subtitle: "",
    author: "Smile Studio Kenya",
    body: "",
  }

  const Img1Style ={
    backgroundImage: 'url(/homepageblur.jpg)',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'left',
    padding: '20px',

  };


  const Img2Style ={
    backgroundImage: 'url(/signblur.jpg)',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'left',
    padding: '20px',


  }

export default function News(){
    return(
        <div>
            <NavBar></NavBar>
        
            <div className="">
                <div className="h-96 mt-7" style={Img1Style}>
                <Card className=" p-5">
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
                  
                  </div> 
                <div className="h-96" style={Img2Style}></div>
            </div>
        </div>
    )
}