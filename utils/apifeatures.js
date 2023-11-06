class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // abb search functionality banate hai
  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              title: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              tags: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};
    // console.log(keyword);

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // removing some fields for category... q ki category me wo particular categories aa jane chahiye baki saab ka uss pe koi effect nhi padna chahiye
    const removeFields = ["keyword", "tags", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // filter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // abb ye string ko wapas se objevt me convert karna padenga
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

export default ApiFeatures;
