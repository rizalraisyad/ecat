# ECAT

ECat A service to manage product.


## Dependencies
All related dependencies which are needed to run the project will be listed below
- [NodeJS](https://nodejs.org/en/download/)
- Working [SqLite](https://www.sqlite.org/) instance
- [Yarn](https://yarnpkg.com/) package manager

# Database Design

## **Tables**

### **Products**

| Column Name        | Data Type | Constraints        | Description                     |
|--------------------|-----------|--------------------|---------------------------------|
| `product_id`       | INT       | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each product |
| `product_name`     | VARCHAR(255) | NOT NULL         | Name of the product             |
| `product_description` | TEXT    |                    | Description of the product      |
| `product_price`    | DECIMAL(10, 2) | NOT NULL       | Price of the product            |
| `created_at`       | DATETIME  | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the product was created |
| `updated_at`       | DATETIME  | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Timestamp when the product was last updated |

### **Product Varieties**

| Column Name        | Data Type | Constraints        | Description                     |
|--------------------|-----------|--------------------|---------------------------------|
| `variety_id`       | INT       | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each variety |
| `product_id`       | INT       | FOREIGN KEY REFERENCES `Products(product_id)` | Identifier of the associated product |
| `variety_name`     | VARCHAR(255) | NOT NULL         | Name of the product variety     |
| `variety_price`    | DECIMAL(10, 2) | NOT NULL       | Price of the product variety    |

### **Product Stocks**

| Column Name        | Data Type | Constraints        | Description                     |
|--------------------|-----------|--------------------|---------------------------------|
| `stock_id`         | INT       | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each stock entry |
| `product_id`       | INT       | FOREIGN KEY REFERENCES `Products(product_id)` | Identifier of the associated product |
| `variety_id`       | INT       | FOREIGN KEY REFERENCES `Product Varieties(variety_id)` | Identifier of the associated variety |
| `stock_quantity`   | INT       | NOT NULL           | Quantity of stock available     |
| `last_updated`     | DATETIME  | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Timestamp when the stock was last updated |

### **Stock Logs**

| Column Name        | Data Type | Constraints        | Description                     |
|--------------------|-----------|--------------------|---------------------------------|
| `log_id`           | INT       | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each stock log entry |
| `stock_id`         | INT       | FOREIGN KEY REFERENCES `Product Stocks(stock_id)` | Identifier of the associated stock |
| `change_quantity`  | INT       | NOT NULL           | Quantity change (positive or negative) |
| `change_reason`    | VARCHAR(255) | NOT NULL         | Reason for the stock change     |
| `changed_at`       | DATETIME  | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the stock change occurred |

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

### **Product Tags Mapping**

| Column Name        | Data Type | Constraints        | Description                     |
|--------------------|-----------|--------------------|---------------------------------|
| `product_id`       | INT       | FOREIGN KEY REFERENCES `Products(product_id)` | Identifier of the associated product |
| `tag_id`           | INT       | FOREIGN KEY REFERENCES `Product Tags(tag_id)` | Identifier of the associated tag |

---