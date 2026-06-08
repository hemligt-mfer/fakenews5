import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <Card className="mt-10 h-25 p-4 mx-auto">
            <CardHeader>
                <CardTitle>Sign up to access</CardTitle>
            </CardHeader>
            <CardContent>
                You need to have a user account in order to access articles.{" "}
                <Link href="/register">Register here.</Link>
            </CardContent>
        </Card>
    );
}
