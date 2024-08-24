# ECAT

ECat A service to manage product.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete products.
- **Pagination and Search**: Paginated product listings with search functionality.
- **Relationships**: Products can have varieties, images, and tags.

## Dependencies
All related dependencies which are needed to run the project will be listed below
- [NodeJS](https://nodejs.org/en/download/)
- Working [SqLite](https://www.sqlite.org/) instance
- [Yarn](https://yarnpkg.com/) package manager
- [Docker](https://www.docker.com/get-started) installed on your machine.


### Using Docker

1. Pull the Docker image from Docker Hub:

   ```bash
   docker pull rizalraisyad/ecat:latest

## Installation
First of all before running the app you need install first using the script

```bash
$ yarn install
```

## Test
For running the test you can run the script

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

## Running the app

```bash
$ yarn start:dev
```

using docker
```
docker run -p 3000:3000 rizalraisyad/ecat
```

## API Documentation
All API documentation will be available on Swagger whenever the app is running. You can access it at localhost:YOURPORT/api. The default port is 3000. You can customize the port by changing the code in main.ts.

Or

[POSTMAN Documentation](https://www.postman.com/technical-specialist-42256706/workspace/ecat/overview)

# Database Design

## **Tables**

### **Products**

| Column Name        | Data Type | Constraints        | Description                     |
|--------------------|-----------|--------------------|---------------------------------|
| `product_id`       | INT       | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each product |
| `product_name`     | VARCHAR(255) | NOT NULL         | Name of the product             |
| `product_description` | TEXT    |                    | Description of the product      |
| `product_condition` | TEXT    |                    | Condition of the product New or Second     |
| `weight` | DECIMAL    |                    | Weight of the product      |
| `created_at`       | DATETIME  | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the product was created |
| `updated_at`       | DATETIME  | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Timestamp when the product was last updated |

### **Product Varieties**

| Column Name        | Data Type | Constraints        | Description                     |
|--------------------|-----------|--------------------|---------------------------------|
| `variety_id`       | INT       | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each variety |
| `product_id`       | INT       | FOREIGN KEY REFERENCES `Products(product_id)` | Identifier of the associated product |
| `variety_name`     | VARCHAR(255) | NOT NULL         | Name of the product variety     |
| `variety_price`    | DECIMAL(10, 2) | NOT NULL       | Price of the product variety    |
| `stock_quantity`   | INT       | NOT NULL           | Quantity of stock available     |

### **Product Images**

| Column Name        | Data Type | Constraints        | Description                     |
|--------------------|-----------|--------------------|---------------------------------|
| `image_id`         | INT       | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each image |
| `product_id`       | INT       | FOREIGN KEY REFERENCES `Products(product_id)` | Identifier of the associated product |
| `image_url`        | VARCHAR(255) | NOT NULL         | URL of the product image        |
| `is_primary`       | BOOLEAN   | NOT NULL, DEFAULT FALSE | Indicates if this image is the primary image for the product |

### **Product Tags**

| Column Name        | Data Type | Constraints        | Description                     |
|--------------------|-----------|--------------------|---------------------------------|
| `tag_id`           | INT       | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each tag |
| `tag_name`         | VARCHAR(255) | NOT NULL         | Name of the tag                 |

### **Product Tags Link**

| Column Name        | Data Type | Constraints        | Description                     |
|--------------------|-----------|--------------------|---------------------------------|
| `product_id`       | INT       | FOREIGN KEY REFERENCES `Products(product_id)` | Identifier of the associated product |
| `tag_id`           | INT       | FOREIGN KEY REFERENCES `Product Tags(tag_id)` | Identifier of the associated tag |

---