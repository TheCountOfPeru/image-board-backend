module.exports = (mongoose, mongoosePaginate) => {
    const schema = mongoose.Schema(
        {
          title: String,
          description: String,
          filename: String,
        },
        { timestamps: true },
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    schema.plugin(mongoosePaginate);

    const Post = mongoose.model("post", schema);
    return Post;
  };