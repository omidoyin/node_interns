# day 6

## Instructions

- setup project
- clone to your github
- Read the documentation https://sequelize.org/v7/manual/getting-started.html
- Setup the following Models in models folder. Make sure tables made by sequelize:

```
customer
- id
- shopify_customer_id
- shopify_customer_email
```

- make a cronjob that pulls all shopify customers and write into our database table. If customer exist, don't add again. Look at shopifyService to see how to call api. https://shopify.dev/api/admin-rest/2022-01/resources/customer#[get]/admin/api/2022-01/customers.json Use CURL version not nodeJS version

- Make a page /products that return webpage where you query paginated shopify products as cards with product title, price, image https://shopify.dev/api/admin-rest/2022-01/resources/product#[get]/admin/api/2022-01/products.json Use CURL version not nodeJS version

- Everything must be done by end of date
