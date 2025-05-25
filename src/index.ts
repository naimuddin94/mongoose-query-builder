import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = queryModel;
    this.query = query;
  }

  search<K extends keyof T>(searchableFields: K[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => {
          return {
            [field]: { $regex: searchTerm, $options: "i" },
          } as FilterQuery<T>;
        }),
      });
    }

    return this;
  }

  filter() {
    const queryObject = { ...this.query };
    const excludeFields = [
      "searchTerm",
      "sort",
      "page",
      "limit",
      "fields",
    ] as const;
    excludeFields.forEach((field) => delete queryObject[field]);

    // Handle operators like gte, lte, etc.
    const queryStr = JSON.stringify(queryObject).replace(
      /\b(gte|gt|lte|lt|ne|in|nin)\b/g,
      (match) => `$${match}`
    );

    this.modelQuery = this.modelQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    const sort = this.query?.sort || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }

  paginate() {
    const limit = Number(this?.query?.limit) || 10;
    const page = Number(this?.query?.page) || 1;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }
  fields() {
    const fields = (this?.query?.fields as string)?.split(",")?.join(" ");

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
