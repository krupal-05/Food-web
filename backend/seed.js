import dotenv from 'dotenv';
dotenv.config();
import dbConnection from './src/config/db.js';
import User from './src/models/User.model.js';
import Restaurant from './src/models/Restaurant.model.js';
import Food from './src/models/food.model.js';

async function seed() {
  await dbConnection();
  const users = await User.find().select('firstName lastName email role');
  console.log('USERS IN DB:', users.length);

  const count = await Food.countDocuments();
  console.log('CURRENT FOOD COUNT:', count);

  if (count === 0) {
    const restaurants = await Restaurant.find();
    console.log('RESTAURANTS FOUND:', restaurants.length);

    const initialFoods = [
      // Pizza Palace
      {
        name: "Artisan Margherita Pizza",
        description: "San Marzano tomato coulis, fresh buffalo mozzarella, fresh basil, extra virgin olive oil.",
        price: 349,
        category: "Pizza",
        foodType: "veg",
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Pizza"))?._id || restaurants[0]._id
      },
      {
        name: "Truffle Pepperoni Feast",
        description: "Slow-cured spicy pepperoni, smoked provolone, hot honey drizzle, crushed red peppers.",
        price: 499,
        category: "Pizza",
        foodType: "non-veg",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Pizza"))?._id || restaurants[0]._id
      },
      {
        name: "Wild Mushroom & Four Cheese",
        description: "Portobello, shiitake, roasted garlic crema, fontina, gorgonzola and thyme.",
        price: 429,
        category: "Pizza",
        foodType: "veg",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Pizza"))?._id || restaurants[0]._id
      },
      // Burger Beast
      {
        name: "Double Smashed Wagyu Burger",
        description: "Two seared beef patties, melted sharp cheddar, caramelized shallots, house secret burger sauce.",
        price: 399,
        category: "Burger",
        foodType: "non-veg",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Burger"))?._id || restaurants[0]._id
      },
      {
        name: "Crispy Korean BBQ Chicken Burger",
        description: "Buttermilk fried chicken breast tossed in gochujang glaze with pickled radish slaw.",
        price: 329,
        category: "Burger",
        foodType: "non-veg",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Burger"))?._id || restaurants[0]._id
      },
      {
        name: "Portobello & Truffle Veggie Burger",
        description: "Char-grilled portobello mushroom, smoked provolone, baby arugula, truffle aioli.",
        price: 289,
        category: "Burger",
        foodType: "veg",
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Burger"))?._id || restaurants[0]._id
      },
      // Spice Garden
      {
        name: "Royal Dum Handi Biryani",
        description: "Aromatic aged long-grain basmati rice layered with spiced tender lamb, saffron, and mint.",
        price: 449,
        category: "Indian",
        foodType: "non-veg",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Spice"))?._id || restaurants[0]._id
      },
      {
        name: "Paneer Tikka Butter Masala",
        description: "Clay oven roasted cottage cheese cubes simmered in a velvety tomato and cashew butter gravy.",
        price: 339,
        category: "Indian",
        foodType: "veg",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Spice"))?._id || restaurants[0]._id
      },
      {
        name: "Slow Cooked Dal Makhani",
        description: "Black lentils simmered overnight with butter, rich cream, and delicate whole spices.",
        price: 279,
        category: "Indian",
        foodType: "veg",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Spice"))?._id || restaurants[0]._id
      },
      // Dragon Wok
      {
        name: "Szechuan Chili Garlic Noodles",
        description: "Wok-tossed hand-pulled noodles with crispy chili oil, crunchy scallions, and toasted sesame.",
        price: 269,
        category: "Chinese",
        foodType: "veg",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Dragon"))?._id || restaurants[0]._id
      },
      {
        name: "Crispy Kung Pao Chicken",
        description: "Tender chicken cubes with dried red chilies, crunchy peanuts, and tangy ginger-soy reduction.",
        price: 349,
        category: "Chinese",
        foodType: "non-veg",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Dragon"))?._id || restaurants[0]._id
      },
      {
        name: "Steamed Crystal Dim Sum Basket",
        description: "Six delicate translucent dumplings stuffed with fresh water chestnuts, shiitake, and chives.",
        price: 299,
        category: "Chinese",
        foodType: "vegan",
        image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Dragon"))?._id || restaurants[0]._id
      },
      // Sweet Bites Café
      {
        name: "Molten Belgian Chocolate Lava",
        description: "Warm dark Belgian chocolate cake with a rich molten center, served with Madagascan vanilla dust.",
        price: 249,
        category: "Desserts",
        foodType: "veg",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Sweet"))?._id || restaurants[0]._id
      },
      {
        name: "Classic New York Cheesecake",
        description: "Velvety smooth cream cheese filling on a buttery graham cracker crust with berry coulis.",
        price: 269,
        category: "Desserts",
        foodType: "veg",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Sweet"))?._id || restaurants[0]._id
      },
      {
        name: "Caramel Macchiato Iced Brew",
        description: "Double shot espresso with silky whole milk, Madagascar vanilla syrup, and rich buttery caramel drizzle.",
        price: 199,
        category: "Beverages",
        foodType: "veg",
        image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800",
        isAvailable: true,
        restaurant: restaurants.find(r => r.name.includes("Sweet"))?._id || restaurants[0]._id
      }
    ];

    await Food.insertMany(initialFoods);
    console.log('SUCCESSFULLY INSERTED REAL FOOD ITEMS INTO MONGO DATABASE!');
  }

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
