import Link from "next/link";
import type { ArticleItem } from "~/types";

interface Props{
    category:string
    articles:ArticleItem[]


}

const ArticleItemList =  ({category, articles}: Props) =>{
    return(
        <div className="flex flex-col g-5">
            <h2>{category}</h2>
            <div>
                {articles.map((article, id)=> (
                <Link href={`/${article.id}`} key={id} >
                    {article.title}
                </Link>
            ))}
            </div>
        </div>
    )
}

export default ArticleItemList