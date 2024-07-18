import express from "express";
import { createRoom, getBookedRooms, getCustomerBookedDetails, getCustomerRoom, getRoomDetails, roomBooking } from "../Controllers/RoomManagement.js";

//getting router from express router
const router = express.Router();

//Routing paths

router.get("/getRoom", getRoomDetails);

router.post("/createRoom", createRoom);

router.post('/bookRoom',roomBooking);

router.get('/getBookedRooms',getBookedRooms)

router.get('/getCustomerRoom',getCustomerRoom);

router.get('/getCustomerBookedDetails/:customer_name',getCustomerBookedDetails);

//exporting
export default router;
