const errorHandler = (error, req, res, next) => {
    console.error(error);

    res.status(error.status || 500).json({
        ok: false,
        message: error.message || 'Error interno del servidor'
    });
};

export default errorHandler;