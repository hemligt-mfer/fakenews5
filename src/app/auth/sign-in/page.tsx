import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import SignInForm from "./_components/sign-in-form";

export default async function SignInPage(){
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session){
        redirect('/')
    }
    return(
       
    <div className=" h-full min-w-full"><SignInForm/></div>
)
}