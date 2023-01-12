const uploadFile = require("../middleware/upload");
const db = require("../models");
const Post = db.posts;
const sharp = require('sharp');


const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

// Create and Save a new Tutorial
exports.create = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
     
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }
    if (err.message == "Only .png, .jpg and .jpeg format allowed!") {
      return res.status(500).send({
        message: err.message,
      });
    }

    else return res.status(500).send({
      message: `Some error occurred while creating the board. Could not upload the file: ${req.file.originalname}. ${err}`,
    });

  }

    // Validate request
    if (!req.body.title) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
    console.log(req.body)
    // Create a Tutorial
    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      filename: req.file.originalname,
    });
    console.log(post)
    // Save Tutorial in the database
    post
      .save(post)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while creating the board."
        });
      });
      
      // res.status(200).send({
      //   message: "Uploaded the file and submitted the information successfully: " + req.file.originalname,
      // });
      console.log("Uploaded the file successfully: " + req.file.originalname)

      //make a resized copy
      
      console.log("resources/static/assets/uploads/"+req.file.originalname)
      sharp('resources/static/assets/uploads/'+req.file.originalname)
      .resize({ width: 100 })
      .toFile('resources/static/assets/uploads/th_'+req.file.originalname, function(err) {
      // output.jpg is a 300 pixels wide and 200 pixels high image
      // containing a scaled and cropped version of input.jpg
  }); 
  };

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  console.log(req.query);
  const { page, size, title } = req.query;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  const { limit, offset } = getPagination(page, size);

  Post.paginate(condition, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        posts: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving boards.",
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Post.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Board with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Board with id=" + id });
      });
  };

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Post.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Board with id=${id}. Maybe Tutorial was not found!`
          });
        } else res.send({ message: "Board was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Board with id=" + id
        });
      });
  };

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Post.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Board with id=${id}. Maybe Tutorial was not found!`
          });
        } else {
          res.send({
            message: "Board was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Board with id=" + id
        });
      });
  };

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Post.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Tutorials were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all tutorials."
        });
      });
  };

  // Find all published Tutorials
exports.findAllPublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Post.paginate({ published: true }, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        posts: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving boards.",
      });
    });
};

