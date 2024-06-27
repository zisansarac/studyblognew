
const {Schema, model} =require("mongoose");

const postSchema = new Schema({
    title: {type: String, required:true},
    category: {type: String, enum: ["Elementaryschool", "Middleschool", "Highschool","University"], message: "{Value isn't supported."},
    description: {type: String, required: true},
    creator: {type: Schema.Types.ObjectId, ref: "User"},
    thumbnail: {type: String, required: true}
   }, {timestamps: true})


   module.exports = model("Post", postSchema)