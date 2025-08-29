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
        if (!products || products.length === 0) {
            return res.status(404).send('No products found');
        }
        res.json(products);
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await dboperations.getUsers();
        if (!users || users.length === 0) {
            return res.status(404).send('No User found');
        }
        res.json(users);
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});

app.post('/api/createUsers', async (req, res) => {
    try {
        const users = await dboperations.createUsers(req.body);
        if (!users || users.length === 0) {
            return res.status(404).send('No User found');
        }
        res.json(users.affectedRows > 0 ? { message: 'User created successfully' } : { message: 'User creation failed' });
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});

app.post('/api/user/login', async (req, res) => {
    try {
        const users = await dboperations.usersLogin(req.body);
        if (!users || users.length === 0) {
            return res.status(404).send('No User found');
        }
        res.json(users);
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});

app.post('/api/user/profile', async (req, res) => {
    try {
        const userProfile = await dboperations.getUserProfile(req.body);
        if (!userProfile || userProfile.length === 0) {
            return res.status(404).send('No User found');
        }
        res.json(userProfile);
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});
app.post("/api/andriod/data",async (req,res)=>{
    try {
        const token = req.headers.authorization.replace("Bearer ","");
        const autoriseUser = await dboperations.getUserAuthStatus(token);
        if(autoriseUser.status){
            const unitData = req.body;
            unitData.userId = autoriseUser.id;
            const saveUnitData = await dboperations.saveUnitdata(unitData);
            res.json(saveUnitData);
        }else{
            res.status(500).send('Invalid user');
        }
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});