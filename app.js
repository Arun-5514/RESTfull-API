const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
  title: String,
  content:String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get((req,res)=>{
        Article.find((err, allArticles)=>{
            if(!err) {
                res.send(allArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req,res) =>{
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if(!err){
                res.send("New Article added Successfully !!");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req,res) => {
        Article.deleteMany((err) => {
            if(!err) {
                res.send("All Data deleted successfully !")
            } else {
                res.send(err)
            }
        });
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title : req.params.articleTitle}, (err, foundArticle) => {
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No articles matching that article found !!");
            }
        })
    })
    .put((req,res) => {
        Article.update(
            {title : req.params.articleTitle}, 
            {title : req.body.title, content : req.body.content}, 
            {overwrite: true}, 
            (err) => {
                if(!err){
                    res.send("Data updated successfully !!");
                } else {
                    res.send(err);
                }
        });
    }).patch((req,res) =>{
        Article.update(
            {title : req.params.articleTitle},
            {$set : req.body},
            (err) => {
                if(!err) {
                    res.send("Succressfully Updated Patch")
                } else {
                    res.send(err);
                }
            }
        )
    }).delete((req,res) => {
        Article.deleteOne(
            {title : req.params.articleTitle},
            (err) => {
                if(!err){
                    res.send("Document deleted successfully");
                } else {
                    res.send(err);
                }
            }
        )
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
