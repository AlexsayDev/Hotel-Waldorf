const notFound = (req, res) => {
    res.status(404).json({
        ok: false,
        message: `Ruta no encontrada: ${req.originalUrl}`
    });
};

export default notFound;