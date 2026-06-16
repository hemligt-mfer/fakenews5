// Contains types that we'll use when doing CRUD-operations.
// How to use:
// To specify the correct return type for a CRUD function,
// you write like this:
//
// async function example(): Promise<Result<[data type to be used]>> {
//     const data = "testestest";
//     return C;
// }
// If there was an error, you return { success: false, error: "error message" }.
// When we do CRUD-operations that doesn't fetch any data, you can leave it out
// and just write return { success: true }

type SuccessResult<T> = {
    success: true;
    data: T;
};

type ErrorResult<T = string> = {
    success: false;
    error: T;
};

type Result<TData, TError = string> = SuccessResult<TData> | ErrorResult<TError>;

type Article = {
    id: string;
    title: string;
    summary: string | null;
    content: string;
    comments: Comment[];
    views: View[];
    reactions: ArticleReaction[];
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    location: string | null;
    author: Author[];
    category: Category[];
    editorsChoice: boolean;
    deleted: null | Date;
};

type Comment = {
    id: string;
    articleId: string;
    user_id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    replyTo: string | null;
    reactions: CommentReaction[];
};

type View = {
    id: string;
    articleId: string;
    userId: string;
};

type ArticleReaction = {
    id: string;
    article_id: string;
    userId: string;
    val: number;
};

type Author = {
    id: string;
    alias: string;
    userId: string;
};

type Category = {
    id: string;
    name: string;
};

type CommentReaction = {
    id: string;
    commentId: string;
    userId: string;
    val: number;
};

type Bookmark = {
    id: string;
    articleId: string;
    user_id: string;
};

type Plan = {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    price: number;
    priceId: string;
    annualPrice: number | null;
    annualPriceId: string | null;
};

export type {
    SuccessResult,
    ErrorResult,
    Result,
    Article,
    Comment,
    View,
    ArticleReaction,
    Author,
    Category,
    CommentReaction,
    Bookmark,
    Plan,
};

export type Forecast = {
  timeseries: Series[]
  location: {name: string}
}

export type Series = {
  validTime: string
  airPressure: number
  temp: number
  visibility: number
  windDirection: number
  windSpeed: number
  humidity: number
  thunderProbability: number
  cloudCover: number
  lowerCloudCover: number
  higherCloudCover: number
  windGust: number
  precipitationMin: number
  precipitationMax: number
  precipitationFrozen: number
  precipitationCategory: string
  precipitationCategoryValue: number
  precipitationMean: number
  precipitationMedian: number
  symbol: number
  summary: string
}

