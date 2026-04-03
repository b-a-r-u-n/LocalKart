
const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.log("AsyncHandler error", error);
            res.status(error?.statusCode || 500).json({
                message: error?.message || "Internal Server Error",
                statusCode: error?.statusCode || 500,
                success: false
            })
        }
    }
}

export default asyncHandler;