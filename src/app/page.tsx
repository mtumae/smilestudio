import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

export default function Home() {
  return (
    <div>
    <div className="max-w-screen-xl bg-background flex flex-wrap items-center justify-between mx-auto p-4 text-black">
      <Image
        alt="Smile Studio logo"
        src="/logo.png"
        width={200}
        height={200}
        />
        <div className="flex items-center" >
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
                    <a href="#" className="text-gray-900 hover:text-ssblue p-4">Login</a>
                </li>
                <li>
                    <a href="#" className="text-gray-900 hover:text-ssblue p-4">Blog</a>
                </li>
           </ul>
        </div>
    </div>
    <footer>
      
    </footer>
    </div>
  );
}
