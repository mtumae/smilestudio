import ArticleItemList from "~/components/ArticleListitem";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import NavBar from "~/components/ui/navigation";
import { getCategorisedArticles } from "~/lib/articles";
import '~/styles/globals.css'



export default function Articles(){
    const articles = getCategorisedArticles()
    console.log(articles)
    return(
        <div>
            <div className="grid grid-auto-fit gap-5 m-10">
                {articles !== null && Object.keys(articles).map((article)=>
                (
                    <Card>
                        <CardHeader>
                        <ArticleItemList 
                            category={""} 
                            articles={articles[article]?? []} 
                            key={article}>
                        </ArticleItemList>
                        </CardHeader>
                        <CardContent>
                    </CardContent>
                    </Card>
                ))}
            </div>
        </div>

    )
}