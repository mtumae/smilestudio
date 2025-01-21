"use client"

import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import NavBar from "~/components/ui/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import Footer from "../footer/page";
import { Button } from "~/components/ui/button";



export default function Profile(){
  
    const { data: session } = useSession();
    const t = new Date()
    const x = parseInt(t.toTimeString())



    return(
        <div>

            <NavBar></NavBar>
            <div className="grid grid-cols-1 m-10 w-1/2 justify-self-center">
            <Card className="justify-items-center">
            {session &&(
                <>
                <CardHeader className="items-center">
                            <CardTitle className="text-xl font-montserrat">{(x > 12 || x < 15) ? "Good Afternoon 🏙️" : (x == 24 || x < 12) ? "Good Morning🌅" : "Good Evening 🌃"}</CardTitle>
                            <CardDescription>{session.user.email}</CardDescription>
                            <User className="w-32 h-32 hover:bg-othergray p-4 rounded-lg" />
                </CardHeader>
                <CardContent >
                    
                    {session.user.name}
                    <div className="grid grid-cols-1 w-full items-center">
                        Client
                    </div>
                    

                </CardContent>
                </>
            )}
            <CardFooter>
            <Button variant="destructive">Log out</Button>
            </CardFooter>
            </Card>
            </div>
            <Footer></Footer>
        </div>
    )
}