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
import Image from "next/image"
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
import Link from "next/link"
  


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
    backgroundImage: 'url(/eg1.jpg)',
    padding: '20px',
  }

export default function News(){
    const posts = api.post.getLatest.useQuery()
  
    return(
        <div>
            <NavBar></NavBar>
            <div className="grid grid-auto-fit gap-4 ">
                  { posts.data?.map(( post ) =>


                  <div className="m-10 border-ssblack border-y-darkgray shadow-lg" key={post.id}>
                    <Card style={Img1Style} className="rounded-sm"></Card>
                    <div className="bg-white w-full p-10">
                    <h1 className="bg-white ">{post.title}</h1>
                    <h1 className="text-sm text-ssgray">{post.name}</h1>

                    <Link href={`/news/${post.id}`}>
                    {post.body?.slice(0, 120)}... 
                    
                      <div className="flex flex-row pb-2">
                        <MoveRight className=""/>
                        </div>
                    </Link>
                    </div>
                    </div>
                  )}

                  </div>
                  
                  <Card className="m-10 shadow-lg">
                  <CardHeader>
                      <CardTitle>
                      <h1 className="text-4xl text-ssgray font-montserrat absolute right-20">Lorem Ipsum</h1>
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="m-10">
                      <Image
                        alt="teeth"
                        src="/eg2.jpg"
                        className="rounded-sm"
                        width={150}
                        height={150}/>
                      <Image
                        alt="teeth"
                        src="/eg1.jpg"
                        className="m-10 rounded-sm"
                        width={150}
                        height={150}/>

                  </CardContent>
                  <CardFooter>
                  </CardFooter>
              </Card>
                  
 
        </div>
    )
}