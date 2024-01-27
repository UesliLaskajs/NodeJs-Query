
const Tour = require("../model/tours.model");


module.exports.getAllTours = async (req, res) => {
    try {
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

        const feature = new ApiFeature(Tour.find(), req.query)
            .filter()
            .sort()
            .field()
            .paginate();

        const tours = await feature.query;

        // Send the tours as a response
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (error) {
        // Handle the error appropriately
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

module.exports.aliasing = (req, res, next) => {
    req.query.limit = "5"
    req.query.sort = "price"
    req.query.fields = "-createdAt -price"
    next();
}

module.exports.getTour = async (req, res) => {
    try {
        const foundTour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'Successfully sent',
            data: {
                tour: foundTour,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Server Error',
            error: err.message,
        });
    }
};

module.exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            message: 'Successfully created',
            data: {
                tourNew: newTour,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Server Error',
            error: err.message,
        });
    }
};

module.exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            status: 'success',
            message: 'Successfully updated',
            data: {
                updatedTour,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Server Error',
            error: err.message,
        });
    }
};

module.exports.deleteTour = async (req, res) => {
    try {
        const deletedTour = await Tour.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'Successfully deleted',
            data: {
                deletedTour,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error Deleting',
            error: err.message,
        });
    }
};
