// cronjob.js

const cron = require("node-cron");
const axios = require("axios");
const { Customer } = require("../models");
// Adjust the path to your Sequelize model

const SHOPIFY_STORE_URL = 'https://testdaytech.myshopify.com';
const SHOPIFY_API_VERSION = '2024-07';
const SHOPIFY_ACCESS_TOKEN = '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';

function fetchCustomerscron() {
  // Define the CURL command to fetch Shopify customers
  const fetchCustomersCurlCommand = `curl -X GET "https://testdaytech.myshopify.com/admin/api/2022-01/customers.json" "X-Shopify-Access-Token: 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"`;

  // Schedule cron job to run every day at midnight
  // cron.schedule("0 0 * * *", async () => {
  cron.schedule("*/1 * * * *", async () => {
    // Runs every minute
    console.log("called");
    try {
      // Execute CURL command to fetch Shopify customers
      // const { data } = await axios.get(fetchCustomersCurlCommand);
      const {data} = await axios.get(`${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/customers.json`, {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      });

      
      console.log("data", data);

      // Process each customer data
      for (const customer of data.customers) {
        // Check if customer already exists in database
        const existingCustomer = await Customer.findOne({
          where: {
            shopify_customer_id: customer.id,
          },
        });

        // If customer doesn't exist, add them to the database
        if (!existingCustomer) {
          await Customer.create({
            shopify_customer_id: customer.id,
            shopify_customer_email: customer.email,
          });
          console.log(
            `Added customer ${customer.email} (${customer.id}) to database.`
          );
        } else {
          console.log(
            `Customer ${Customer.email} (${customer.id}) already exists in database.`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching or saving Shopify customers:", error);
    }
  });
}

module.exports = fetchCustomerscron;
