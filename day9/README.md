# day 8

## Instructions

- setup project
- clone to your github
- Create middleware for all api that checks if bearer token exist and its still valid.
- Pass the user_id in payload to the api it uses
- if api is /api/v1/<portal>/something, make sure role = portal name
- We made JwtService for you
- Create middleware Maintenance.js which returns 503 on all api if config maintenance = true
- Handle the error message return to be something human readable

- Everything must be done by end of date
