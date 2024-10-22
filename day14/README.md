# day 14

1. Clone repo to your own github
2. Read the configuration.json
3. Create release folder
4. Make a class called Model_builder.js with function build.
5. In build function, read the configuration.json and make the following for each model:

- create the model file based on the configuration. You are automating creating project files.

8. Make a class called Controller_builder.js with function build.
9. In build function, read the configuration.json and make the following for each model:

- add route to handle get model
- add route to handle create model
- add route to handle update model
- add route to handle delete model

You are automating creating project files.

10. This need to be done today

Example

```
configuration.json
field columns are (the field name, the field type, the field label, the validation rule)
{
"model": [
  {
  "name": "location",
  "field: [
    ["id", "integer", "ID", "required"],
    ["name", "string", "Name", "required"],
    ["status", "integer", "Status", "required"],
  ]
  },
  {
  "name": "user",
  "field: [
    ["id", "integer", "ID", "required"],
    ["name", "string", "Name", "required"],
    ["email", "string", "Email", "required"],
    ["status", "integer", "Status", "required"],
  ]
  }
]
}
```
