import Home from "../page"
import Footer from "../footer/page"

import { CircleUser } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card"
import { Line } from "recharts"




export default function Blog(){
    return(
        <div>
        <Home></Home>
        <div className="grid grid-cols-2 m-10">

            
            <div>
                <Card className="m-10">
                    <CardHeader>Blog posts</CardHeader>

                    <CardContent>
                        <div>
                            <p className="italic">This is where the comment comes in...</p>
                            <a className="text-ssgray text-sm">user gmail + date posted<CircleUser className="justify-end" /></a>
                            
                        </div>

                    </CardContent>
                </Card>
            </div>


            
            <div>
                <Card className="m-10">
                    <CardHeader className="text-ssgray">Your posts</CardHeader>
                    <CardContent>I love smile studio</CardContent>
                  
                </Card>
            </div>




        </div>
        <Footer></Footer>
        </div>

    )
}