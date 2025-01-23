"use client"

import { useSession } from "next-auth/react";
import { BookmarkPlus, User } from "lucide-react";
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
import { api } from "~/trpc/react";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";

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
    const user_appointments = api.appointment.getUserAppointments.useQuery()

    return(
        <div>
            <NavBar></NavBar>
            <div className="grid grid-auto-fit gap-3 m-10">
            <Card className="justify-items-center">
            {session &&(
                <>
                <CardHeader className="items-center">
                            <CardTitle className="text-xl font-montserrat">{(x > 12 && x < 17) ? "Good Afternoon 🏙️" : (x >=0 && x < 12) ? "Good Morning🌅" : "Good Evening 🌃"}</CardTitle>
                            <CardDescription>{session.user.email}</CardDescription>
                         
                            <User className="w-32 h-32 hover:bg-othergray p-4 rounded-lg" />
                </CardHeader>
                <CardContent >
                    {session.user.name}
                    <div className="grid grid-cols-1 w-full  justify-items-center gap-4">
                        
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
            <Button className="mr-4" variant="destructive">Log out</Button>
            <Button>Book appointment<BookmarkPlus /></Button>
            </CardFooter>
            </Card>

            <Card className="">
                <CardHeader>
                    <CardTitle>Recent appointments</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableCaption className="text-sm">A list of your recent appointments.</TableCaption>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="text-left">Type</TableHead>
                        <TableHead className="">Date</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="m-10">
                    {user_appointments.data?.map((aps) =>
                        <TableRow key={aps.id}>
                        <TableCell className="font-medium text-left">{aps.appointmentType}</TableCell>
                        <TableCell className="">{aps.date.toString().split("", 15)}</TableCell>
                        <TableCell className={(aps.status=="done")? "text-ssgreen font-montserrat text-right":""}>{aps.status}</TableCell>
                        </TableRow>)
                    }
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
            </div>
            <Footer></Footer>
        </div>
    )
}