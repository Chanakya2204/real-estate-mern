const mongoose=require('mongoose')


module.exports=async ()=>{
try{
    // mongoose.set('strictQuery', false);
   const connect= await mongoose.connect(process.env.DATABASE_URL);

   console.log(`MongoDb connected :${connect.connection.host}`);

}catch(e){
    console.log(e);
    process.exit(1);
    process.exit(1);
}
}