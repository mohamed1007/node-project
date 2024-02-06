import express from 'express';
import initConnection from "./db/initConnection.js";
import userRoutes from './src/modules/users/user.routes.js';
import productRoutes from './src/modules/products/product.routes.js';
import categoryRoutes from './src/modules/categories/category.routes.js'
import cartRoutes from './src/modules/carts/cart.routes.js'
import couponRoutes from './src/modules/coupons/coupon.routes.js'
import multer from 'multer';

initConnection();
const server = express();
server.use(express.json())
server.use(userRoutes);
server.use(productRoutes);
server.use(categoryRoutes);
server.use(cartRoutes);
server.use(couponRoutes);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })
server.post("/photo",upload.single("profilePicture"), (req,res)=>{
    res.json({message:"hi"})
})

server.listen(3000);