import Link from "next/link";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getArticleData } from "~/lib/articles";
import Footer from "../footer/page";
import '~/app/globals.css'
import NavBar from "~/components/ui/navigation";



const Article = async ({params}: {params: {slug:string} }) => {
    const articleData = await getArticleData(params.slug)

    return (
        <div>
                {articleData.date.toString()} 
            <article className="article " dangerouslySetInnerHTML={{__html: articleData.contentHtml}}/>
        <Footer></Footer>
        </div>
    )

}

export default Article