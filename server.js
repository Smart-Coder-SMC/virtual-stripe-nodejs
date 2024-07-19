require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/create-payment-link', async (req, res) => {
    try {
        // Create a product
        const stripeProduct = await stripe.products.create({
            name: 'apple watch',
        });

        // Create a price for the product
        const price = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: 35 * 100, // Stripe expects the amount in the smallest currency unit
            currency: 'usd',
        });

        // Create a payment link using the price ID
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
        });

        res.json({ link: paymentLink.url });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
