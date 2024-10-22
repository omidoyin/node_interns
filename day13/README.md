# day 1

## Instructions

- setup project
- clone to your github
- Use this library https://github.com/stripe/stripe-php
- Use bootstrap 4 for ui

```
/ => show products from db table products (id, title, description, image, price)

/product/:id => show product detail with image of product and title and description.

 Have a button buy now that open a modal for stripe checkout. Once checkout done,
 
  write into order table(id, product_id, total, stripe_id, status(paid, failed)).
 
  Show thank you page of purchase showing a table of product title, price, payment method
```
