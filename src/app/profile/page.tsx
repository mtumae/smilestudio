"use client"

import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import NavBar from "~/components/ui/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import Footer from "../footer/page";
import { Button } from "~/components/ui/button";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "~/components/ui/table"

const SATISFACTION_TYPES = [
    { 
        id:"1",
        type:"extremely angry",
        placeholder:"😠"
    },
    { 
        id:"2",
        type:"sad",
        placeholder:"☹️"
    },
    { 
        id:"3",
        type:"indifferent",
        placeholder:"😐"
    },
    { 
        id:"4",
        type:"happy",
        placeholder:"😊"
    },
    { 
        id:"5",
        type:"extremely happy",
        placeholder:"😁"
    }
]




export default function Profile(){
  
    const { data: session } = useSession();
    const t = new Date()
    const x = parseInt(t.toTimeString())



    return(
        <div>

            <NavBar></NavBar>
            <div className="grid grid-cols-1 m-10 w-1/2 justify-self-center gap-4">
            <Card className="justify-items-center">
            {session &&(
                <>
                <CardHeader className="items-center">
                            <CardTitle className="text-xl font-montserrat">{(x > 12 && x < 17) ? "Good Afternoon 🏙️" : (x == 24 && x < 12) ? "Good Morning🌅" : "Good Evening 🌃"}</CardTitle>
                            <CardDescription>{session.user.email}</CardDescription>
                         
                            <User className="w-32 h-32 hover:bg-othergray p-4 rounded-lg" />
                </CardHeader>
                <CardContent >
                    
                    {session.user.name}
                    <div className="grid grid-cols-1 w-full  justify-items-center gap-4">
                        <div>
                            Client
                        </div>
                        <div>
                        {SATISFACTION_TYPES.map((feeling) => (
                            <a className="bg-transparet hover:bg-othergray p-2 rounded-lg cursor-pointer w-10 h-10" key={feeling.id}>{feeling.placeholder}</a>
                        ))}
                        </div>

                        <div className="text-darkgray text-sm">
                            How have you been feeling as of late?
                        </div>
                    </div>
                </CardContent>
                </>
            )}
            <CardFooter>
            <Button variant="destructive">Log out</Button>
            <Button variant="link">Book appointment</Button>
            </CardFooter>
            </Card>

            <Card className="mt-10">
                <CardHeader>
                    <CardTitle>Recent appointments</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableCaption>A list of your recent appointments.</TableCaption>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead >End</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                        <TableCell className="font-medium">Root canal</TableCell>
                        <TableCell>22/01/2025</TableCell>
                        <TableCell>15:00</TableCell>
                        <TableCell>16:30</TableCell>
                        <TableCell className="text-right">Done</TableCell>
                        </TableRow>

                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
            </div>
            <Footer></Footer>
        </div>
    )
}