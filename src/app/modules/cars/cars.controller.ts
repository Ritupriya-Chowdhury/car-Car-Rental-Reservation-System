import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CarsServices } from "./cars.service";

//create car
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


//Get a Car
const getSingleCar = catchAsync(async (req, res,next) => {
 
  const { id } = req.params;

  const result = await CarsServices.getSingleCarFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'A Car retrieved successfully',
    data: result,
  });

});



// Get All Cars 
const getAllCars = catchAsync(async (req, res,next) => {
 
    const result = await CarsServices.getAllCarsFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cars retrieved successfully',
      data: result,
    });
 
});


// Update Car
const updateCar = catchAsync(async (req, res) => {
 
    const { id } = req.params;
    const result = await CarsServices.updateCarIntoDB(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Car updated successfully',
      data: result,
    });
 
});


const deleteCar = catchAsync(async (req, res,next) => {
  const {id}  = req.params;

  // console.log(id);

  const result = await CarsServices.deleteCarFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car Deleted successfully',
    data: result,
  });
});

export const CarsControllers = {
  createCars,
  getSingleCar,
  getAllCars,
  updateCar,
  deleteCar
};


