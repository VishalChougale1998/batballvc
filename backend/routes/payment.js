import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "order_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        console.log("ORDER CREATED:", order); // 🔥 debug

        res.json({
            id: order.id,         // ✅ MUST SEND
            amount: order.amount, // ✅ MUST SEND
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Order creation failed" });
    }
});

export default router;