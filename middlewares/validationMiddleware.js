const validation = (schema) => async (req, res, next) => {
    const body = req.body;
    console.log('get here! ')
    try {
        await schema.validate(body);
        next();
        return next();
    } catch (error) {
        return res.status(400).json({ error });
    }
};



module.exports = validation