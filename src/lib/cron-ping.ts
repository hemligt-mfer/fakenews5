import { sub } from "date-fns";
import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { getEmailFromUserId } from "@/_actions/user-actions";
import nodemailer from "nodemailer";

console.log(process.env.SMTP_HOST);

// The maximum numbers of articles per category, if it exists that many.
const NUMBER_OF_NEW_ARTICLES_PER_CATEGORY = 3;
const NUMBER_OF_NEW_ARTICLES_PER_AUTHOR = 2;
const NUMBER_OF_NEW_ARTICLES_MOST_VIEWS = 3;
const NUMBER_OF_NEW_ARTICLES_MOST_REACTIONS = 3;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function generateNewsletter(userId: string, num: number) {
    const { default: prisma } = await import("./prisma");
    const dateBack = sub(new Date(), { days: 7 }); // How far back in time we will select articles
    let text = "";

    // const article = await prisma.article.update({
    //     data: { createdAt: new Date() },
    //     where: { id: "01KWC0V7DZ133663JZ9G6XB02P" },
    // });
    // console.log(article);

    const newsLetterSettings = await prisma.newsletterSettings.findUnique({
        where: { user_id: userId },
        include: { categories: true, authors: true },
    });
    if (!newsLetterSettings) {
        return;
    }

    // Get the five latest articles from each category that the user is subscribed to.
    if (newsLetterSettings?.categories) {
        for (const c of newsLetterSettings.categories) {
            const res = await prisma.category.findUnique({
                where: { id: c.id },
                include: {
                    article: {
                        where: { createdAt: { gte: dateBack } },
                        orderBy: { createdAt: "desc" },
                        take: NUMBER_OF_NEW_ARTICLES_PER_CATEGORY,
                    },
                },
            });
            if (res?.article && res.article.length > 0) {
                text += `In the list below you will find the newest articles from each category you're subscribed to.\n`;
                text += `${c.name}: `;
                res.article.map((a, id) => {
                    text += `${a.title} (http://localhost:3000/article/${a.id})`;
                    if (id < res.article.length - 1) {
                        text += ", ";
                    } else {
                        text += ".";
                    }
                });
            }
            // console.log(res);
            text += "\n\n";
        }

        if (newsLetterSettings.authors) {
            text += `In the list below you will find the ${NUMBER_OF_NEW_ARTICLES_PER_AUTHOR} newest articles from each author you're subscribed to.\n`;
            for (const a of newsLetterSettings.authors) {
                text += `${a.alias}: `;
                const res = await prisma.author.findUnique({
                    where: { id: a.id },
                    include: {
                        articles: {
                            where: { createdAt: { gte: dateBack } },
                            orderBy: { createdAt: "desc" },
                            take: NUMBER_OF_NEW_ARTICLES_PER_AUTHOR,
                        },
                    },
                });
                if (res?.articles && res.articles.length > 0) {
                    res.articles.map((a, id) => {
                        text += `${a.title} (http://localhost:3000/article/${a.id})`;
                        if (id < res.articles.length - 1) {
                            text += ", ";
                        } else {
                            text += ".";
                        }
                    });
                }
            }
        }

        // The most viewed articles, with a maximum of NUMBER_OF_NEW_ARTICLES_MOST_VIEWS
        const res = await prisma.article.findMany({
            where: { createdAt: { gte: dateBack } },
            orderBy: { views: "desc" },
            take: NUMBER_OF_NEW_ARTICLES_MOST_VIEWS,
        });
        if (res && res.length > 0) {
            text += `\n\nBelow you will find the most viewed articles for the latest week:`;
            res.map((a, id) => {
                text += `${a.title} (http://localhost:3000/article/${a.id})`;
                if (id < res.length - 1) {
                    text += ", ";
                } else {
                    text += ".";
                }
            });
        }
    }

    // The articles with the most reactions (upvotes and/or downvotes)
    text += "\n\n";
    const articles = await prisma.article.findMany({
        where: { createdAt: { gte: dateBack } },
        include: { reactions: true },
    });
    const articlesWithReactions = [];
    for (const a of articles) {
        if (a.reactions.length > 0) {
            articlesWithReactions.push(a);
        }
    }
    if (articlesWithReactions.length > 0) {
        const sorted = articlesWithReactions.sort(function (a, b) {
            return b.reactions.length - a.reactions.length;
        });

        if (sorted.length > 0) {
            text += `The articles that has had the most reactions (positive/negative): `;
            const slicedArticles = sorted.slice(0, NUMBER_OF_NEW_ARTICLES_MOST_REACTIONS);
            slicedArticles.map((a, i) => {
                text += `${a.title} (http://localhost:3000/article/${a.id})`;
                if (i < sorted.length - 1) {
                    text += ", ";
                } else {
                    text += ".";
                }
            });
        }
    }

    const email = await getEmailFromUserId(userId);
    if (email && email.data) {
        await transporter.sendMail(
            {
                from: '"The Daily Commit" <noreply@thedailycommit.com>',
                to: email.data,
                subject: `The Daily Commit's newsletter no. ${num}`,
                text: text,
            },
            function (error, info) {
                console.error(`Unable to send email.\n\n${error}\n${info}`);
            },
        );
    }
    // console.log(user);

    console.log(text);
}

let num = 1;
// Körs varje måndag kl. 17.
cron.schedule("0 17 * * 1", async () => {
    console.log("Running weekly newsletter job ...");
    try {
        await generateNewsletter("EQU4LXMp2WgxOdJ2X5P0eGqZ3qxyxIHQ", num);
        num++;
    } catch (err) {
        console.error(`An unknown error occurred when trying to send the newsletter.\n\n${err}`);
    }
});

if (process.env.RUN_ON_START === "true") {
    generateNewsletter("EQU4LXMp2WgxOdJ2X5P0eGqZ3qxyxIHQ", num);
}
