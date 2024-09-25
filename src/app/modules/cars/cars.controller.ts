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
      data: {
        _id: result._id,
        name: result.name,
        description: result.description,
        color: result.color,
        isElectric:result.isElectric,
        features: result.features,
        pricePerHour: result.pricePerHour,
        status: result.status,
        isDeleted:result.isDeleted,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,

      },
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
    type: req.query.type,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    isElectric: req.query.isElectric === 'true', 
    location: req.query.location,
    startDate: req.query.startDate, 
    endDate: req.query.endDate,     
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


