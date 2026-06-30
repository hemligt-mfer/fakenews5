type Article = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    image: string | null;
    title: string;
    summary: string | null;
    content: string;
    location: string | null;
    editorsChoice: boolean;
    deleted: Date | null;
};

export default function ArticlePreview({ article }: { article: Article }) {
    return <div className="p-2"></div>;
}
