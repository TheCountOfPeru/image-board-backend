module.exports = app => {
    const posts = require("../controllers/post.controller.js");
    const files = require("../controllers/file.controller.js");
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/posts/", posts.create);
  
    // Retrieve all Tutorials
    router.get("/posts/", posts.findAll);
  
    // Retrieve all published Tutorials
    router.get("/posts/published", posts.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/posts/:id", posts.findOne);
  
    // Update a Tutorial with id
    router.put("/posts/:id", posts.update);
  
    // Delete a Tutorial with id
    router.delete("/posts/:id", posts.delete);
  
    // Create a new Tutorial
    router.delete("/posts/", posts.deleteAll);

    router.get("/files", files.getListFiles);

    router.get("/files/:name", files.download);

    app.use('/api',router);
  };