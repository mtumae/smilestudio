"use client"

import { useSession } from "next-auth/react";
import NavBar from "~/components/ui/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";



export default function Profile(){
  
    const { data: session } = useSession();

    return(
        <div>

            <NavBar></NavBar>

            {session &&(

                <Avatar className="border-2 border-ssblue justify-self-center w-40 h-40">
                    
                <AvatarImage src={session.user.email ?? "https://github.com/shadcn.png"} />
                <AvatarFallback>{session.user.email}</AvatarFallback>
                </Avatar>
            )
            
            }



        </div>
    )
     

}