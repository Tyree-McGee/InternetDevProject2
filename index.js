const express = require('express');
const app  = express();

const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

const url = 'mongodb+srv://dbUser:Password@cluster0.jr25d.mongodb.net/projectDatabase?retryWrites=true&w=majority';

app.use(express.json());

const ItemModel = require('./items');
const CustomerModel = require('./customer');
const CartModel = require('./carts');

const router = express.Router();

const PASSWORD = 'abc';

const initDatabase = async () => {

    const database = await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

    if (database) {
        app.use(session({
            secret: 'JordanIsWayBetterThanLeBron',
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));
        app.use(router);
        console.log('Successful connection to database');
    } else {
        console.log('Error connecting to DB');
    }
}

const init = async() => {
    app.listen(8080);
    await initDatabase();
    //await populateDB();
    //const j = await CustomerModel.find({firstName: 'Snoop'}).populate('carts');
    //console.log(j);
}

const populateDB = async () => {
    await CustomerModel.deleteMany({});
    await CartModel.deleteMany({});
    await ItemModel.deleteMany({});
    await initItems();
    await initCustomers();
}

const initCustomers = async () => {
    const customers = [];
    customers[0] = ['Snoop', 'Dogg', 'SN@GinandJuice.com'];
    customers[1] = ['Ice', 'Cube', 'IC@WC.com'];
    customers[2] = ['Will','Smith', 'WS@MIBII' ];
    customers[3] = ['Tupac','Shacur', '2pac@HailMary.com'];
    customers[4] = ['Tom', 'Brady', 'TB12@GreatestEver.com'];
    customers[5] = ['Biggie', 'Smalls', 'BIG@BigPoppa.com'];
    customers[6] = ['Michael', 'Jordan', 'MJ@LeBronStillSucks.com'];
    customers[7] = ['John', 'Cena', 'FU@UCantSeeMe.com'];


    for(let i = 0; i < customers.length; i++) {
        const customer = {
            firstName: customers[i][0],
            lastName: customers[i][1],
            email: customers[i][2]
        }
        const addedCustomer = await createCustomer(customer);
        if( i == 0){
            const itemAdd = await ItemModel.findOne({name: 'Cell Phone'});
            const cart = await CartModel.findOne({customer: addedCustomer._id});
            await cart.update({'$push': {items: itemAdd._id}});
            const itemAdd1 = await ItemModel.findOne({name: 'Madden 21'});
            await cart.update({'$push': {items: itemAdd1._id}})
        }
        if( i == 2){
            const itemAdd1 = await ItemModel.findOne({name: 'Graphic Cards'});
            const itemAdd2 = await ItemModel.findOne({name: 'Laptop'});
            const itemAdd3 = await ItemModel.findOne({name: 'Car'});
            const itemAdd4 = await ItemModel.findOne({name: 'Shoes'});
            const cart = await CartModel.findOne({customer: addedCustomer._id});
            await cart.update({'$push': {items: itemAdd1._id}});
            await cart.update({'$push': {items: itemAdd2._id}});
            await cart.update({'$push': {items: itemAdd3._id}});
            await cart.update({'$push': {items: itemAdd4._id}});


        }
        if(i == 3){
            const cart = await CartModel.findOne({customer: addedCustomer._id});
            const itemAdd2 = await ItemModel.findOne({name: 'Laptop'});
            await cart.update({'$push': {items: itemAdd2._id}});
        }

        if(i == 4){
            const cart = await CartModel.findOne({customer: addedCustomer._id});
            const itemAdd2 = await ItemModel.findOne({name: 'Laptop'});
            await cart.update({'$push': {items: itemAdd2._id}});
        }
        if (i == 5) {
            const cart = await CartModel.findOne({customer: addedCustomer._id});
            const itemAdd2 = await ItemModel.findOne({name: 'Mask'});
            await cart.update({'$push': {items: itemAdd2._id}});
            const itemAdd3 = await ItemModel.findOne({name: 'Madden 21'});
            await cart.update({'$push': {items: itemAdd3._id}});


        }
        if(i == 6){
            const cart = await CartModel.findOne({customer: addedCustomer._id});
            const itemAdd2 = await ItemModel.findOne({name: 'Graphic Cards'});
            await cart.update({'$push': {items: itemAdd2._id}});
        }
    }
}

const createCart = async (newCustomer) => {
    const newCart = {
        customer: newCustomer._id
    }
    const sentCart = await CartModel.create(newCart);
    return sentCart;
}

const createCustomer = async (customer) => {
    const newCustomer = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        password: PASSWORD
    }
    const newAdded = await CustomerModel.create(newCustomer);
    const newCart = await createCart(newAdded);
    await newAdded.update({$push: {carts: newCart._id}});
    return newAdded;

}

const initItems = async () => {
    const items = []
    items[0] = ['Cell Phone', 'An Iphone', 1999.99];
    items[1] = ['Laptop', 'A MacBook', 2999.99];
    items[2] = ['Video Game Console', 'A PS5', 299.99];
    items[3] = ['Graphic Cards', 'RTX3090', 1999.99];
    items[4] = ['Car', 'Tesla Model Y', 80000.00];
    items[5] = ['Mask', 'A face mask', 2.99];
    items[6] = ['Shoes', 'Air Jordans', 250];
    items[7] = ['Madden 21', 'A terrible video game', 1.99];



    for(let i = 0; i < items.length; i++){
        const newItem = {
            name: items[i][0],
            description: items[i][1],
            price: items[i][2]
        }
        await ItemModel.create(newItem);
    }
}
// Get user
router.get('/user/:id', async (req, res) => { //make async
    const foundCustomer = await CustomerModel.findById(req.params.id).lean()
       res.send(foundCustomer ? foundCustomer : 404)
});
// Create User
router.post('/user', async(req,res) => {
    const newCustomer = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    }
    const customerAdded = await createCustomer(newCustomer);
    res.send(customerAdded);
});
//Get Cart
router.get('/user/:id/cart', async (req, res) => {
   try{
       const cart = await CartModel.findOne({customer: req.params.id}).populate('items customer').lean();
        res.send(cart);
       }
    catch
    {res.send(404);}
});
//Empty Cart
router.delete('/user/:id/cart', async (req,res) =>{
        const myId = req.params.id;
        const foundCart = CartModel.findOne({customer: ObjectId(myId)});
        res.send(foundCart ? foundCart : 404)

});
// Delete Item From Cart
router.delete('/cart/:cartId/cartItem/:cartItemId', async (req,res) =>{
    try{
        const cart = await CartModel.findById(req.params.cartId);
        const item = await ItemModel.findById(req.params.cartItemId);
        const itemDelete = await cart.items.remove({_id: req.params.cartItemId});
        res.send(cart);
    }
    catch
    {res.send(404);}

});
// Add item with quantity
app.post('/cart/:cartId/cartItem', async (req,res) =>{
    const foundCart = await CartModel.findById(req.params.cartId);
    const quantity = req.body.quantity;
    const itemId = req.body.itemId;
    const itemToAdd = await ItemModel.findById(itemId);

    for(let i = 0; i < quantity; i++){

        await foundCart.update({$push: {items: itemToAdd._id}});
    }
    const newfoundCart = await CartModel.findById(req.params.cartId);
    res.send(newfoundCart ? newfoundCart : 404);
});

router.get('/StoreItem/Recent', async (req, res) =>{
    const query = req.param("num");
    let itemArray = [];
    if(req.session.viewedItems != null) {
        for (let i = 0; i < req.session.viewedItems.length && i < query; i++) {
            const foundItem = await ItemModel.findById(req.session.viewedItems[i]);
            itemArray.push((foundItem));
        }
    }

    res.send(itemArray ? itemArray: 404);

});
// Retrieve Store Item Information
router.get('/StoreItem/:StoreItemID', async (req, res) =>{
    const foundItem = await ItemModel.findById(req.params.StoreItemID).lean();
    if (req.session.viewedItems == null || req.session.viewedItems.length <= 10) {
        if(req.session.viewedItems == null){
            req.session.viewedItems = [];
        }
        req.session.viewedItems.push(req.params.StoreItemID);
    }
    else{
        req.session.viewedItems.shift();
        req.session.viewedItems.push(req.params.StoreItemID);
    }
    res.send(foundItem ? foundItem: 404);
});



router.get('/StoreItem', async (req, res) =>{
    const searchedItem = req.param("query");
    const foundItem = await ItemModel.find({'name' : searchedItem}).lean();
    res.send(foundItem ? foundItem: 404);

});

init();
