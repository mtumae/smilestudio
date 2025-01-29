'use client'

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

   if (postByID.isLoading) return <div>Loading...</div>;
   if (postByID.error) return <div>Error: {postByID.error.message}</div>;

   return (
       <div>
           <h1>News post {blogId}</h1>
           {postByID.data?.title}
           {postByID.data?.subtitle}
       </div>
   );
}