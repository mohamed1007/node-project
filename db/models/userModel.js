import mongoose from "mongoose";
let userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    addresses: [{ type: String }],
    resetPasswordToken: { type: String}
})
const userModel = mongoose.model('User', userSchema)
export default userModel ;