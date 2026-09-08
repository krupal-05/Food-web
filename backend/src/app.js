import express from 'express'
import cors from "cors";

const app = express();

app.use(cors());



app.use(express.json());

app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
    res.send(" Backend API is Running");
});

//Routes
import userRouter from "./routers/user.router.js";
import RestaurantRouter from "./routers/Restaurant.router.js"
import varifyjwt from "./middleware/varify.middleware.js";


app.use("/api/v1", userRouter);
app.use("/api/v1",varifyjwt,RestaurantRouter)

export default app;