import ArticleItemList from "~/components/ArticleListitem";
import { getCategorisedArticles } from "~/lib/articles";



export default function Articles(){
    const articles = getCategorisedArticles()
    console.log(articles)
    return(
        <section>
            <header>
                <h1>I hope this works</h1>
            </header>
            <section>
                {articles !== null && Object.keys(articles).map((article)=>
                (
                    <ArticleItemList 
                        category={article} 
                        articles={articles[article]?? []} 
                        key={article}>
                    </ArticleItemList>
                ))}
            </section>
        </section>

    )
}