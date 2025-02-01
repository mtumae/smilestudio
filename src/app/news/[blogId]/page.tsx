'use client'
import { Skeleton } from "~/components/ui/skeleton"

import { use } from "react";
import { api } from "~/trpc/react";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "~/components/ui/card"
import NavBar from "~/components/ui/navigation";
import Footer from "~/app/footer/page";

export default function BlogDetails({ 
   params 
}: { 
   params: Promise<{ blogId: string }> 
}) {
   const resolvedParams = use(params);
   const blogId = resolvedParams.blogId;
 

   const postByID = api.post.getByID.useQuery({ postid: blogId });

   if (!blogId) {
       return <div>Error: Blog ID is missing</div>;
   }

   if (postByID.isLoading) return (  
    <div>
        <NavBar></NavBar>
        <Skeleton className="h-96 w-full mt-10" />
    </div>);



   if (postByID.error) return <div>Error: {postByID.error.message}</div>;

   return (
       <div>
        <NavBar></NavBar>
           <h1>News post {blogId}</h1>


           <Card className="border-none shadow-none ">
            <CardHeader className="justify-self-center mb-10 items-center">
                <h1 className="text-2xl">{postByID.data?.title}</h1>
                <h1 className="text-ssgray">Smile Studio </h1>
                <h1 className="text-ssgray">{ postByID.data?.createdAt.toString().slice(0, 15) } </h1>
           </CardHeader>
           <CardContent className="m-10">
                {postByID.data?.body}
           </CardContent>
           </Card>

           <Footer></Footer>
       </div>
   );
}