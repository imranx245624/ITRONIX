// // pages/api/register-workshop.js
// import admin from "../../server/firebaseAdmin"

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end()

//   const { fullName, email, phone, college, registrationType, teamMembers } = req.body

//   try {
//     const docRef = await admin.firestore().collection("registrations").add({
//       fullName, email, phone, college, registrationType, teamMembers,
//       category: "workshop",
//       sponsorRedirected: false,
//       status: "pending_redirect",
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     })

//     // Here: choose sponsor URL logic. For demo, we map registrationType -> sponsor url.
//     const sponsorMap = {
//       "AI & ML Bootcamp": "https://sponsor.example.com/ai-bootcamp",
//       "Web Dev: From Idea to Launch": "https://sponsor.example.com/webdev",
//     }
//     const sponsorUrl = sponsorMap[registrationType] || "https://sponsor.example.com/default"

//     // save sponsorUrl to doc
//     await docRef.update({ sponsorUrl })

//     res.status(200).json({ registrationId: docRef.id, sponsorUrl })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: "Server error" })
//   }
// }
