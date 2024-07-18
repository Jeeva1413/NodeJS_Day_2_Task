import { format } from "date-fns";

//creating local varibales to store the room details
const roomDetails = [
  {
    room_id: 1,
    room_no: 101,
    room_name: "Simple room",
    room_booked_dates: [],
    No_of_seats: 2,
    amenities: "A/c, car parking , TV ,Room service",
    price: "1000/hr",
  },
  {
    room_id: 2,
    room_no: 201,
    room_name: "Couple's room",
    room_booked_dates: [],
    No_of_seats: 2,
    amenities: "A/c, car parking , TV ,Room service,Bath Tub",
    price: "2000/hr",
  },
  {
    room_id: 3,
    room_no: 301,
    room_name: "Deluxe room",
    room_booked_dates: [],
    No_of_seats: 4,
    amenities: "A/c, car parking , TV ,Room service,Bath Tub",
    price: "3000/hr",
  },
  {
    room_id: 4,
    room_no: 401,
    room_name: "Double bed room",
    room_booked_dates: [],
    No_of_seats: 6,
    amenities: "A/c, car parking , TV ,Room service,Bath Tub",
    price: "4000/hr",
  },
  {
    room_id: 5,
    room_no: 501,
    room_name: "Presidential room",
    room_booked_dates: [],
    No_of_seats: 5,
    amenities:
      "A/c, car parking , TV ,Room service, Separate Room with Hall,Bath Tub,Sofa",
    price: "5000/hr",
  },
];

//Getting all avialabel room details
export const getRoomDetails = (req, res) => {
  res
    .status(200)
    .json({ message: "Availabel Room details", data: roomDetails });
};

let bookingRoom = [];
//creating new room
export const createRoom = (req, res) => {
  const { room_no, room_name, amenities, No_of_seats, price } = req.body;

  let index = roomDetails.findIndex((ele) => ele.room_no == room_no);
  if (!index) {
    return res
      .status(404)
      .json({
        message:
          "The Room number is already availabel,Try another room number to create",
      });
  }

  //creating new room from user
  let newRoom = {
    room_id: roomDetails.length + 1,
    ...req.body,
    room_booked_dates: [],
  };

  roomDetails.push(newRoom);

  res
    .status(200)
    .json({ message: "New Room created successfully", data: newRoom });
};

//booking a new room if the selected room is availabel

export const roomBooking = (req, res) => {
  const { customer_name, date, start_time, end_time, room_id } = req.body;

  //booking date from user
  let bookingDate = new Date();
  let today = format(bookingDate, "yyyy-MM-dd");

  //checking if room is availabel
  const roomIndex = roomDetails.findIndex((ele) => ele.room_id == room_id);
  if (roomIndex === -1) {
    return res
      .status(404)
      .json({
        message: "There is no room availabel with the enter room id ",
        room_id,
      });
  }

  //checking if room is availabel on particular date
  let roomDate = roomDetails[roomIndex];
  let isBooked = roomDate.room_booked_dates.some((ele) => ele === date);
  if (isBooked) {
    res
      .status(400)
      .json({
        message: `Room ${room_no} is already booked on date ${roomDate}`,
      });
  }

  if (date < today) {
    return res
      .status(400)
      .json({
        message:
          "Please check the booking date, Past dates are choosen to book",
      });
  }

  //checking if room is already booked

  let roomCheck = bookingRoom.some(
    (ele) => ele.data === roomDate && ele.room_id === room_id
  );
  if (roomCheck) {
    return res
      .status(400)
      .json({
        message: `The choosen Room number : ${room_no} is not availabel `,
      });
  }

  //creating a room book
  let bookedRoom = {
    ...req.body,
    booking_status: "Booked",
    booking_date: today,
    booking_id: bookingRoom + 1,
  };

  //adding the booked data to local varibale
  bookingRoom.push(bookedRoom);

  //updating room status
  roomDate.room_booked_dates.push(roomDate);

  res
    .status(200)
    .json({
      message: `Room ${roomDate.room_no} booked successfully`,
      data: { room_name: roomDate.room_name, ...bookedRoom },
    });
};

//list customer data who booked room
export const getCustomerRoom = (req, res) => {
  if (bookingRoom.length === 0) {
    return res
      .status(404)
      .json({ message: "There is no customer who a booked a room" });
  }

  //getting the customer details from bookingRoom array
  let customerDetails = bookingRoom.map((ele) => {
    let room = roomDetails.find((e) => e.room_id == ele.room_id);
    return {
      customer_name: ele.customer_name,
      room_name: room.room_name,
      room_no: room.room_no,
      date: ele.roomDate,
      start_time: ele.start_time,
      end_time: ele.end_time,
    };
  });
  res
    .status(200)
    .json({
      message: "List of customers who booked room",
      data: customerDetails,
    });
};

//getting all booked  room data
export const getBookedRooms = (req, res) => {
  if (bookingRoom.length === 0) {
    return res.status(200).json({ message: "There is no room booked" });
  }

  let bookedRooms = bookingRoom.map((ele) => {
    let room = roomDetails.find((e) => e.room_id === ele.room_id);
    return {
      room_name: room.room_name,
      booking_status: ele.booking_status,
      customer_name: ele.customer_name,
      date: ele.roomDate,
      start_time: ele.start_time,
      end_time: ele.end_time,
    };
  });

  res.status(200).json({ message: "List of booked rooms", data: bookedRooms });
};

//Particular customer booked room details

export const getCustomerBookedDetails = (req, res) => {
  const { customer_name } = req.params;

  let singleCustomerDetail = bookingRoom.filter(
    (ele) => ele.customer_name == customer_name
  );

  if (singleCustomerDetail.length === 0) {
    return res
      .status(404)
      .json({
        message: "There is no Rooms booked with customer name : ",
        customer_name,
      });
  }

  singleCustomerDetail = singleCustomerDetail.map((ele) => {
    let room = roomDetails.find((e) => e.room_id == ele.room_id);
    return ele;
  });

  //output
  let result = {
    customer_name: customer_name,
    booking_count: singleCustomerDetail.length,
    roomDetails: singleCustomerDetail.map((ele) => ({
      room_name: ele.room_name,
      date: ele.roomDate,
      start_time: ele.start_time,
      end_time: ele.end_time,
      booking_id: ele.booking_id,
      booking_status: ele.booking_status,
      booking_date: ele.bookingDate,
    })),
  };

  res.status(200).json({ message: "List of Customer ",data: result});
};
