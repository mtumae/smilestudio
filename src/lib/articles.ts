import fs from "fs"
import matter from "gray-matter"
import path from "path"
import moment from "moment"
import {remark} from "remark"
import html from "remark-html"


import type { ArticleItem } from "~/types"


const articlesDirectory = path.join(process.cwd(), "articles")
//store absolute path of articles dir


//returns list of all articles sorted by date
const getSortedArticles = (): ArticleItem[] =>{
    //array of all md files
    const fileNames = fs.readdirSync(articlesDirectory)
    

    const allArticlesData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/,"")

        const fullPath = path.join(articlesDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, "utf-8")

        const matterResult = matter(fileContents)

        //returns article as an object
        return {
            id,
            title: matterResult.data.title,
            date: matterResult.data.date,
            category: matterResult.data.category,
        }

    })

    return allArticlesData.sort((a,b) => {
        const format = "DD-MM-YYYY"
        const dateOne = moment(a.date, format)
        const dateTwo = moment(b.date, format)
        if (dateOne.isBefore(dateTwo)){
            return -1
        }
        else if (dateTwo.isAfter(dateOne)){
            return 1
        }
        else{
            return 0
        }

    })
}


//arranging articles depending on their category
export  const getCategorisedArticles = (): Record<string, ArticleItem[]> => {
    const sortedArticles = getSortedArticles()
    const categorisedArticles : Record<string, ArticleItem[]> = {}


    //if article has no category it is added to empty array
    sortedArticles.forEach((article) => {
        if(!categorisedArticles[article.category]){
            categorisedArticles[article.category] = []
        }
        categorisedArticles[article.category]?.push(article)
    })

    // returns object with each key being a unique category that points to array of articles
    return categorisedArticles
}

export const getArticleData = async (id:string)=>{
    const fullPath=path.join(articlesDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf-8")

    const matterResult = matter(fileContents)

    const processedContent = await remark().use(html).process(matterResult.content)

    const contentHtml = processedContent.toString()

    return{
        id,
        contentHtml,
        title: matterResult.data.title,
        category: matterResult.data.category,
        date: moment(matterResult.data.date, "DD--MM-YYYY").format("MMMMM Do YYYY"),
    }


}