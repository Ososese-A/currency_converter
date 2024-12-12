const mongoose = require('mongoose')

const Schema = mongoose.Schema

const conversionSchema = new Schema(
    {
        amount : {
            type: Number,
            required: true
        },

        from : {
            type: String,
            required: true
        },

        to : {
            type: String,
            required: true
        },

        rate : {
            type: Number,
            required: true
        },

        result : {
            type: Number,
            required: true
        }
    }, 

    {timestamps: true}
)

module.exports = mongoose.model('Conversion', conversionSchema)