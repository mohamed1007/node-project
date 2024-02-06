import mongoose from "mongoose";
const initConnection =() => {
mongoose.connect('mongodb://127.0.0.1:27017/ECommerce')
  .then(() => console.log('Connected!'))
  .catch((err) => console.log('Error connecting to Mongo',err));
}
export default initConnection ;