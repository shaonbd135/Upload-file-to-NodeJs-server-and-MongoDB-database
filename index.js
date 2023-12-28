const express = require("express");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
require("dotenv").config();

const config = require("./config");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const url = config.db.url;
//Connect to Database
const connectDB = async () => {
    try {

        await mongoose.connect(url);
        console.log("DataBase Connected");

    } catch (error) {
        console.log("not connected")
        console.log(error.message);
        process.exit(1);

    }
}

//creating database schema and model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "user name is require"]
    },

    image: {
        type: String,
        require: [true, "user image is require"]
    }
})

const User = mongoose.model("Test Users", userSchema);



//file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const name = Date.now() + "_" + file.originalname;
        cb(null, name);
    }
})

const upload = multer({ storage: storage })


app.get("/test", (req, res) => {
    res.status(200).send("testing api");
})

app.get("/register", (req, res) => {
    res.status(200).sendFile(__dirname + "/index.html");
})

app.post("/register", upload.single("image"), async (req, res) => {

    try {
        const newUser = new User({
            name : req.body.name,
            image: req.file.filename
        });

        await newUser.save();
        res.status(201).send(newUser);

    } catch (error) {
        res.status(500).send(error.message);
    }

})

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDB();
})