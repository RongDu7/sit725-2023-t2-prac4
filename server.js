require('dotenv').config()
var express = require("express")
var app = express()
var cors = require("cors")

let projectCollection;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://doridu077:oQNuFuBZBjfmJvA7@sit725-2023-t2-prac4.1shdhdg.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    // client.db("admin").collection("pets");  
    
    //client.db().createCollection('userlist')
    console.log("projectCollection created!")

  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

const createColllection = (collectionName) => {
    // client.connect();
    // projectCollection = client.db().createCollection(collectionName);

   client.connect((err,db) => {
       console.log('Start creating projectColletion')
     projectCollection = client.db().createCollection(collectionName);
       console.log('Start MongoDB client')
     if(!err) {
           console.log('MongoDB Connected')
       }
       else {
           console.log("DB Error: ", err);
           process.exit(1);
       }
     console.log('Finish MongoDB client')
   })
}

const insertProjects = (project,callback) => {
    projectCollection.insert(project,callback);
}

const getProjects = (callback) => {
    projectCollection.find({}).toArray(callback);
}

const cardList = [
    {
        title: "Kitten 2",
        image: "images/kitten-2.jpg",
        link: "About Kitten 2",
        description: "Demo desciption about kitten 2"
    },
    {
        title: "Kitten 3",
        image: "images/kitten-3.jpg",
        link: "About Kitten 3",
        description: "Demo desciption about kitten 3"
    }
]
app.get('/api/projects',(req,res) => {
    getProjects((err,result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Success", data: result})
        }
    })
})

app.post('/api/addprojects',(req,res) => {
    console.log("New Project added", req.body)
    var newProject = req.body;
    insertProjects(newProject,(err,result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Project Successfully added", data: result})
        }
    })
})
const addNumbers = (number1, number2) => {
    var num1 = parseInt(number1)
    var num2 = parseInt(number2)
    var result = num1 + num2;
    return result;
}

app.get("/addTwoNumbers",(req,res) => {
    var number1 = req.query.number1;
    var number2 = req.query.number2;
    var result = addNumbers(number1,number2)
    res.json({statusCode: 200, data: result, message:"Success"})
})

var port = process.env.port || 3000;

app.listen(port,()=>{
    console.log("App running at http://localhost:"+port)
    createColllection("pets")
})
