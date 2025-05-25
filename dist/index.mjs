// src/index.ts
var QueryBuilder = class {
  constructor(queryModel, query) {
    this.modelQuery = queryModel;
    this.query = query;
  }
  search(searchableFields) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => {
          return {
            [field]: { $regex: searchTerm, $options: "i" }
          };
        })
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
      "fields"
    ];
    excludeFields.forEach((field) => delete queryObject[field]);
    const queryStr = JSON.stringify(queryObject).replace(
      /\b(gte|gt|lte|lt|ne|in|nin)\b/g,
      (match) => `$${match}`
    );
    this.modelQuery = this.modelQuery.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    const sort = this.query?.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
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
    const fields = this?.query?.fields?.split(",")?.join(" ");
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
      totalPage
    };
  }
};
var index_default = QueryBuilder;
export {
  index_default as default
};
