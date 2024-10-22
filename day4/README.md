# day 4

## Instructions

- setup project
- clone to your github
- Read the documentation https://sequelize.org/v7/manual/getting-started.html
- Setup the following Models in models folder. Make sure tables made by sequelize:

```
email
- id
- slug (unique)
- subject
- body
- status ENUM(active, inactive) (integer mapping)

email_queue
- id
- email_id
- user_id
- status ENUM(send, not sent) (integer mapping)
- created_at
- send_at
- updated_at

user
- id
- email
- name
- status ENUM(active, inactive) (integer mapping)
```

- Make the CRUD API for these tables

```
GET /api/v1/email (get all)
GET /api/v1/email/:id (get one)
POST /api/v1/email/:id (add one)
PUT /api/v1/email/:id (update one)
DELETE /api/v1/email/:id (delete one)

GET /api/v1/user (get all)
GET /api/v1/user/:id (get one)
POST /api/v1/user/:id (add one)
PUT /api/v1/user/:id (update one)
DELETE /api/v1/user/:id (delete one)
```

- create a cronjob called email_queue.js in cronjob folder
- this cronjob will be run once a day
- Algorithm:

```
1.Loop through all active users
2.Loop through all odd id emails if today is monday, wednesday, friday. Otherwise do all even id for other days.
4.Loop through all the users in user table and make a table of user_id.
3.Write into email queue for each user in step 2 (so if 3 total emails, 2 ids are odd, say there 5 users so on monday you add 2 x 5 = 10 emails into email_queue.) what email to send from step 2. Set status as not sent. Set send_at as next day.
```

- create a cronjob called email_sending.js in cronjob folder
- this cronjob will be run once a day
- Algorithm:

```
1.Loop through all email_queue table that have send_at as today.
2.Query user table to collect email and name. In email template selected, replace {{{NAME}}} and {{{EMAIL}}} with user email and name.
3.Send email to user. Use https://mailtrap.io/ to send the email
4.Mark Email status as sent
```

- Everything must be done by end of date
