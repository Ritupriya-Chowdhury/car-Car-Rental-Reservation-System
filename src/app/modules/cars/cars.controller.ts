import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CarsServices } from "./cars.service";
import AppError from "../../errors/AppError";

//create car
const createCars = catchAsync(async (req, res) => {

    const result = await CarsServices.createCarsIntoDB(req.body);
    // console.log({result})

    sendResponse(res, {
      success: true,
      statusCode:201,
      message: 'Car created successfully',
      data: result,
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
const getAllCars = catchAsync(async (req, res) => {
  const filters = {
    name: req.query.name as string, // Cast to string if necessary
    type: req.query.type as string,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    
    features: typeof req.query.features === 'string' ? req.query.features.split(',') : [], 
    isElectric: req.query.isElectric === 'true',
    location: req.query.location as string,
    startDate: req.query.startDate as string, 
    endDate: req.query.endDate as string,     
  };

  const result = await CarsServices.getAllCarsFromDB(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cars retrieved successfully",
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



  const result = await CarsServices.deleteCarFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car Deleted successfully',
    data: result,
  });
});

const checkCarAvailability = catchAsync(async (req, res) => {
  const { location, startDate, endDate } = req.query;

  if (!location || !startDate || !endDate) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Location, startDate, and endDate are required');
  }

  const result = await CarsServices.checkCarAvailability(
    location as string,
    new Date(startDate as string),
    new Date(endDate as string)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Available cars retrieved successfully',
    data: result,
  });
});


export const CarsControllers = {
  createCars,
  getSingleCar,
  getAllCars,
  updateCar,
  deleteCar,
  checkCarAvailability,
};


