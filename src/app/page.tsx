"use client"
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import Calendar from "./calendar/calendar";
import { useSession, signOut } from "next-auth/react";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { DoorOpen, LogOut, Settings, User2 } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="max-w-screen-xl bg-background flex flex-wrap items-center justify-between mx-auto p-4 text-black">
        <Image
          alt="Smile Studio logo"
          src="/logo.png"
          width={200}
          height={200}
        />
        <div className="flex items-center">
          <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-black-500">
            <li>
              <a href="#" className="text-gray-900 hover:text-ssblue p-4" aria-current="page">Home</a>
            </li>
            <li>
              <a href="#" className="text-gray-900 hover:text-ssblue p-4">Practice</a>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger>Services</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Services</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Hygiene</DropdownMenuItem>
                  <DropdownMenuItem>Dentistry</DropdownMenuItem>
                  <DropdownMenuItem>Orthodontics</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <a href="#" className="text-gray-900 hover:text-ssblue p-4">Blog</a>
            </li>
            <li>
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
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
                      Settings</DropdownMenuItem>
                    <DropdownMenuItem className="text-red" onClick={() => signOut()}>
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/api/auth/signin" className="text-gray-900 hover:text-ssblue p-4">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
      <Calendar></Calendar>
    </div>
  );
}