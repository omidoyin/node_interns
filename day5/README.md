# day 5

## Instructions

- setup project
- clone to your github
- Read the documentation https://sequelize.org/v7/manual/getting-started.html
- Setup the following Models in models folder. Make sure tables made by sequelize:

```
transaction
- id
- order_id
- user_id
- shipping_dock_id
- amount
- discount
- tax
- total
- notes
- status (paid, not paid) (integer mapping)

- Make a page called /import that there a button to import excel or CSV file
- When form submitted, it calls /api/v1/import with file
- Write the data into transaction table. If errors, report error to user

- Make an api called /api/v1/export that will export the transaction table as csv

- Everything must be done by end of date
```
