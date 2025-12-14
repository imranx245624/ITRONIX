// // pages/api/verify-payment.js
// import admin from "../../server/firebaseAdmin"
// import fetch from "node-fetch"

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end()
//   const { paymentLinkId, registrationId } = req.body

//   try {
//     const keyId = process.env.RAZORPAY_KEY_ID
//     const keySecret = process.env.RAZORPAY_KEY_SECRET
//     const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64")

//     const resp = await fetch(`https://api.razorpay.com/v1/payment_links/${paymentLinkId}`, {
//       headers: { Authorization: `Basic ${auth}` },
//     })
//     const data = await resp.json()
//     if (!resp.ok) {
//       console.error("razorpay lookup failed", data)
//       return res.status(500).json({ error: "Provider lookup failed", details: data })
//     }

//     // data.status can be "paid", "cancelled", "issued", "expired"
//     if (data.status === "paid") {
//       // Update registration doc to paid
//       const ref = admin.firestore().collection("registrations").doc(registrationId)
//       await ref.update({
//         status: "paid",
//         payment: {
//           id: data.payments?.[0]?.id || null,
//           method: data.payments?.[0]?.method || null,
//           paid_at: admin.firestore.FieldValue.serverTimestamp(),
//           providerInfo: data,
//         },
//       })
//       return res.status(200).json({ status: "paid" })
//     } else {
//       return res.status(200).json({ status: data.status || "not_paid" })
//     }
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: "Server error" })
//   }
// }
