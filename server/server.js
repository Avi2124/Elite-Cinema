import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from "./routes/userRoute.js";
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import { stripeWebhooks } from './controller/stripeWebhooks.js';


const app = express();
const port = 1213;

await connectDB()

// Stripe Webhook Routes
app.use('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks);

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.get('/', (req,res) =>{res.send('Server is Live!')});
app.use('/api/user', userRouter)
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)

app.listen(port, ()=> console.log(`Server listening at http://localhost:${port}`));