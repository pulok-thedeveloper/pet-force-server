const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tftz42f.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//Connecting Database
async function dbConnect() {
  try {
    await client.connect();
    console.log("Database Connected");
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
}

dbConnect();

const Services = client.db("petForce").collection("services");
app.get("/services", async (req, res) => {
  try {
    const cursor = Services.find({});
    const services = await cursor.toArray();

    res.send({
      success: true,
      data: services,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

app.get("/limitedservice", async (req, res) => {
  try {
    const cursor = Services.find({});
    const services = await (await cursor.toArray()).slice(0, 4);

    res.send({
      success: true,
      data: services,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

app.get("/service/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const service = await Services.findOne(query);

    res.send({
      success: true,
      data: service,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

app.post("/services", async (req, res) => {
  try {
    const service = req.body;
    const result = await Services.insertOne(service);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

app.put("/service/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const service = req.body;
    const query = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedService = {
      $set: {
        title: service.title,
        description: service.description,
        icon: service.icon,
        image: service.image,
        details: service.details,
      },
    };
    const result = await Services.updateOne(query, updatedService, option);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

app.delete("/service/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await Services.deleteOne(query);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

const Gallery = client.db("petForce").collection("gallery");
app.get("/gallery", async (req, res) => {
  try {
    const cursor = Gallery.find({});
    const gallery = await cursor.toArray();

    res.send({
      success: true,
      data: gallery,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

const Reviews = client.db("petForce").collection("reviews");

//All reviews
app.get("/reviews", async (req, res) => {
  try{
    let query = {};
  if (req.query.email) {
    query = {
      email: req.query.email,
    };
  }
  const cursor = Reviews.find(query);
  const reviews = await cursor.toArray();
  res.send({
    success: true,
    data: reviews
  });
  }
  catch(error){
    res.send({
      success: false,
      data: error.message
    })
  }
});

// Reviews based on services
app.get("/review/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { serviceId: id };
    const cursor = Reviews.find(query);
    const reviews = await cursor.toArray();
    res.send({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

// Post Reviews
app.post("/reviews", async (req, res) => {
  const review = req.body;
  const result = await Reviews.insertOne(review);
  res.send(result);
});

// Update Review

app.put("/review/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const review = req.body;
    const query = { _id: new ObjectId(id) };
    const option = { upsert: true };
    const updatedReview = {
      $set: {
        review: review.review,
      },
    };
    const result = await Reviews.updateOne(query, updatedReview, option);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

// Post Delete
app.delete("/review/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await Reviews.deleteOne(query);
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

const Blogs = client.db('petForce').collection('blogs');
app.get('/blogs', async(req, res)=>{
  try {
    const cursor = Blogs.find({});
    const blogs = await cursor.toArray();

    res.send({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})

app.get("/", (req, res) => {
  try {
    res.send("PetForce server is running...");
  } catch (error) {
    res.send(error.message);
  }
});

app.listen(port, () => console.log("PetForce Server running on port", port));
