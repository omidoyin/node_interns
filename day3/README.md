# day 3

## Instructions

- setup project
- clone to your github
- Read the documentation https://sequelize.org/v7/manual/getting-started.html
- Setup the following Models in models folder. Make sure tables made by sequelize:

```
rules
- id
- name
- condition
- action
- created_at
- updated_at

variable
- id
- name
- type (STRING, FLOAT, INTEGER)
- created_at
- updated_at
```

- Make the CRUD API for these tables

```
GET /api/v1/rules (get all)
GET /api/v1/rules/:id (get one)
POST /api/v1/rules/:id (add one)
PUT /api/v1/rules/:id (update one)
DELETE /api/v1/rules/:id (delete one)

GET /api/v1/variables (get all)
GET /api/v1/variables/:id (get one)
POST /api/v1/variables/:id (add one)
PUT /api/v1/variables/:id (update one)
DELETE /api/v1/variables/:id (delete one)

GET /api/v1/evaluation?variable=base64
(
  the variable payload is json that base64 encoded. You need to decode it before using it.
  variable = {
    'a': 1,
    'b': 2,
    'c': 'TEST'
  }

  When you decode variable, you query all the rules.

  Then you evaluate the condition field and substitute in the variables provided.
  If variable does not exist in variable table, ignore it.
  Cast all variable type in payload to match the db version.

  return result like the following if rule condition is satisfied:
  [
    {
      rule_id: 1,
      result: (the rules action value if rule condition is true)
    }
  ]
)

```

- Everything must be done by end of date
