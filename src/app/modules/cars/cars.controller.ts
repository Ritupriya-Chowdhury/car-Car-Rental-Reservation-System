import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CarsServices } from "./cars.service";

//create room
const createCars = catchAsync(async (req, res) => {

    const result = await CarsServices.createCarsIntoDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode:201,
      message: 'Car created successfully',
      data: result
      ,
    });
 
});


export const CarsControllers = {
    createCars,
    // getSingleMeetingRoom,
    // getAllMeetingRooms,
    // updateMeetingRoom,
    // deleteMeetingRoom
  };