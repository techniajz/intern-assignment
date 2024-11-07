const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user/userRoutes');
const assetRoutes = require('./routes/asset/assetRoutes');
const app = express();
// Middleware
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/assetManager');
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
      }
    return res.status(err.status || 500).send({
       
        success: false,
        data: [],
        message: req.__('GENERAL_SERVER_ERROR'),
    });
});
app.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});
