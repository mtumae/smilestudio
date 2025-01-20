
import { Edit, Delete} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

import React from 'react'
import { api } from "~/trpc/react";

const posts = {
    title : "",
    subtitle: "",
    author: "",
    body: "",
  }

export default function Blog(){
    const posts = api.post.getLatest.useQuery()

    return(
        <div>
            <h1 className="text-4xl font-montserrat mt-10 justify-self-center">Blog Posts</h1>
            <h1 className="justify-self-center">Create a post for news or edit an old one</h1>

            <Tabs defaultValue="create" className="justify-self-center mt-10 w-full">
                <TabsList className="">
                    <TabsTrigger value="create">Create post</TabsTrigger>
                    <TabsTrigger value="edit">Edit post</TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="grid grid-cols-1 w-full">
                        <Label className="w-full">Main Title</Label>
                        <Input className="mt-2 mb-2" name="title" placeholder="Enter Title..."></Input>
                
                  
                        <Label className="w-full mb-1">Sub Title</Label>
                        <Input className="mt-2 mb-2" name="sub-title"  placeholder="Enter Title..."></Input>
                 
                        <Label className="w-full mb-1">Body</Label>
                        <Input className="h-60 mt-2 mb-2" placeholder="Enter Body..." ></Input>
                  
                        <Button className="w-1/3 bg-ssblue justify-self-end">Post</Button>
                
                </TabsContent>

                <TabsContent value="edit">
                    <div className="grid grid-cols-1 m-10 gap-3">
                       
                            { posts.data?.map(( post ) =>
                            <div className=" m-10">
                            <h1 key={post.id}>{post.id} {post.title} {post.body} </h1>
                                <Button className="bg-transparent text-ssblue">Edit<Edit/></Button> <Button className="bg-red text-white">Delete<Delete /></Button>
                            </div>
                            )}
                    
                    </div>
                    
                </TabsContent>
            </Tabs>
            
           
            
        </div>
    )
}

