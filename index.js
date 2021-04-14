// import express
const express = require("express");
const app = express();

// configure express to accept data from the client as JSON format
app.use(express.json())
 
// specify the port that your server will run on
const HTTP_PORT = process.env.PORT || 8080;
 
const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://dbUser:abcd1234@landlorditemcluster.dzhpy.mongodb.net/LandlordItems?retryWrites=true&w=majority"

const connectToDb = () => {
    return mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true})
}

// mongoose.connect(mongoURL, connectionOptions).then(
//     ()=> {

//     }
// ).catch(
//     (err) => {
//         console.log("Error connecting to database")
//         console.log(err)
//     }
// )

// starting express after database is connected

// mongoose.connect(mongoURL, connectionOptions).then(
//    () => {
//        // start the server and output a message if the server started successfully
//        app.listen(HTTP_PORT, onHttpStart);
//    }
// ).catch(
//    (err) => {
//        console.log("Error connecting to database")
//        console.log(err)
//    }
// )

const Schema = mongoose.Schema

const ItemSchema = new Schema({
    id: Number,
    name: String,
    rarity: String,
    description: String,
    goldPerTurn: Number
})

const Item = mongoose.model("items_table", ItemSchema)

// data
let listOfItems = [
    {
        "id": 1,
        "name": "Shiny Pebble",
        "rarity": "common",
        "description": "You are 1.1x more likely to find Uncommon, Rare, and Very Rare symbols.",
        "goldPerTurn" : 0
    },
    {
        "id": 2,
        "name": "Magpie",
        "rarity": "common",
        "description": "Gives you 9 gold every 4 spins.",
        "goldPerTurn" : -1
    },
    {
        "id": 3,
        "name": "King Midas",
        "rarity": "rare",
        "description": "Adds 1 Gold each turn. Adjacent Gold gives 3x more gold.",
        "goldPerTurn" : 2
    },
    {
        "id": 4,
        "name": "Goose",
        "rarity": "common",
        "description": "Has a 1% chance of adding a Golden Egg.",
        "goldPerTurn" : 1
    },
    {
        "id": 5,
        "name": "Bee",
        "rarity": "uncomon",
        "description": "Adject Flowers give 2x more gold.",
        "goldPerTurn" : 1
    },
    {
        "id": 6,
        "name": "Golden Egg",
        "rarity": "rare",
        "description": "",
        "goldPerTurn" : 3
    },
    {
        "id": 7,
        "name": "Cat",
        "rarity": "common",
        "description": "",
        "goldPerTurn" : 1
    },
    {
        "id": 8,
        "name": "Void Stone",
        "rarity": "uncommon",
        "description": "Adjacent empty squares give 1 con more. Destrys itself if adjacent to 0 empty squares. Gives 8 coins when destroyed.",
        "goldPerTurn" : 0
    }
]

// list of url endpoints that your server will respond to
app.get("/api/items", (req, res) => {
 res.send(listOfItems);
});

app.get("/api/items/:item_name", (req, res) => {
    console.log(req.params)
    const itemName = req.params.item_name;

    for(let i = 0; i < listOfItems.length; i++){
        let item = listOfItems[i]
        if(item.name === itemName){
            return res.status(200).send(item)
        }
    }

    res.status(404).send({msg: `Sorry, cound not find the item with item name given ${itemName}`})
})

app.post("/api/items", (req, res) => {
    let insertItem = req.body
    console.log(`Would like to insert a new data : ${insertItem.name}`)

    if("name" in req.body && "rarity" in req.body) {
        listOfItems.push(insertItem)
        res.status(201).send({"msg" : "Item was successfully inserted"})
    }

    res.status(401).send({"msg" : "Sorry, you are missing a rarity or item name"})
})

app.delete("/api/items/:item_name", (req, res) => {
    const itemName = req.params.item_name
    
    let pos = undefined
    for(let i = 0; i < listOfItems.length; i++){
        if(listOfItems[i].name === itemName){
            pos = i
            break
        }
    }

    if (pos === undefined) {
        res.status(404).send({"msg" : `Could not find item with name of ${itemName}`})
        return
    }

    listOfItems.splice(pos, 1)
    res.send({"msg": `Deleted item with the item name of ${itemName}`})
})

app.put("/api/items/:item_id", (req, res) => {
    res.send(404).send({"msg" : `Updating an item is under construction, please come back later and hope it's done`})
})


app.get("/", (req, res) =>  {
    res.status(418).send("This is Luck Be a Landlord API. \n /api/items  - to list everything \n /api/items/:item_id  - put request that's not implemented yet \n /api/items/:item_name - Delete \n /api/items/:item_name - Get request /api/items - Post request");
});
 
// start the server and output a message if the server started successfully
const onHttpStart = () => {
 console.log('Server has started and is listening on port ${HTTP_PORT}')
}


//app.listen(HTTP_PORT, onHttpStart);
connectToDb().then( ()=> {
   // 1. if you were successful in connecting to the database, then
   // ouptut a message
   console.log("Connected to database, loading initial list of books into database")
   //loadInitialMovieList() 
   // 2. after you connect to thedb, start the express server
   console.log("Starting server")
   app.listen(HTTP_PORT, onHttpStart)
}).catch( (error) => {
   console.log("Error from database")
   console.log(error)
})