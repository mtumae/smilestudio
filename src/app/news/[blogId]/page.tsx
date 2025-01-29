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

export default function BlogDetails({ params }: { params: Promise<{ blogId: string }> })
{
    
    const { blogId } = use(params);
    const postByID = api.post.getByID?.useQuery({ postid:blogId })

   
    
    return(
        <>
        <div>
            <h1>News post { blogId }</h1>

            { postByID.data?.title }
            { postByID.data?.subtitle }
            
        </div>


        
        </>
    )
}