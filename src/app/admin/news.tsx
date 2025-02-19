
import { Edit, Delete} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"


import React from 'react'
import { api } from "~/trpc/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { title } from "process";

const posts = {
    title : "",
    subtitle: "",
    author: "",
    body: "",
  }

export default function Blog(){
    const posts = api.post.getLatest.useQuery()

    return(
        <>
            <h1 className="text-4xl font-montserrat mt-10 justify-self-center">Blog Posts</h1>
            <h1 className="justify-self-center">Create or edit a blog post for the news page</h1>
            <Tabs defaultValue="create" className="w-full">
                <TabsList className="">
                    <TabsTrigger value="create">Create post</TabsTrigger>
                    <TabsTrigger value="edit">Edit post</TabsTrigger>
                </TabsList>
                <TabsContent value="create" className="grid grid-cols-1 w-full">
                    <div className="grid grid-cols-1 m-10 gap-3">
                        <Label className="w-full text-xl">Main Title</Label>
                        <Input className="mt-2 mb-2" name="title" placeholder="Enter Title..."></Input>
                        <Label className="w-full mb-1 text-xl">Sub Title</Label>
                        <Input className="mt-2 mb-2" name="sub-title"  placeholder="Enter sub-title..."></Input>
                        <Label className="w-full mb-1 text-xl">Body</Label>
                        <Input type="text" className="h-60 mt-2 mb-2" placeholder="Enter Body..." ></Input>
                        <Button className="w-1/3 bg-ssblue justify-self-end">Post</Button>
                        </div>
                </TabsContent>
                <TabsContent value="edit">
                    <div className="grid grid-cols-1 m-10 gap-3">
                            {posts.data?.map(( post ) =>
                         
                                <Card key={post.id}>
                                    <CardHeader>
                                        <CardTitle>{post.title}</CardTitle>
                                        <h1 className="text-sm text-darkgray">{post.createdAt.toString()};</h1>
                                    </CardHeader>
                                    <CardContent>
                                    {post.body} 
                                    </CardContent>
                                    <CardFooter>
                                    <Button className="bg-ssblack text-ssblue mr-3">Edit<Edit/></Button> 
                                    <Button variant="destructive" >Delete<Delete /></Button>
                                    </CardFooter>
                                </Card>
                         
                            )}
                    </div>
                </TabsContent>
            </Tabs>   
        </>
    )
}

