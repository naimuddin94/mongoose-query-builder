# 📘 Mongoose Query Builder

A lightweight, chainable query builder utility for Mongoose that supports:

* 🔍 Search
* 🎯 Filtering (including advanced operators)
* 🔃 Sorting
* 🧪 Field selection
* 📄 Pagination

Designed to be easy to integrate into Express/Mongoose-based APIs.

---

## 🚀 Installation

### Using npm

```
npm install mongoose-query-builders
```

### Using yarn

```
yarn add mongoose-query-builders
```

---

## 🛠️ Usage

```ts
import QueryBuilder from 'mongoose-query-builders';
import Project from './project.model';
/**
 * List of fields in the Project model that are allowed for search operations.
 * 
 * This array is used by the `QueryBuilder` to determine which fields
 * can be included in search queries, such as text-based filtering.
 * 
 * ✅ Make sure the keys listed here are valid keys in the IProject interface.
 * ✅ This can be imported and reused in other services or controller layers
 *    that implement search functionality on the Project collection.
 */
export const projectSearchableFields: (keyof IProject)[] = ['title', 'subTitle'];

const fetchAllProjectsFromDB = async (query: Record<string, unknown>) => {
  const projectQuery = new QueryBuilder(Project.find(), query)
    .search(projectSearchableFields)  // or you can ['title', 'subTitle'] it will be suggest you
    .filter()                         // Apply filters from query
    .sort()                           // Apply sorting if specified
    .paginate()                       // Apply pagination
    .fields();                        // Limit fields returned

  const result = await projectQuery.modelQuery;  // Final queried documents
  const meta = await projectQuery.countTotal();  // Total count for pagination

  return {
    meta,
    result,
  };
};
```

---

## 🔍 Search

Performs case-insensitive regex search on specified fields.

**Example:**

```
GET /products?searchTerm=phone
```

This will match any product whose `name` or `description` contains `phone`.

---

## 🎯 Filter (with Advanced Operators)

Supports filtering directly using fields AND advanced MongoDB operators:

### Supported Operators:

| Operator | Description           | Example Param                    | Translates to                                     |
| -------- | --------------------- | -------------------------------- | ------------------------------------------------- |
| `gte`    | Greater than or equal | `price[gte]=100`                 | `{ price: { $gte: 100 } }`                        |
| `lte`    | Less than or equal    | `createdAt[lte]=2024-01-01`      | `{ createdAt: { $lte: ... } }`                    |
| `gt`     | Greater than          | `rating[gt]=4`                   | `{ rating: { $gt: 4 } }`                          |
| `lt`     | Less than             | `discount[lt]=20`                | `{ discount: { $lt: 20 } }`                       |
| `ne`     | Not equal             | `status[ne]=archived`            | `{ status: { $ne: 'archived' } }`                 |
| `in`     | In array              | `category[in]=books,electronics` | `{ category: { $in: ['books', 'electronics'] } }` |
| `nin`    | Not in array          | `tags[nin]=clearance,sale`       | `{ tags: { $nin: ['clearance', 'sale'] } }`       |

### Example:

```
GET /products?price[gte]=100&createdAt[lt]=2024-01-01&status=active
```

This query filters all products:

* `price >= 100`
* `createdAt < 2024-01-01`
* `status === 'active'`

---

## 🔃 Sort

**Example:**

```
GET /products?sort=price,-createdAt
```

Sorts by `price` ascending and `createdAt` descending.
Defaults to `-createdAt` if not provided.

---

## 🧪 Field Selection

**Example:**

```
GET /products?fields=name,price
```

Returns only selected fields. Supports comma-separated fields.

---

## 📄 Pagination

**Example:**

```
GET /products?page=2&limit=20
```

* `limit`: number of items per page (default: `10`)
* `page`: page number (default: `1`)

If `limit=0`, pagination is skipped and all results are returned.

---

## 📦 Meta Response

Every query returns metadata using `.countTotal()`:

```ts
{
  page: number,
  limit: number,
  total: number,
  totalPage: number
}
```
---

## 👨‍💻 Author

**Md Naim Uddin**
[GitHub](https://github.com/naimuddin94)

---

## 🪲 Issues & Contributions

Feel free to open [issues](https://github.com/naimuddin94/mongoose-query-builder/issues) or submit PRs.

---

## 🧾 License

This project is licensed under the [ISC License](./LICENSE).
