require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const userModel = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const Order = require('./models/order');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const xml2js = require('xml2js');
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const casConfig = {
    cas_url: 'https://login.iiit.ac.in/cas',
    service_url: 'http://localhost:3001', // Replace with your domain
    cas_version: '3.0',
  };
const genAI = new GoogleGenerativeAI("AIzaSyCcaHCbkJ7o9ziZHcELVznbj0xpsqgM9pQ");

const RECAPTCHA_SECRET = "6LdZfMoqAAAAAG8CP-wALzp9BERM2GxMWCj-vuR1";
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL, 
    methods: ['GET', 'POST'],
    credentials: true }));
    
app.use(cookieParser());


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
  
        // console.log('Cookies received:', req.cookies);
        // console.log('Token:', req.cookies.token);
        
    
    if(!token){
        return res.status(401).json({message:"Token Access Denied"});
    }
    else{
        jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.status(401).json({message:"Token wrong"});
            }
            else{
                
                req.user = decoded; 
                next();
            }
        })
    }

}
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.post('/signup', (req, res) => {
    console.log(req.body);
    userModel.findOne({ email: req.body.email })
        .then(existingUser => {
            if (existingUser) {
                return res.json({ message: 'Email already exists' });
            }

            bcrypt.hash(req.body.password, 10)
                .then(hashedPassword => {
                    userModel.create({ ...req.body, password: hashedPassword })
                        .then(user => res.json({ message: 'Signup successful', user }))
                        .catch(err => res.json({ message: 'Error creating user', error: err }));
                })
                .catch(err => res.status(500).json({ message: 'Error hashing password', error: err }));
        })
        .catch(err => res.status(500).json({ message: 'Error checking existing user', error: err }));
});

app.post("/login", async (req, res) => {
    console.log(req.body);
    const { username, password, recaptchaToken } = req.body;

    
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`;

    try {
        const recaptchaResponse = await axios.post(recaptchaVerifyUrl);
        if (!recaptchaResponse.data.success) {
            return res.status(400).json({ message: "reCAPTCHA validation failed." });
        }

        
        const user = await userModel.findOne({ email: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        
        const token = jwt.sign(
            { email: username, seller_id: user._id, firstname: user.firstName, lastname: user.lastName },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

       
        res.cookie("token", token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Important for HTTPS in production
            sameSite: 'none', // Recommended for security
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });
        return res.json({ message: "Login successful" });

    } catch (error) {
        console.error("reCAPTCHA validation error:", error);
        return res.status(500).json({ message: "Error verifying reCAPTCHA." });
    }
});
app.get("/cas/login", (req, res) => {
    const loginUrl = `${casConfig.cas_url}/login?service=${encodeURIComponent(
        casConfig.service_url + "/cas/callback"
      )}`;
      res.status(200).json({ success: true, message: "Redirecting to CAS login", loginUrl });
  });
const validateCasTicket = async (ticket) => {
    try {
      const validateUrl = `${casConfig.cas_url}/p3/serviceValidate?service=${encodeURIComponent(casConfig.service_url + "/cas/callback")}&ticket=${ticket}`;
      const response = await axios.get(validateUrl);
  
      return new Promise((resolve, reject) => {
        xml2js.parseString(response.data, (err, result) => {
          if (err) reject(err);
  
          const serviceResponse = result["cas:serviceResponse"];
          if (serviceResponse["cas:authenticationSuccess"]) {
            const success = serviceResponse["cas:authenticationSuccess"][0];
            const user = {
              email: success["cas:user"][0],
              attributes: success["cas:attributes"]
                ? success["cas:attributes"][0]
                : {},
            };
            resolve(user);
          } else {
            reject(new Error("CAS Authentication failed"));
          }
        });
      });
    } catch (err) {
      throw new Error(`CAS Validation failed: ${err.message}`);
    }
  };
  app.get("/cas/callback", async (req, res) => {
    console.log("CAS callback reached in backend");
    try {
      const { ticket } = req.query;
      if (!ticket) {
        return res.redirect('/login');
      }
      const userData = await validateCasTicket(ticket);
      console.log("User data:", userData);
        if(userData){
        console.log("user is validated");
        const user = await userModel.findOne({ email: userData.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        
        const token = jwt.sign(
            { email: user.email, seller_id: user._id, firstname: user.firstName, lastname: user.lastName },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

       
        res.cookie("token", token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
          });
        
        return res.redirect(`http://localhost:5173/home`);

      }
      else{
        console.log("user is not validated");
        res.redirect(" http://localhost:5173/login");
      }
    } catch (error) {
      console.error('CAS authentication error:', error);
      res.redirect(" http://localhost:5173/login");
    }
  });
  



///////////////////Basic Routes////////////////////////

app.get('/sell', verifyToken, async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Token Access Denied" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token wrong" });
        } else {
            const seller_id = decoded.seller_id;
            try {
                const user = await userModel.findById(seller_id);
                if (!user) {
                    return res.status(404).json({ message: "Seller not found" });
                }
                res.json({ message: 'Login successful', seller_id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName });
            } catch (error) {
                console.error('Error fetching seller data:', error);
                res.status(500).json({ message: 'Error fetching seller data' });
            }
        }
    });
});
app.get('/check-auth', verifyToken, (req, res) => {
    return res.json({ message: 'Login successful' });
    
});
app.get('/home', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.seller_id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Error fetching user data' });
    }
});
app.get('/user', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.seller_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user.firstName);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Error fetching user data' });
    }
});
app.post('/home', verifyToken, async (req, res) => {
    try {
        console.log(req.body);
        const user = await userModel.findByIdAndUpdate(req.user.seller_id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: 'Error updating user profile' });
    }
});
app.post('/change-password', verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    console.log(req.body);
    try {
        const user = await userModel.findById(req.user.seller_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Error updating password' });
    }
});
app.get('/buy',verifyToken, (req, res) => {
    return res.json({ message: 'Login successful' });
    
});


app.get('/buy/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId).populate('seller_id', 'firstName lastName email');
        console.log(product);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ success: false, message: 'Error fetching product details' });
    }
});

///////////////////////////// PRODUCT API ///////////////////////////////

app.get('/product/list',verifyToken, async(req, res) => {
    try{
        const allproducts = await Product.find({});
        res.json({message:"All Products",allproducts});
    }
    catch(e){
        console.log(e);
        res.json({ message: 'Error fetching products' });
    }
});
app.post('/product/remove',verifyToken, async(req, res) => {
    try{
        const id = req.body.id;
        const removedProduct = await Product.findByIdAndRemove(id);
        res.json({message:"Product Removed",removedProduct});
    }
    catch(e){
        console.log(e);
        res.json({ message: 'Error removing product' });
    }
});

const imageStorage = multer.diskStorage({
    
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const imageUpload = multer({ storage: imageStorage });


app.post('/product/add',imageUpload.single('img'),async (req, res) => {
   try {
            
    const { ProductName, ProductDesc, ProductPrice ,ProductCategory,SellerID} = req.body;
    
    console.log(ProductName, ProductDesc, ProductPrice ,ProductCategory)

    const image = req.file;
   
    const result = await cloudinary.uploader.upload(image.path, { resource_type: "image" });
    const imgURL = result.secure_url;
    const newProduct = new Product({
       name: ProductName,
       description:ProductDesc,
        price: parseInt(ProductPrice),
        category: ProductCategory,
        image:imgURL,
        seller_id:SellerID
    });

    await newProduct.save();
   
    res.json({ message: 'Product Added' });
   }
   catch(e){
    console.log(e);
    res.json({ message: 'Error submitting form data' });
   }
});


///////////////////////////// CART API /////////////////////////////// 
app.get('/cart',verifyToken, async (req, res) => {
    const userId = req.user.seller_id;

    try {
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        console.log(cart);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

app.post('/cart/add', verifyToken, async (req, res) => {
    const {productId} = req.body;
    const userId = req.user.seller_id;
    console.log(productId);
    console.log(userId);

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user is trying to buy their own product
        console.log("-----------------------");
        console.log(product.seller_id.toString(), userId.toString());
        if (product.seller_id.toString() === userId.toString()) {
            return res.status(400).json({ message: 'Sellers cannot buy their own products' });
        }
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // If cart exists, update the quantity of the product
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
                if(productIndex !== -1){
                    res.json({ message: 'Product already exists' });
                    return;
                }
                else{
                cart.products.push({ productId});
                }
            
        } else {
            // If cart does not exist, create a new cart
            cart = new Cart({
                userId,
                products: [{ productId}]
            });
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        console.error('Error in adding product to cart:', error);
        res.status(500).json({ message: 'Error in adding product to cart' });
    }
});

app.post('/cart/remove', verifyToken, async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.seller_id;

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Remove the product from the cart
            cart.products = cart.products.filter(p => p.productId.toString() !== productId);

            await cart.save();
            res.status(200).json({ message: 'Product removed from cart', cart });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Error removing product from cart' });
    }
});

///////////////////////////// ORDER API ///////////////////////////////
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
app.get('/orders/pending', verifyToken, async (req, res) => {
    const userId = req.user.seller_id;

    try {
        const pendingOrders = await Order.find({ buyerID: userId, status: 'Pending' })
            .populate('sellerID') 
            .populate('productID', 'name image')
            .sort({ date: -1 }); 
        console.log(pendingOrders);
        res.status(200).json({ orders: pendingOrders });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ message: 'Error fetching pending orders' });
    }
});
app.get('/orders/completed', verifyToken, async (req, res) => {
    const userId = req.user.seller_id;

    try {
        const pendingOrders = await Order.find({ buyerID: userId, status: 'Completed' })
            .populate('sellerID') 
            .populate('productID', 'name image')
            .sort({ dateCompleted: -1 }); 
        console.log(pendingOrders);
        res.status(200).json({ orders: pendingOrders });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ message: 'Error fetching pending orders' });
    }
});
app.post('/order/place', verifyToken, async (req, res) => {
    try {
        const { products } = req.body;
        const buyerId = req.user.seller_id;

        const orders = [];
        for (const product of products) {
            const { productId, amount, sellerID } = product;
            const order = new Order({
                transactionID: Math.random().toString(36).substr(2, 9),
                buyerID: buyerId,
                sellerID: sellerID,
                productID: productId,
                amount,
                hashedOTP: generateOTP()
            });
            await order.save();
            orders.push(order);

            // Remove the product from the cart
            let cart = await Cart.findOne({ userId: buyerId });
            if (cart) {
                cart.products = cart.products.filter(p => p.productId.toString() !== productId);
                await cart.save();
            }
        }

        res.status(200).json({ message: 'Orders placed successfully', orders });
    } catch (error) {
        console.error('Error placing orders:', error);
        res.status(500).json({ message: 'Error placing orders' });
    }
});

app.post('/order/generate-otp', verifyToken, async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a random 4-digit OTP
        const saltRounds = 10;
        const hashedOtp = await bcrypt.hash(otp, saltRounds); // Hash the OTP with bcrypt

        order.hashedOTP = hashedOtp;
        await order.save();

        res.status(200).json({ message: 'OTP generated', otp: otp });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ message: 'Error generating OTP' });
    }
});
// Endpoint to verify OTP
app.post('/order/verify-otp', verifyToken, async (req, res) => {
    const { orderId, otp } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const isMatch = await bcrypt.compare(otp, order.hashedOTP);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        order.status = 'Completed';
        order.dateCompleted = new Date();
        await order.save();

        res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
});

//////////////////////Seller API////////////////////////
app.get('/sell/pending', verifyToken, async (req, res) => {
    const userId = req.user.seller_id;

    try {
        const pendingOrders = await Order.find({ sellerID: userId, status: 'Pending' })
            .populate('buyerID', 'firstName lastName email') // Populate buyerID with the buyer's details
            .populate('productID', 'name image')
            .sort({ date: -1 });
        console.log(pendingOrders);
        res.status(200).json({ orders: pendingOrders });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ message: 'Error fetching pending orders' });
    }
});
app.get('/sell/completed', verifyToken, async (req, res) => {
    const userId = req.user.seller_id;

    try {
        const pendingOrders = await Order.find({ sellerID: userId, status: 'Completed' })
            .populate('buyerID', 'firstName lastName email') // Populate buyerID with the buyer's details
            .populate('productID', 'name image')
            .sort({ dateCompleted: -1 }); 
        console.log(pendingOrders);
        res.status(200).json({ orders: pendingOrders });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ message: 'Error fetching pending orders' });
    }
});

///////////////////////////// CHAT API ///////////////////////////////
// Endpoint to fetch chat messages
app.post('/chat/messages', verifyToken, async (req, res) => {
    const { transactionID } = req.body;

    try {
        const chat = await Order.findOne({ transactionID:transactionID }).populate('messages.sender', 'firstName lastName');
        console.log("Hi",chat,transactionID);
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        res.status(200).json({ success: true, messages: chat.messages });
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ success: false, message: 'Error fetching chat messages' });
    }
});

// Endpoint to send a chat message
app.post('/chat/send', verifyToken, async (req, res) => {
    const { transactionID, message } = req.body;
    const senderId = req.user.seller_id; // Assuming you have the sender's ID in the token
    console.log(transactionID, message, senderId);
    try {
        let chat = await Order.findOne({ transactionID });
        if(!chat){
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        chat.messages.push({ sender: senderId, message });
        await chat.save();
        const populatedOrder = await Order.findOne({ transactionID }).populate('messages.sender', 'firstName lastName');

        res.status(200).json({ success: true, message: 'Message sent', sender: populatedOrder.messages.slice(-1)[0].sender });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
});

///////////////////////////// CHATBOT API ///////////////////////////////
const chatSessions = new Map();

app.post('/chat', async (req, res) => {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
        return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    try {
        
        let session = chatSessions.get(sessionId);
        if (!session) {
            session = { history: [] };
            chatSessions.set(sessionId, session);
        }
        session.history.push({ role: 'user', parts: [{ text: message }] });

        const structuredPrompt = `
            You are the chatbot for IIIT MART, an online marketplace for students to buy and sell items within IIIT.The Website has Home(User Profile), Buy , My Orders ,Sell, and Cart Pages. You assist buyers and sellers with navigation, searching items, adding to cart, and My Orders.On buy page,buyers can see the products by all users and apply search and filters. Sellers can go to the Sell Page and add new products,view pending orders and history. On Buyer's My Orders Pending page generate OTP button is there. Buyer needs to provide the seller a OTP to complete the order and seller needs to put the OTP on his pending orders page to verify. If the user asks anything completely unrelated to IIITMART again and again, politely redirect them.Keep answers Concise

            User Query: "${message}"
            `;

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const chat = model.startChat({
            history: [{ role: 'user', parts: [{ text: structuredPrompt }] }], // Ensure the first role is 'user'
        });

        const result = await chat.sendMessage(structuredPrompt);
        const responseText = await result.response.text();
        session.history.push({ role: 'model', parts: [{ text: responseText }] });
        chatSessions.set(sessionId, session);
        res.json({ message: responseText });
    } catch (error) {
        console.error('Error processing chat message:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
});
//////////////////////////SELLER DASHBOARD API////////////////////////
app.get('/api/metrics', verifyToken, async (req, res) => {
    try {
        const sellerId = req.user.seller_id;
        console.log(sellerId);
        
        // Fetch total orders
        const totalOrders = await Order.countDocuments({ sellerID: sellerId });

        // Fetch total revenue
        const totalRevenueResult = await Order.aggregate([
            { $match: { sellerID: new mongoose.Types.ObjectId(sellerId), status: 'Completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        // Fetch average order value
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Fetch active customers
        const activeCustomers = await Order.distinct('buyerID', { sellerID: new mongoose.Types.ObjectId(sellerId) });

        res.json({
            totalOrders,
            totalRevenue,
            averageOrderValue,
            activeCustomers: activeCustomers.length
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ message: 'Error fetching metrics' });
    }
});
// Endpoint to get monthly revenue
app.get('/api/monthly-revenue', verifyToken, async (req, res) => {
    try {
        const sellerId = req.user.seller_id;

        const monthlyRevenue = await Order.aggregate([
            { $match: { sellerID: new mongoose.Types.ObjectId(sellerId), status: 'Completed' } },
            {
                $group: {
                    _id: { month: { $month: '$dateCompleted' }, year: { $year: '$dateCompleted' } },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.json(monthlyRevenue);
    } catch (error) {
        console.error('Error fetching monthly revenue:', error);
        res.status(500).json({ message: 'Error fetching monthly revenue' });
    }
});

// Endpoint to get order status
app.get('/api/order-status', verifyToken, async (req, res) => {
    try {
        const sellerId = req.user.seller_id;

        const orderStatus = await Order.aggregate([
            { $match: { sellerID: new mongoose.Types.ObjectId(sellerId) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(orderStatus);
    } catch (error) {
        console.error('Error fetching order status:', error);
        res.status(500).json({ message: 'Error fetching order status' });
    }
});
// Endpoint to get all products sold by the seller
app.get('/api/seller-products', verifyToken, async (req, res) => {
    try {
        const sellerId = req.user.seller_id;

        const products = await Product.find({ seller_id: sellerId });

        res.json(products);
    } catch (error) {
        console.error('Error fetching seller products:', error);
        res.status(500).json({ message: 'Error fetching seller products' });
    }
});

// Endpoint to update product price
app.post('/api/update-product-price', verifyToken, async (req, res) => {
    try {
        const { productId, newPrice } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(productId, { price: newPrice }, { new: true });

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product price:', error);
        res.status(500).json({ message: 'Error updating product price' });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    const casLogoutUrl = `${casConfig.cas_url}/logout?service=${casConfig.service_url}`;
    res.json({ message: 'Logout successful', casLogoutUrl });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("Server has started");
});
