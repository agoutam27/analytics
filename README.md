# APIs exposed for analytical operations: [Mean, Median, Variance]


### Directory structure :

    models: 'app/models/**/*.js',
    routes: 'app/routes/**/*Routes.js',
    controllers: 'app/conrollers/**/*Controller.js'
    configuration files: 'config'
    lib: 'lib'
    test: 'test',
    extras: 'extras' < 'Anything else related to development exercise - no impact on server' >
---
> Methods in files of lib folder improvise responder and logging with modular implementation of server.
---
### Mongo indexing for better performance: 

> For User collection

`db.User.createIndex({"profile.key": 1, "profile.value": 1})`

> For Questions Collection

`db.Questions.createIndex({"userId": 1})`

### Steps to start the server
> First install all the dependencies using this command `npm install`
> To start the server with forever thread run command `npm start` or simply `node server.js`

___
### Notes

> This project is completely backend. There is no UI. Please use any of the HTTP clien of your choice. (i.e. Postman, Insomania) 

> Currently implemented statistical methods are Mean, Median and Variance. Method parameter in body is a mandatory parameter with either a string value joined by comma or an array.

> Filter based on user property that accepts not only string but array as well.

> Filter operation is whether to apply *logical or* or *logical and*. By default it is *logical and*.

#### API Exposed : 
> `POST`&nbsp;&nbsp;&nbsp;&nbsp; < HOST >:< PORT >/v1/operations/analytics

> `BODY`&nbsp;&nbsp; - Example1
```JSON
{
	"filters": {
		"Location": "value 1",
		"Company": "value 1",
		"Designation": "value 1",
		"Gender": "value 1"
	},
	"methods": ["mean", "median", "variance"],
	"filterOperation": "or"
}
```
>Example 2
```JSON
{
	"filters": {
		"Location": ["value 1", "value 2"],
		"Company": ["value 1"],
		"Designation": ["value 1"],
		"Gender": ["value 1"]
	},
	"methods": ["mean", "median", "variance"],
	"filterOperation": "and"
}
```
> API Response 
```JSON
{
    "Result": [
        {
            "_id": "5e9bf260ef04992c1f63826f",
            "median": 4,
            "mean": 3.5,
            "variance": 0.7071067811865476
        },
        ...
        ...
        ...
    ]
}
```
> Here _id represents unique user and then based on selected methods result will be shown.


