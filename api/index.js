import express from 'express'
import cors from 'cors'
// import connection from './database'
import auth from "./routes/jwAuth";

import fileUpload from 'express-fileupload';

const app = express()

app.use(fileUpload());
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());


app.use("/auth", auth);


app.post('/upload', (req, res) => {
    if (req.files) {
        const file = req.files.file
        const fileName = file.name
        file.mv(`${__dirname}/pythonProject/virtual/mysite/myapi/Code/dataset/foruser/${fileName}`, err => {
            if (err) {
                console.log(err)
                res.send('failed')
            } else {
                res.send('success')
            }
        })
    } else {
        res.send('There are no files')
    }
})





module.exports = {
    path: "/api/",
    handler: app
}

