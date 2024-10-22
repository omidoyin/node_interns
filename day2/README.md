# day 2

## Instructions

- Make the following API

```
GET /api/v1/order/odd (Return all odd order_id rows)

GET /api/v1/order?page=1&limit=10
(paginate the orders. If limit is 10, total pages = # of order / limit. if page = 2 and limit = 10, you return results from item #10 to #20. Create a service to handle this. Response format:
{
  total: 10,
  page: 1,
  list: []
})

GET /api/v1/order?page=1&limit=10&sort=id&direction=DESC
(paginate the orders. Sort the rows by the field specified in sort. Direction is DESC or ASC. If DESC sort descending order. If ASC sort ascending order. Should work on any field. Response format:
{
  total: 10,
  page: 1,
  list: []
})

GET /api/v1/order/cursor?id=20&limit=10
(paginate the orders using cursor method. So if id = 20, then you return 10 rows that are greater than id 20. Response format:
{
  id: 20
  list: []
})

https://stackoverflow.com/questions/18314687/how-to-implement-cursors-for-pagination-in-an-api

GET /api/v1/report/sale?month=1&year (given the month and year, return total amount for month and year specified)

GET /api/v1/report/sale?from_date=2022-01-01&to_date=2022-02-02 (given from and to date, calculate total amount in date range. If the date are swapped, check which one earlier)

GET /api/v1/report/monthly?year=2022 (given the year, calculate and return sale amount per month for that year. If sale for that month 0 don't return it. Use 1 query)

GET /api/v1/report/user?year=2022&user_id=1 (given the year, calculate and return sale amount per month for that year by user_id. If sale for that month 0 don't return it. Use 1 query)

GET /api/v1/report/shipping_dock?year=2022&shipping_dock_id=1 (given the year, calculate and return sale amount per month for that year by shipping_dock_id. If sale for that month 0 don't return it.Use 1 query)

GET /api/v1/report/user/count?year=2022&user_id=1 (given the year, calculate # of orders per month from that user and return # order and month. If month has 0 sale, return 0 with the month. Use 1 query)
```

- Everything must be done by end of date
