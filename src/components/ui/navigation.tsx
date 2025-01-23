import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { LogOut, Settings, User, User2 } from "lucide-react";

const navLinks = [
    {name:"Home", href:"/"},
    {name:"Contact", href:"/contact"},
    {name:"News", href:"/news"},
    {name:"Services", href:"/services"},
    {name:"Book", href:"/book"},
    {name:"Login", href:"/api/auth/signup"},
    
  ]
  

  export default function NavBar() {
    const pathname = usePathname();
    const { data: session } = useSession();
 
    const filteredNavLinks = navLinks.filter(link =>
        !(session && link.name === "Login")
    );
 
    return (
        <div className="overflow-hidden">
            <div className="relative self-end">
                <div className="flex justify-between items-center">
                    <Image
                        src="/logo.png"
                        className="mb-10"
                        alt="Smile studio logo"
                        width={300}
                        height={300}
                    />
                    {session && (
                        <div className="mr-10 justify-self-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center">
                                    <Avatar className="border-2 border-ssblue">
                                        <AvatarImage src={session.user.email ?? "https://github.com/shadcn.png"} />
                                        <AvatarFallback><User /></AvatarFallback>

                                    </Avatar>
                                    
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                
                                    <DropdownMenuLabel>{session.user?.name ?? "Client"}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link href="/profile">
                                    <DropdownMenuItem >
                                        <User2 size={16} className="mr-2" />
                                        Profile
                                    </DropdownMenuItem>
                                    </Link>     
                                    <DropdownMenuItem className="text-red" onClick={() => signOut()}>
                                        <LogOut size={16} className="mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                   
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
                <ul className="flex flex-wrap justify-self-center -mt-16">
                    {filteredNavLinks.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={`${link.name}-${link.href}`}>
                                <Link
                                    className={isActive ? 'text-ssblue p-4 text-sm font-montserrat' : 'text-darkgray p-4 text-sm font-montserrat hover:text-ssblue'}
                                    href={link.href}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
 }