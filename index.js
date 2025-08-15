const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dboperations = require('./dboperations');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/products', async (req, res) => {
    try {
        const products = await dboperations.getProducts();
        if (!products) {
            return res.status(404).send('No products found');
        }
        if (!products || products.length === 0) {
            return res.status(404).send('No products found');
        }   
        res.json(products);
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});