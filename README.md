## JWT
```json
{
  "payload": {
    "user": {
      "id": 1,
      "createdAt": "2020-01-11T16:33:49.810Z",
      "updatedAt": null,
      "deletedAt": null,
      "email": "john.doe@email.com",
      "password": "$2b$10$rrh7lBMVE6qkxUfhimurAO.Q8sLKjTOJFJdwbCdWPYW7Ba75rOpG2",
      "fullname": "John Doe",
      "fk_company_id": null,
      "emailConfirmed": true
    }
  },
  "iat": 1578760453,
  "exp": 1579365253,
  "iss": "fieldbot-server"
}
```
## Companies resource

### GET /companies
```json
{
    "name": "John",
    "email": "company.email@email.com",
}
```

### POST /companies
```json
{
    "name": "John",
    "email": "company.email@email.com",
}
```

### PUT /companies/
```json
{
    "id": "1",
    "name": "John",
    "email": "company.email@email.com",
}
```

## Customers resource
### GET /customers

#### Request 
http://localhost:3000/customers?page=4&limit=2

#### Response
```json
{
    "customers": [
        {
            "id": 913,
            "firstName": "john",
            "lastName": "doe",
            "email": "jogn.doe@email.com",
            "phone": "+44 (0) 1234566",
            "address": {
                "street": "Devan Grove",
                "city": "London",
                "state": "",
                "country": "UK",
                "postCode": "N4 2GS"
            },
            "companyId": 1472
        },
        {
            "id": 912,
            "firstName": "john",
            "lastName": "doe",
            "email": null,
            "phone": "+44 (0) 1234566",
            "address": {
                "street": "Devan Grove",
                "city": "London",
                "state": "",
                "country": "UK",
                "postCode": "N4 2GS"
            },
            "companyId": 1472
        }
    ]
}
```
### GET /customers/:id

#### Request
    http://localhost:3000/customers/1111
    
#### Response
```json
{
    "customer": {
        "id": 1111,
        "firstName": "john",
        "lastName": "doe",
        "email": "jogn.doe@email.com",
        "phone": "+44 (0) 1234566",
        "address": {
            "street": "Devan Grove",
            "city": "London",
            "state": "",
            "country": "UK",
            "postCode": "N4 2GS"
        },
        "companyId": 1515
    }
}
```

### GET /customers/count

#### Request
    http://localhost:3000/customers/count
    
#### Response
```json
{
    "count": 1
}
```

### POST /customers
#### Request
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "jogn.doe@email.com",
    "phone": "+44 (0) 1234566",
    "address": {
        "street": "Devan Grove",
        "city": "London",
        "state": "",
        "country": "UK",
        "postCode": "N4 2GS"
    }
}
```

#### Response
```json
{
    "customer": {
        "id": 913,
        "firstName": "john",
        "lastName": "doe",
        "email": "jogn.doe@email.com",
        "phone": "+44 (0) 1234566",
        "address": {
            "street": "Devan Grove",
            "city": "London",
            "state": "",
            "country": "UK",
            "postCode": "N4 2GS"
        },
        "companyId": 1472
    }
}
```


### PUT /customers/:id

#### Request
```json
{
    // this id does not matter even if it's wrong, the one that is used is in req.params
	"id": 646,
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jon.doe@email.com",
    "phone": "+44 (0) 44332211",
    "address": {
        "street": "Devan Grove",
        "city": "London",
        "state": "",
        "country": "UK",
        "postCode": "N4 2GS"
    }
}
```

#### Response
```json
{
    "customer": {
        "id": 646,
        "firstName": "jane",
        "lastName": "doe",
        "email": "jon.doe@email.com",
        "phone": "+44 (0) 44332211",
        "address": {
            "street": "Devan Grove",
            "city": "London",
            "state": "",
            "country": "UK",
            "postCode": "N4 2GS"
        },
        "companyId": 1347
    }
}
```
### DELETE /customers/:id

#### Request
Send the customer id to the above route
#### Response
status = 200


### GET /customers/search/:searchTerm

#### Request
Specify the searchTerm
e.g http://localhost:3000/customers/search/daf
#### Response
status = 200
```json
{
    "customer": [
        {
            "id": 2576,
            "firstName": "jane1",
            "lastName": "rfda",
            "email": "daff@email.com",
            "phone": "+44 (0) 1234566",
            "address": {
                "street": "Devan Grove",
                "city": "London",
                "state": "",
                "country": "UK",
                "postCode": "N4 2GS"
            },
            "companyId": 1726
        }
    ]
}
```

## /jobs

### DELETE /jobs/:id

#### Request
Send the job id to the above route
#### Response
status = 204

### GET /jobs/:id

#### Request
Get the job with the same id to the above route
#### Response
status = 200
```json
{
    "job": {
        "id": 1536,
        "name": "Job 1",
        "scheduledAt": "2020-09-19T15:00:12Z",
        "description": "Description of the job",
        "status": "PENDING",
        "address": {
            "street": "Devan Grove",
            "city": "London",
            "state": "",
            "country": "UK",
            "postCode": "N4 2GS"
        },
        "companyId": 1726,
        "userId": 49,
        "customerId": 2117,
        "images": [
            {
                "key": "key-1",
                "signedUrl": "signedUrl-1"
            }
        ],
        "tags": [
            "tag-1",
            "tag-2"
        ]
    }
}
```

## Invoices

### POST /invoices

#### Request
```json
{
    "createdAt": "2020-07-10T20:57:53.163Z",
    "jobId": 1,
    "customInvoiceId": "custom-id-1",
    "taxIncluded": false,
    "taxRate": 19.00,
    "updatedAt": "2020-07-10T20:57:53.163Z",
    "lineItems": [{
        "createdAt": "2020-07-10T20:57:53.163Z",
        "name": "line item name",
        "description": "line item 1 descr",
        "quantity": 1,
        "price": 10.20,
        "updatedAt": "2020-07-10T20:57:53.163Z",
    }]
};

```

#### Response

```json
{
    "invoice": {
        "createdAt": "2020-07-10T20:57:53.163Z",
        "customInvoiceId": "invoice-id",
        "jobId": 29,
        "id": "4e7be053-eb9b-45e7-a2f7-06e7a5b3ccc0",
        "taxIncluded": false,
        "taxRate": 19,
        "updatedAt": "2020-07-10T20:57:53.163Z",
        "lineItems": [
            {
                "id": "990781ca-b9c0-45b1-81ea-f3f716a4f430",
                "invoiceId": "4e7be053-eb9b-45e7-a2f7-06e7a5b3ccc0",
                "createAt": "2020-07-10T20:57:53.174Z",
                "updatedAt": "2020-07-10T20:57:53.174Z",
                "name": "line item name",
                "description": "line item 1 descr",
                "quantity": 1,
                "price": 10.2
            }
        ]
    }
}
```

### GET /invoices/job/29

#### Response

```json
{
    "invoice": {
        "createdAt": "2020-07-10T20:57:53.163Z",
        "customInvoiceId": "invoice-id",
        "jobId": 29,
        "id": "4e7be053-eb9b-45e7-a2f7-06e7a5b3ccc0",
        "taxIncluded": false,
        "taxRate": 19,
        "updatedAt": "2020-07-10T20:57:53.163Z",
        "lineItems": [
            {
                "id": "990781ca-b9c0-45b1-81ea-f3f716a4f430",
                "invoiceId": "4e7be053-eb9b-45e7-a2f7-06e7a5b3ccc0",
                "createAt": "2020-07-10T20:57:53.174Z",
                "updatedAt": "2020-07-10T20:57:53.174Z",
                "name": "line item name",
                "description": "line item 1 descr",
                "quantity": 1,
                "price": 10.2
            }
        ]
    }
}
```

### PUT /invoices/:id

id is uuid

#### Request
```json
{   "createdAt": "2020-07-10T20:57:53.163Z",
    "customInvoiceId": "updated-invoice-id",
    "taxIncluded": true,
    "taxRate": 19.02,
    "updatedAt": "2020-07-10T20:57:53.163Z",
    "lineItems": [{
        "createdAt": "2020-07-10T20:57:53.163Z",
    	"id": "bb755ae3-1c63-4bee-8d7c-0ca1302005b6",
        "name": "update line item name",
        "description": "line item 1 descr update",
        "quantity": 1,
        "price": 11.20,
        "updatedAt": "2020-07-10T20:57:53.163Z",
    }]
}

```

#### Response

```json
{
    "invoice": {
        "createdAt": "2020-07-10T22:05:59.202Z",
        "customInvoiceId": "updated-invoice-id",
        "jobId": 35,
        "id": "b9bfbd81-97b1-46a1-aa32-4f439ac4ba73",
        "taxIncluded": true,
        "taxRate": 19.02,
        "updatedAt": "2020-07-10T22:08:04.748Z",
        "lineItems": [
            {
                "id": "bb755ae3-1c63-4bee-8d7c-0ca1302005b6",
                "invoiceId": "b9bfbd81-97b1-46a1-aa32-4f439ac4ba73",
                "createAt": "2020-07-10T22:05:59.216Z",
                "updatedAt": "2020-07-10T22:08:04.759Z",
                "name": "update line item name",
                "description": "line item 1 descr update",
                "quantity": 1,
                "price": 11.2
            }
        ]
    }
}
```

### DELETE /invoices/:id
#### Response
status code: 204