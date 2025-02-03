import Link from "next/link";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getArticleData } from "~/lib/articles";
import Footer from "../footer/page";
import '~/app/globals.css'
import { ArrowLeft } from "lucide-react";
import NavBar from "~/components/ui/navigation";
import { Button } from "react-day-picker";



const Article = async ({params}: {params: {slug:string} }) => {
    const articleData = await getArticleData(params.slug)

    return (
        <div>
            <Link href="/news">
            <div className="p-4 w-28 bg-ssblack rounded-md m-10 shadow-md hover:bg-white">
                <ArrowLeft className="text-ssblue w-20">
                </ArrowLeft>   
            </div>
            </Link>
            
            <article className="article " dangerouslySetInnerHTML={{__html: articleData.contentHtml}}/>
            <div className="text-darkgray m-20">{articleData.date.toString()} Smile Studio ke</div>
        <Footer></Footer>
        </div>
    )

}

export default Article