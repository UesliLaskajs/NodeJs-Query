const Tour = require("../model/tours.model");
const ApiFeature = require("../utils/ApiFeature");

class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryObj = { ...this.queryStr };
        const excludeQueries = ["limit", "sort", "page", "fields"];
        excludeQueries.forEach((el) => delete queryObj[el]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|lt|gt|lte)\b/g, (match) => `$${match}`);
        const parsedData = JSON.parse(queryString);

        this.query = this.query.find(parsedData);
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            this.query = this.query.sort(this.queryStr.sort);
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    field() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-createdAt -price");
        }
        return this;
    }

    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports.getAllTours = async (req, res) => {
    try {
        const feature = new ApiFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .field()
            .paginate();

        const tours = await feature.query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};


module.exports.getTourStats = async (req, res, next) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 3.5 } }
            },
            {
                $group: {
                    _id: "$difficulty",
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPricing: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                }
            },
            {
                $sort: { maxPrice: 1 }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats,
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
    next();
};

module.exports.getTourPlan = async (req, res) => {
    try {
        const year = req.params.year;

        const plans = await Tour.aggregate([
            {
                $unwind: "$startDates"
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                },
            },
            {
                $group: {
                    _id: {
                        $month: "$startDates"
                    },
                    numToursStarts: {
                        $sum: 1
                    },
                    tours: {
                        $push: "$name"
                    }
                }
            },
            {
                $addFields: { month: "$_id" }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {
                    numToursStarts: -1
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plans,
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
};




module.exports.aliasing = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "price";
    req.query.fields = "-createdAt -price";
    next();
};

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
