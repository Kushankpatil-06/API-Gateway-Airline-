const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit')



const app = express();
const PORT = 3005;
const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	// standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	// legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

app.use(morgan('combined'));
app.use(limiter);
app.use('/bookingservice',createProxyMiddleware({target:'http://localhost:3000/bookingservice',changeOrigin:true}));
app.get('/home',(req,res)=>{
    return res.json({message:"OK"});
})


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})