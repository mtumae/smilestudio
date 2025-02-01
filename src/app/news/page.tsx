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
  

  const Img1Style ={
    backgroundImage: 'url(/homepageblur.jpg)',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    justifyContent: 'center',
    padding: '20px',
  };



  const Img2Style ={
    backgroundImage: 'url(/mansmiling.jpg)',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    justifyContent: 'center',
    padding: '20px',
  }

  const Img3Style ={
    backgroundImage: 'url(/womansmiling.jpg)',
    justifyContent: 'left',
    alignItems: 'left',
    backgroundSize: 'cover', 
    backgroundPosition: 'center',  
    padding: '20px',
    
  }

export default function News(){
    const posts = api.post.getLatest.useQuery()
  
    return(
        <div>
            <NavBar></NavBar>
            <div className="grid grid-auto-fit gap-4">
                  { posts.data?.map(( post ) =>


                  <div className="m-10 border-ssblack border-y-darkgray shadow-lg" key={post.id}>
                    <Card  className="rounded-sm border-t-ssblue border-t-4"></Card>
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

                  <div className="grid grid-cols-1 w-full gap-10 ">
                  
                  <Card style={Img3Style} className="shadow-lg m-10 ">
                  <CardContent className="m-10">
                      <Image
                        alt="teeth"
                        src="/eg2.jpg"
                        className="rounded-sm mb-3"
                        width={200}
                        height={200}/>
                      <Image
                        alt="teeth"
                        src="/eg1.jpg"
                        className="rounded-sm"
                        width={200}
                        height={200}/>

                        <Card className=" w-auto justify-self-end mt-20  border-none">
                          <CardHeader className="text-4xl font-montserrat ">
                                Jane doe
                          </CardHeader>
                          <CardContent className="text-sm">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                          Praesent eget ipsum blandit, tempor nunc a, facilisis elit. 
                          Sed et mi in orci malesuada mollis. Duis in ipsum in nibh pellentesque volutpat. 
                          Curabitur et libero fringilla, lobortis nibh dignissim, maximus sapien. 
                          In metus libero, eleifend sed purus a, cursus finibus urna. Aliquam a risus libero. 
                          </CardContent>
                        </Card>
                  </CardContent>
              </Card>

              <Card style={Img2Style} className="m-10">
                <CardContent className="m-10">
                <Image
                        alt="teeth"
                        src="/eg5.jpg"
                        className="rounded-sm mb-3 justify-self-end"
                        width={200}
                        height={150}/>
                      <Image
                        alt="teeth"
                        src="/eg6.jpg"
                        className="rounded-sm justify-self-end"
                        width={200}
                        height={200}/>

                        <Card className="mt-12">
                          <CardHeader className="text-4xl font-montserrat ">
                            John Doe
                          </CardHeader>
                          
                          <CardContent className="m-4">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                          Praesent eget ipsum blandit, tempor nunc a, facilisis elit. 
                          Sed et mi in orci malesuada mollis. Duis in ipsum in nibh pellentesque volutpat. 
                          Curabitur et libero fringilla, lobortis nibh dignissim, maximus sapien. 

                          </CardContent>
                        </Card>


                </CardContent>
              </Card>
             <Footer></Footer>
            </div>
        </div>
    )
}