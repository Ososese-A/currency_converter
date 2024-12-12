require('dotenv').config()
const express = require('express')
const mongoose = require("mongoose")
const fs = require('fs').promises;
const path = require('path');
const Conversion = require('./models/conversionModel')

const app = express()


app.use(express.json())
app.use(logger)


fetchConversionData = async () => {
    const url = `https://currency-converter-pro1.p.rapidapi.com/latest-rates?base=USD`;
    const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': process.env.API_KEY,
        'x-rapidapi-host': process.env.HOST
    }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        // console.log(result);
        return result
    } catch (error) {
        console.error(error);
    }
    // try {
    //     const filePath = path.join(__dirname, 'currency.json');
    //     const fileContents = await fs.readFile(filePath, 'utf8');
    //     const data = JSON.parse(fileContents);
    //     return data
    // } catch (error) {
    //     console.log(error("This error is from the currency.json file: ",error))
    // }
}

app.get("/", async (req, res) => {
    const conversionData = await fetchConversionData()
    const currencies = Object.keys(conversionData.result)
    // console.log(conversionData)
    res.status(200).json({mssg: "These are all the currencies currently available", data: currencies})
})

app.post("/", async (req, res) => {
    const conversionData = await fetchConversionData()
    const {amount, from, to,} = req.body
    // console.log(amount, from, to)
    convert_from = conversionData.result[from]
    convert_to = conversionData.result[to]
    const rate = (convert_to / convert_from)
    const result = (rate * amount).toFixed(3)

    try {

        const converted = await Conversion.create({amount, from, to, rate, result})
        res.status(200).json(converted)

    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

app.get("/history", async (req, res) => {
    const conversions = await Conversion.find({}).sort({createdAt: -1})
    res.status(200).json(conversions)
})

function logger(req, res, next) {
    console.log(req.path, req.method)
    next()
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("The db is connected and running at port :", process.env.PORT)
        })
    }) 
    .catch((error) => {
        console.log(error)
    })