class ApiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        // Filtering
        const queryObj = { ...this.queryStr };
        const excludeQueries = ["limit", "sort", "page", "fields"];
        excludeQueries.forEach((el) => delete queryObj[el]);

        // Advanced Filter
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|lt|gt|lte)\b/g, (match) => `$${match}`);
        const parsedData = JSON.parse(queryString);

        this.query = this.query.find(parsedData); // Update this line
        return this; // Add this line to enable method chaining
    }

    sort() {
        if (this.queryStr.sort) {
            this.query = this.query.sort(this.queryStr.sort); // Update this line
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    field() {
        // Fields
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields); // Update this line
        } else {
            this.query = this.query.select("-createdAt -price");
        }
        return this;
    }

    paginate() {
        // Pagination
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit); // Update this line
        return this;
    }
}
module.exports.ApiFeature;