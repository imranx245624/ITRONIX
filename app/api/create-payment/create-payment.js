// // pages/api/create-payment.js
// import admin from "../../server/firebaseAdmin"
// import fetch from "node-fetch"

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end()
//   const { formData, amount } = req.body

//   try {
//     // 1) Save a registration with status 'pending_payment'
//     const docRef = await admin.firestore().collection("registrations").add({
//       ...formData,
//       amount,
//       category: "event",
//       status: "pending_payment",
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     })

//     const registrationId = docRef.id

//     // 2) Create Razorpay Payment Link (short_url) using REST API
//     const keyId = process.env.RAZORPAY_KEY_ID
//     const keySecret = process.env.RAZORPAY_KEY_SECRET
//     const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64")

//     const payload = {
//       amount: amount * 100, // in paise
//       currency: "INR",
//       accept_partial: false,
//       description: `ITRONIX registration for ${formData.registrationType}`,
//       customer: {
//         name: formData.fullName,
//         email: formData.email,
//         contact: formData.phone.replace(/\s+/g, ""),
//       },
//       notify: { sms: true, email: true },
//       reminder_enable: true,
//       // pass registration ID in notes to later match
//       notes: { registrationId },
//     }

//     const resp = await fetch("https://api.razorpay.com/v1/payment_links", {
//       method: "POST",
//       headers: {
//         Authorization: `Basic ${auth}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         amount: payload.amount,
//         currency: payload.currency,
//         accept_partial: payload.accept_partial,
//         description: payload.description,
//         customer: payload.customer,
//         notify: payload.notify,
//         reminder_enable: payload.reminder_enable,
//         notes: payload.notes,
//       }),
//     })

//     const data = await resp.json()
//     if (!resp.ok) {
//       console.error("razorpay error", data)
//       return res.status(500).json({ error: "Payment provider error", details: data })
//     }

//     // update registration with link id/url
//     await docRef.update({
//       paymentLinkId: data.id,
//       paymentUrl: data.short_url || data.long_url || null,
//     })

//     res.status(200).json({ paymentUrl: data.short_url || data.long_url, paymentLinkId: data.id, registrationId })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: "Server error" })
//   }
// }
