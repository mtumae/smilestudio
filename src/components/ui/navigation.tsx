import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { LogOut, Settings, User2 } from "lucide-react";

const navLinks = [
    {name:"Home", href:"/"},
    {name:"Admin", href:"/admin"},
    {name:"Blog", href:"/blog"},
    {name:"Login", href:"/api/auth/signup"},
  ]
  

  export default function NavBar() {
    const pathname = usePathname();
    const { data: session } = useSession();
 
    const filteredNavLinks = navLinks.filter(link =>
        !(session && link.name === "Login")
    );
 
    return (
        <div className="overflow-x-hidden">
            <div className="relative">
                <div className="flex justify-between items-center">
                    <Image
                        src="/logo.png"
                        alt="Smile studio logo"
                        width={200}
                        height={200}
                    />
                    {session && (
                        <div className="absolute right-4 top-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center">
                                    <Avatar className="border-2 border-ssblue">
                                        <AvatarImage src={session.user.email ?? "https://github.com/shadcn.png"} />
                                        <AvatarFallback>{session.user.email?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>{session.user?.name ?? "Client"}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User2 size={16} className="mr-2" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings size={16} className="mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red" onClick={() => signOut()}>
                                        <LogOut size={16} className="mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
                <ul className="w-screen flex flex-wrap">
                    {filteredNavLinks.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={`${link.name}-${link.href}`}>
                                <Link
                                    className={isActive ? 'text-ssblue p-4 text-lg' : 'text-ssblack p-4 text-lg hover:text-ssblue'}
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