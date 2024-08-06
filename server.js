require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to create a Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'apple watch',
                    },
                    unit_amount: 3500, // $35.00
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:${PORT}/success`,
            cancel_url: `http://localhost:${PORT}/cancel`,
        });

        res.redirect(303, session.url);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Success page
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Cancel page
app.get('/cancel', (req, res) => {
    res.send('Payment canceled.');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
