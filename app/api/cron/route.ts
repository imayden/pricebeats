import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "@/lib/utils";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();

        const products = await Product.find({});

        if (!products) throw new Error("No products found");

        // 1.Scrape latest product details & update DB
        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

                if (!scrapedProduct) throw new Error("No products found");

                const updatedPriceHistory = [
                    ...currentProduct.priceHistory,
                    { price: scrapedProduct.currentPrice }
                ]

                const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                }


                const updatedProduct = await Product.findOneAndUpdate(
                    { url: scrapedProduct.url },
                    product,
                );

                // 2. Check each product's status & send email accordingly
                const emailNotifTypoe = getEmailNotifType(scrapedProduct, currentProduct);

                if(emailNotifTypoe && updatedProduct.users.length > 0) {
                    const productInfo = {
                        title: updatedProduct.title,
                        url: updatedProduct.url,
                    }

                    const emailContent = await generateEmailBody(productInfo, emailNotifTypoe);

                    const userEmail = updatedProduct.users.map((user: any) => user.email);

                    await sendEmail(emailContent, userEmail);
                }

                return updatedProduct;

            })

        );

        return NextResponse.json({
            message: 'Ok', data: updatedProducts
        });

    } catch (error) {
        throw new Error(`Error in GET: ${error}`);
    }
}