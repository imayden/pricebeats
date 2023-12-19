import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice, extractCurrency, extractDescription } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_19030b80-zone-pricetracker:o51dltb7hgdg -k https://lumtest.com/myip.json

  // Proxy configuration
  const username = String(process.env.BRIGHTDATA_USERNAME);
  const password = String(process.env.BRIGHTDATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) || 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  }

  // try {
  //     // Fetch the URL page
  //     const response = await axios.get(url, options);
  //     const $ = cheerio.load(response.data);

  // } catch (error: any) {
  //     throw new Error(`Failed to scape product: ${error.message}`);
  // }

  try {
    // Send request to the proxy endpoint
    const response = await axios.post('http://localhost:3000/api/proxy', { url });
    const $ = cheerio.load(response.data);

    // Extract the data from the page
    const title = $('#productTitle').text().trim();
    const currentPrice = extractPrice(
      // $('.priceToPay span.a-price-whole'),
      $('.priceToPay span.a-price-whole:eq(0)'),
      $('.a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base'),
      $('.a-price.a-text-price'),
    );
    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen:eq(0)'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price'),
    );
    const outOfStock = $('#availability span').text().trim().toLowerCase() === 'out of stock';
    const images =
      $('#imgBlkFront').attr('data-a-dynamic-image') ||
      $('#landingImage').attr('data-a-dynamic-image') ||
      '{}';
    const imgUrls = Object.keys(JSON.parse(images));
    const currency = extractCurrency($('.a-price-symbol'));
    // const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');
    const discountRate = $('.savingsPercentage:eq(0)').text().replace(/[-%]/g, '');
    const description = extractDescription($);

    // Console log the extracted data from the page
    // console.log({ title });
    // console.log({ currentPrice });
    // console.log({ originalPrice });
    // console.log({ outOfStock });
    // console.log({ images, imgUrls });
    // console.log({ currency });
    // console.log({ discountRate });

    // console.log(response.data);  // Print the scraped data
    // return response.data;  // return the scraped data

    // Constrcut the data object with the scraped data
    const data = {
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      isOutOfStock: outOfStock,
      image: imgUrls[0],
      currency: currency || '$',
      discountRate: Number(discountRate),
      priceHistory: [],
      category: 'category',
      reviewsCount: 100,
      stars: 4.5,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(originalPrice) || Number(currentPrice),
      url: url,
    };

    console.log(
      'Title: ' + data.title + '\n',
      'Current Price: ' + data.currency + data.currentPrice + '\n',
      'Original Price: ' + data.currency + data.originalPrice + '\n',
      'Lowest Price: ' + data.currency + data.lowestPrice + '\n',
      'Highest Price: ' + data.currency + data.highestPrice + '\n',
      'Average Price: ' + data.currency + data.averagePrice + '\n',
      'isOutOfStock: ' + data.isOutOfStock + '\n',
      'Image: ' + data.image + '\n',
      'Discount: %' + data.discountRate + ' Off \n',
      'Price History: ' + data.priceHistory + '\n',
      'Category: ' + data.category + '\n',
      'Reviews: ' + data.reviewsCount + '\n',
      'Stars: ' + data.stars + '\n',
      'Description: \n' + data.description + '\n',
    );

    return data;


  } catch (error: any) {
    throw new Error(`Failed to scape product: ${error.message}`);
  }

} 