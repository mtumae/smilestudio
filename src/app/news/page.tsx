"use client"

import Home from "../page"
import Footer from "../footer/page"
import { Button } from "~/components/ui/button"
import NavBar from "~/components/ui/navigation"
import Autoplay from "embla-carousel-autoplay"
import { MoveRight } from "lucide-react"
import { type CarouselApi } from "~/components/ui/carousel"
import React from "react"

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
  const [api, setApi] = React.useState<CarouselApi>()
 
  React.useEffect(() => {
    if (!api) {
      return
    }
 
    api.on("select", () => {
      // Do something on select.
      // Should add the slug of the post to url
      return(
        <div>
          my name is 
        </div>
      )
    })
  }, [api])
    return(
        <div>
            <NavBar></NavBar>
        
            <div className="">
                <div className="h-96 mt-7" style={Img1Style}>
                <Carousel setApi={setApi} className="w-3/4">
                  <CarouselContent>
                    <CarouselItem>
                        <Card className="bg-transparent border-none">
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
                    </CarouselItem>


                    <CarouselItem>
                    <Card className="bg-transparent border-none">
                          <CardHeader>
                          <CardTitle className="text-xl font-bold font-montserrat text-white">Implants: A Brief History</CardTitle>
                          <CardDescription className="text-white">Smile Studio Kenya</CardDescription>
                          </CardHeader>
                          <CardContent className=" text-white">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                          Nunc at elit pellentesque, tincidunt arcu eget, pellentesque lectus. 
                          Sed tristique sit amet orci id egestas. Nam justo nibh, aliquam eu condimentum eu, 
                          egestas id lacus. Nullam viverra nibh orci, ut vulputate ipsum maximus id. 
                          Curabitur lobortis lorem vel nunc cursus, at mollis nibh semper. 
                          Nunc nec feugiat ex. Phasellus lacinia nisi eget elit luctus, id vehicula nulla consectetur. 
                          Aliquam tincidunt enim quis ipsum tincidunt varius. Nullam auctor turpis sed sapien iaculis, eu facilisis turpis finibus. Quisque sed finibus metus, sit amet tristique ex. Cras metus quam, consectetur ac consequat ac, efficitur id libero. 
                          Vestibulum imperdiet sagittis lacus, eget tristique turpis mattis et. Maecenas eget magna risus.
                          </CardContent>
                          <CardFooter className="text-ssblue hover:text-white cursor-pointer">
                            read more <MoveRight className="ml-4 mt-1"/>
                          </CardFooter>
                        </Card>


                    </CarouselItem>
                    <CarouselItem>...</CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                  
                  </div> 
                <div className="h-96" style={Img2Style}></div>
            </div>
        </div>
    )
}