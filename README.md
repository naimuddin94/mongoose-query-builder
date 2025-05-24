# mongoose-query-builders

A lightweight, chainable query builder utility for **Mongoose** that supports **search**, **filter**, **sort**, **field selection**, and **pagination**. Ideal for building scalable backend APIs with minimal effort and clean code.

> ✅ Built with TypeScript  
> ✅ Compatible with Mongoose v8+  
> ✅ Zero dependency  
> ✅ Easily chainable and extensible

---

## 📦 Installation

```bash
npm install mongoose-query-builders
```

> ⚠️ **Peer Dependency:** Requires `mongoose@^8.15.0` to be installed in your project.

---

## 🚀 Features

- 🔍 **Search**: Perform case-insensitive search across multiple fields.
- 🔧 **Filter**: Filter by any field(s) based on incoming query parameters.
- 🔃 **Sort**: Sort results by any field (asc/desc).
- 🎯 **Field Selection**: Select only specific fields to return in results.
- 📄 **Pagination**: Simple page/limit-based pagination.
- 📊 **Metadata**: Get total count and total pages easily.

---

## 🧑‍💻 Usage

### 1. Initialize `QueryBuilder`

```ts
import QueryBuilder from 'mongoose-query-builders';
```

### 2. Example Usage in Controller/Service

```ts
import { Auth } from '../models/auth.model'; // Your Mongoose model
import QueryBuilder from 'mongoose-query-builders';

const fetchUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    Auth.find({ isBlocked: false, isVerified: true }),
    query
  )
    .search(['fullName', 'id', 'address']) // Searchable fields
    .filter()
    .sort()
    .fields()
    .paginate();

  const data = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return { data, meta };
};
```

---

## 🧱 API Methods

### `new QueryBuilder(queryModel, queryParams)`

| Parameter      | Type                     | Description                           |
|----------------|--------------------------|---------------------------------------|
| `queryModel`   | `Query<T[], T>`          | Mongoose query object                 |
| `queryParams`  | `Record<string, unknown>`| The `req.query` from Express or equivalent |

---

### `.search(searchableFields: (keyof T)[])`

Search across given fields using `$regex` (case-insensitive).

```ts
.search(['name', 'email']);
```

---

### `.filter()`

Removes pagination, sort, and other meta fields and applies filtering using remaining query params.

```ts
.filter();
```

---

### `.sort()`

Sorts results. Defaults to `-createdAt` if none is provided.

```ts
// ?sort=name or ?sort=-createdAt
.sort();
```

---

### `.fields()`

Limits returned fields. Use `?fields=name,email` to return only `name` and `email`.

```ts
.fields();
```

---

### `.paginate()`

Applies limit and skip. Defaults to `?page=1&limit=10`.

```ts
.paginate();
```

---

### `.countTotal()`

Returns pagination metadata based on filters:

```ts
const meta = await queryBuilder.countTotal();
/*
{
  page: 1,
  limit: 10,
  total: 35,
  totalPage: 4
}
*/
```

---

## 🧪 Example Query Parameters

```http
GET /api/users?searchTerm=john&sort=name&limit=5&page=2&fields=fullName,email&role=admin
```

Will:
- Search `john` in `fullName`, `id`, and `address`
- Filter by `role=admin`
- Sort by `name`
- Return only `fullName` and `email`
- Return page 2 with 5 results per page

---

## 🛠 Contributing

Contributions, issues and feature requests are welcome!  
Feel free to check [issues page](https://github.com/naimuddin94/mongoose-query-builder/issues).

---

## 📄 License

ISC © [Md Naim Uddin](https://github.com/naimuddin94)

---

## 🔗 Links

- [GitHub Repository](https://github.com/naimuddin94/mongoose-query-builder)
- [Issues](https://github.com/naimuddin94/mongoose-query-builder/issues)
