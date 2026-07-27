import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import PasswordResetForm from "./_components/password-reset-form";

type ParamProps= {
    params: Promise<{token : string}>
}
export default async function SignInPage({params}:ParamProps){
    
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session){
        redirect('/')
    }
    return(
       
    <div ><PasswordResetForm /></div>
)
}