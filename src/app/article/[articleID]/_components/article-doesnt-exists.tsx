import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArticleDoesntExist() {
    return (
        <div className="p-2 mx-auto mt-10">
            <Card>
                <CardHeader>
                    <CardTitle>Couldn&apos;t find article</CardTitle>
                </CardHeader>
                <CardContent>
                    The article you were looking for doesn&apos;t exists in the database.
                </CardContent>
            </Card>
        </div>
    );
}
