 import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card"



export default function Calendar(){
    return (
        <div>
        <Card className="m-7">
        <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Calendar should come here</CardDescription>
        </CardHeader>
        <CardContent>
            <p></p>
        </CardContent>
        <CardFooter>
            <p></p>
        </CardFooter>
        </Card>
        <div className="justify-self-center text-xl">
        <h1>Or Call <a className="underline">0711 279 035</a> to book an appointment</h1>
      </div>
      </div>
    )
}