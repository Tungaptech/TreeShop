const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Tree Schema
const treeSchema = new mongoose.Schema({
    treename: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }
});

const Tree = mongoose.model('Tree', treeSchema);

// Routes
app.get('/', (req, res) => {
    res.redirect('/trees');
});

app.get('/trees', async (req, res) => {
    const trees = await Tree.find();
    res.render('trees', { trees });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.post('/add-tree', async (req, res) => {
    const { treename, description, image } = req.body;
    if (!treename || !description) {
        return res.status(400).send('Tree name and description are required.');
    }
    
    const newTree = new Tree({ treename, description, image });
    await newTree.save();
    res.redirect('/trees');
});

app.post('/reset', async (req, res) => {
    await Tree.deleteMany({});
    res.redirect('/trees');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
