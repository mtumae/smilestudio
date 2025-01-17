"use client"

import Home from "../page"
import Footer from "../footer/page"
import { Button } from "~/components/ui/button"
import NavBar from "~/components/ui/navigation"
import Autoplay from "embla-carousel-autoplay"
import { MoveRight } from "lucide-react"
import { type CarouselApi } from "~/components/ui/carousel"
import React from "react"
import { api } from "~/trpc/react"

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
    const posts = api.post.getLatest.useQuery()
  
    return(
        <div>
            <NavBar></NavBar>
            <div className="">
                <div className="mt-7" style={Img1Style}>
                <Carousel className="w-3/4">
                  <CarouselContent>

                  { posts.data?.map(( post ) =>
                    <CarouselItem key={post.id}>
                      <Card className="bg-transparent border-none shadow-lg text-white">
                        <CardHeader>
                          <CardTitle className="font-montserrat">{post.title}</CardTitle>
                          <CardDescription>Smile Studio Kenya</CardDescription>
                        </CardHeader>
                        <CardContent className="font-helvetica">
                          {post.body}
                        </CardContent>
                        <CardFooter>
                          {post.updatedAt?.toLocaleString()}
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                    )}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                  </div> 
            </div>
        </div>
    )
}