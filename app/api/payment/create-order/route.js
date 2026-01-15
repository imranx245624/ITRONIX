// import Razorpay from "razorpay"
// import { NextResponse } from "next/server"

// export async function POST(req) {
//   try {
//     const { amount } = await req.json()

//     if (!amount || amount <= 0) {
//       return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
//     }

//     const razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     })

//     const order = await razorpay.orders.create({
//       amount: amount * 100,
//       currency: "INR",
//       receipt: `itr_${Date.now()}`,
//     })

//     return NextResponse.json(order)
//   } catch (err) {
//     console.error("Create order error:", err)
//     return NextResponse.json({ error: "Order creation failed" }, { status: 500 })
//   }
// }
