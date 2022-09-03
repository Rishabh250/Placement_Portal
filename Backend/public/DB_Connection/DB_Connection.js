import mongoose from 'mongoose'

const connection = async ()=>{
    await mongoose.connect("mongodb+srv://Rishabh25Bansal:pqr1FerIhIIux8m9@cluster0.zxgvcs6.mongodb.net/test")
    .then((response)=>console.log(`Connection Success with MongoDB`))
    .catch((response)=>console.log(`Connection Error with MongoDb`))
}

 
export default connection;