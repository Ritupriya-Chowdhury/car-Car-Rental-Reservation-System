import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FeaturedCarsServices } from "./featuredCars.service";

//create featured car
const createFeaturedCars = catchAsync(async (req, res) => {

    const result = await FeaturedCarsServices.createFeaturedCarsIntoDB(req.body);
    // console.log({result})

    sendResponse(res, {
      success: true,
      statusCode:201,
      message: 'Featured Car created successfully',
      data: result
    });
 
});


//Get a Car
const getAllFeaturedCar = catchAsync(async (req, res,next) => {
 
 

  const result = await FeaturedCarsServices.getAllFeaturedCarFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'A Car retrieved successfully',
    data: result,
  });

});


export const FeaturedCarsControllers = {
    createFeaturedCars,
    getAllFeaturedCar,
    
  };
