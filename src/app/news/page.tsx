"use client"

import Home from "../page"
import Footer from "../footer/page"
import { Button } from "~/components/ui/button"
import NavBar from "~/components/ui/navigation"
import Autoplay from "embla-carousel-autoplay"

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
    margin: '20px',
  };


  const Img2Style ={
    backgroundImage: 'url(/sign.jpg)',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'left',
    padding: '20px',
    margin: '20px',

  }

export default function News(){
    return(
        <div>
            <NavBar></NavBar>
        
            <div className="">
                <div className="h-96" style={Img1Style}></div>
                    <h1>News Blog</h1>
                <div className="h-96" style={Img2Style}></div>
               
            </div>

       
        </div>
    )
}