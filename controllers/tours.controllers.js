const Tour = require("../model/tours.model");

module.exports.getAllTours = async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query };
        // const excludeQueries = ["limit", "sort", "page", "fields"];
        // excludeQueries.forEach(el => delete queryObj[el]);

        // Advance Filter
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|lt|gt|lte)\b/g, match => `$${match}`);
        let parsedData = JSON.parse(queryStr);

        // MongoDB Query
        let query = Tour.find(parsedData);

        // Sorting
        if (req.query.sort) {
            query = query.sort(req.query.sort);
        } else {
            query = query.sort("-createdAt");
        }
        //Fields

        if (req.query.fields) {
            let fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-createdAt -price");
        }

        //Pagination

        const page=req.query.page * 1 || 1;
        const limit=req.query.limit * 1 || 100;
        const skip=(page - 1) * limit;

        if(req.query.page){
            numOfPage=await Tour.countDocuments();
            if(numOfPage >=skip){
                throw new Error("Error Num of Pages is greater than skip")
            }
        }
        query=query.skip(skip).limit(limit)
        // Execute the query
        const tours = await query;

        // Sending a JSON response with the fetched tours
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (err) {
        // Handling errors and sending an error response
        console.error(err);

        // Check if the error is circular before sending it in the response
        let errorResponse;

        if (err instanceof Error) {
            errorResponse = {
                status: 'error',
                message: 'Server Error',
                error: {
                    name: err.name,
                    message: err.message,
                    stack: err.stack,
                },
            };
        } else {
            // If it's not an Error object, convert it to a string
            errorResponse = {
                status: 'error',
                message: 'Server Error',
                error: err.toString(),
            };
        }

        res.status(500).json(errorResponse);
    }
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
