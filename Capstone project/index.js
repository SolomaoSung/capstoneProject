import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let allPosts = [];
let currentId = 0;
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true}));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get("/", (req, res) => {
    res.render("index.ejs", {posts: allPosts});
})

app.get("/create", (req, res) => {
    res.render("create.ejs");
})

app.post("/create", (req, res) => {
    currentId ++;
    const { title, content } = req.body;
    allPosts.push({id: currentId, title, content});
    res.redirect("/");
});

app.get("/post/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const post = allPosts.find(post => post.id === postId);
    if (post){
        res.render("post.ejs", { post: post });
    }else{
        res.status(404).send('Post não encontrado!');
    }
})

app.get("/edit/:id", (req, res) =>{
    const postId = parseInt(req.params.id);
    const post = allPosts.find(post => post.id === postId);
    if (post){
        res.render("edit.ejs", {post});
    }else{
        res.status(404).send('Post não encontrado!');
    }
});

app.post("/update/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;

    let post = allPosts.find(p => p.id === postId);
    if(post){
        post.title = title;
        post.content = content;
        res.redirect("/");
    }else{
        res.status(404).send('Post não encontrado!');
    }
});

app.delete('/post/:id/delete', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = allPosts.findIndex(post => post.id === postId);
    
    if (postIndex !== -1) {
        allPosts.splice(postIndex, 1); // Remove o post do array
        res.status(200).json({ message: 'Post deletado com sucesso!' });
    } else {
        res.status(404).json({ message: 'Post não encontrado!' });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});