const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userroute = require('./routes/user.js');
const authroute = require('./routes/auth.js');



require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: false })) //for parsing form data in request.

// routes
app.use('/user', userroute);
app.use('/auth', authroute);


//connecting mongodb
let mongodburi = process.env.MONGODB_URI || 'mongodb://localhost:27017/userfinalauth'
mongoose.connect(mongodburi, { useNewUrlParser: true, useUnifiedTopology: true, 'useCreateIndex': true })
    .then(res => console.log("Database connected..."))
    .catch(error => console.log(err));

app.get('/', (req, res) => {
    res.send('hello');

})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));