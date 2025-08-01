const express = require('express');
const cors = require("cors");
const port = process.env.PORT || 1000;
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const app = express()
// app.use(cors({
//   origin:['http://localhost:5173'],
//   credentials:true,
// }))
// app.use(express.json())
// app.use(cookieParser())


// const verifyToken =(req,res,next) =>{
//   const token = req.cookies?.token;
//   if(!token){
//     return res.status(401).send({message: 'unauthorized access'})
//   }
  
//   jwt.verify(token, process.env.JWT_SECRET,(err,decoded) =>{
//     if(err){
//       return res.status(401).send({message: 'unauthorized access'})
//     }

//     req.user = decoded;

//     next()
//   })
  
// }


// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.pzjaifg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });



// async function run() {
//   try {

//     const invoiceCollection = client.db("EzInvoBilling").collection("invoiceCollection")
//     const invoiceUsersCollection = client.db("EzInvoBilling").collection("usersCollection")

 
//     app.post('/jwt', async(req,res) =>{
//       const user = req.body;
//       const token = jwt.sign(user,process.env.JWT_SECRET,{expiresIn: '7d'});
//       res.cookie('token', token,{
//         httpOnly:true,
//         secure: false
//       }).send({success: true})
//     })


//     app.post("/usersCollection", async (req, res) => {
//       const userData = req.body;
//       const result = await invoiceUsersCollection.insertOne(userData)
//       res.send(result)
//     })
//     app.get("/usersCollection/:email",verifyToken, async (req, res) => {
//       const email = req.params.email;
//       if(req.user.email !== email){
//         res.status(403).send({message: 'forbidden access'})
//       }
//       const query = { email }
//       const result = await invoiceUsersCollection.findOne(query)
//       res.send(result)
//     })

//     app.get('/usersCollection/admin/:email', async (req, res) => {
//       const email = req.params.email;
//       const query = { email }
//       const user = await invoiceUsersCollection.findOne(query);
//       res.send({ isAdmin: user?.role === 'admin' })
//     })
//     app.get("/usersCollection", async (req, res) => {
//       const query = {}
//       const result = await invoiceUsersCollection.find(query).toArray()
//       res.send(result)
//     })
//     app.get("/usersCollection/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) }
//       const result = await invoiceUsersCollection.findOne(query)
//       res.send(result)
//     })

//     app.patch("/usersCollection/:id", async (req, res) => {
//       const id = req.params.id;
//       const updatedInfo = req.body;
//       const filter = { _id: new ObjectId(id) }
//       const option = { upsert: true }
//       const updatedUser = {
//         $set: {
//           fullName: updatedInfo.name,
//           mobileNumber: updatedInfo.phoneNumber,
//           profileImage: updatedInfo.photoUrl,
//           gender: updatedInfo.gender
//         }
//       }

//       const result = await invoiceUsersCollection.updateOne(filter, updatedUser, option)

//       res.send(result)

//     })

//     app.delete('/usersCollection/:id', async (req, res) => {
//       const id = req.params.id
//       const query = { _id: new ObjectId(id) }
//       const result = await invoiceUsersCollection.deleteOne(query);
//       res.send(result)
//     })

//     app.patch('/makeAdmin/usersCollection/:id', async (req, res) => {
//       const id = req.params.id
//       const filter = { _id: new ObjectId(id) }
//       const option = { upsert: true }
//       const updateDoc = {
//         $set: {
//           role: "admin"
//         }

//       }
//       const result = await invoiceUsersCollection.updateOne(filter, updateDoc, option)
//       res.send(result)


//     })
//     app.patch('/deleteAdmin/usersCollection/:id', async (req, res) => {
//       const id = req.params.id
//       const filter = { _id: new ObjectId(id) }
//       const option = { upsert: true }
//       const updateDoc = {
//         $set: {
//           role: ""
//         }

//       }
//       const result = await invoiceUsersCollection.updateOne(filter, updateDoc, option)
//       res.send(result)


//     })

//     app.post("/invoiceCollections", async (req, res) => {
//       const invoiceData = req.body;
//       const result = await invoiceCollection.insertOne(invoiceData)
//       res.send(result)
//     })
//     app.get("/invoiceCollections/:email", verifyToken, async (req, res) => {
     
//       const email = req.params.email;

//       if(req.user.email !== email){
//         return res.status(403).send({message: "forbidden access"})
//       }

//       const query = { email }
      
//       const result = await invoiceCollection.find(query).toArray()
//       res.send(result)
//     })
//     app.get("/invoiceCollections", async (req, res) => {

//       const query = {}

//       const result = await invoiceCollection.find(query).toArray()
//       res.send(result)
//     })

//     app.get('/invoiceCollections/invoice/:id', async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) }
      
//       const itemDetails = await invoiceCollection.findOne(query);

//       res.json(itemDetails)
//     })
//     app.delete('/invoiceCollections/:id', async (req, res) => {
//       const id = req.params.id
//       const query = { _id: new ObjectId(id) }
//       const itemDetails = await invoiceCollection.deleteOne(query);

//       res.send(itemDetails)
//     })

//     app.post("/send-invoice-email/:id", async (req, res) => {
//       const id = req.params.id;


//       try {
//         const invoice = await invoiceCollection.findOne({ _id: new ObjectId(id) });


//         if (!invoice) {
//           return res.status(404).send({ message: "Invoice not found" });
//         }

//         const transporter = nodemailer.createTransport({
//           service: "gmail", // or use your mail provider
//           auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//           },
//         });

//         const mailOptions = {
//           from: `"EzInvo App" <${process.env.EMAIL_USER}>`,
//           to: invoice.clientsEmail, // Make sure `clientEmail` exists in your invoice data
//           subject: `Invoice #${invoice._id}`,
//           text: `Dear ${invoice.clientsName || "Client"},

//           We hope you're doing well.

//           Please find your invoice summary below:

//           Invoice Total: $${invoice.grandTotal}

//           You can view the full invoice here:
//           ${invoice.pdfViewerLink}

//           To complete the payment, please click the link below:
//           ${invoice.paymentLink}

//           If you have any questions, feel free to reply to this email. Thank you for your business!

//           Best regards,  
//           EzInvo Team`

//         };

//         await transporter.sendMail(mailOptions);

//         res.send({ message: "Email sent successfully" });
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: "Error sending email" });
//       }
//     });

//     app.post('/invoicePay/:id', async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) }
    

//       const invoice = await invoiceCollection.findOne(query);
  
//       if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

//       // If already paid
//       if (invoice.paid) return res.status(400).json({ error: 'Invoice already paid' });

//       // Reuse existing payment link
//       if (invoice.paymentLink) return res.json({ url: invoice.paymentLink });

//       // Create Stripe checkout session
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [{
//           price_data: {
//             currency: 'usd',
//             product_data: { name: `Invoice #${id}` },
//             unit_amount: invoice.grandTotal * 100,
//             // days_until_due: 30,
//           },
//           quantity: 1,
//         }],
//         mode: 'payment',
//         success_url: `http://localhost:5173/success?invoiceId=${id}`,
//         cancel_url: `http://localhost:5173/cancel`,
//         customer_email: invoice.clientsEmail,
//         metadata: { invoiceId: id },
//       });

//       // Save payment link to MongoDB
//       await invoiceCollection.updateOne(
//         { _id: new ObjectId(id) },
//         {
//           $set:
//           {
//             paymentLink: session.url,
//             pdfViewerLink: `http://localhost:5173/pdfViewerPage/${id}`
//           }

//         }
//       );
//     });

//     app.post('/api/invoice/mark-paid/:id', async (req, res) => {
//       const { id } = req.params;
//       await invoiceCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: { paid: true } }
//       );
//       res.json({ message: 'Invoice marked as paid.' });
//     });

//     app.get('/allPaidData',async (req,res) =>{
//       const result = await invoiceCollection.find({ paid: true }).toArray()
//       res.send(result)
//     })

//   }
//   finally {

//   }
// }
// run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("ez invo running")
})

app.listen(port, () => {
  console.log(`ezinvo is running on ${port}`)
})













