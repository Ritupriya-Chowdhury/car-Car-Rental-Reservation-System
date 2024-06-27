# Meeting Room Booking System
[Vercel meeting room api]: (https://ass-3-nine.vercel.app)

## Uses Technology
 express, mongoose, typescript, cors, dotenv, eslint, prettier, http-status, bcrypt, ts-node-dev, Jsonwebtoken.

## Applications

### User Api:
1.[User Signup api]: (https://ass-3-nine.vercel.app/api/auth/signup)

2.[User login api]: (https://ass-3-nine.vercel.app/api/auth/login)


### Meeting Rooms Api:
1.[Create Room api- POST]: (https://ass-3-nine.vercel.app/api/rooms)

2.[Get All Room api- GET]: (https://ass-3-nine.vercel.app/api/rooms)

3.[Get A Room api- GET]: (https://ass-3-nine.vercel.app/rooms/6676e1126aee288728c6d724)

4.[Update Room api- PUT]: (https://ass-3-nine.vercel.app/rooms/6676e1126aee288728c6d724)

5.[Delete Room api- DELETE]: (https://ass-3-nine.vercel.app/api/rooms/6676eb42ecbf6cd117b557e9)


### Slot Api:
1.[Create Slots api- POST]: (https://ass-3-nine.vercel.app/api/slots)

2.[Get available Slots api- GET]: (https://ass-3-nine.vercel.app/api/slots/availability)
[or]: (https://ass-3-nine.vercel.app/api/slots/availability?date=2024-06-12&roomId=6676e0f66aee288728c6d721)


### Booking Api:
1.[Add Booking api- POST]: (https://ass-3-nine.vercel.app/api/bookings)

2.[Get All Bookings api- GET]: (https://ass-3-nine.vercel.app/api/bookings)

3.[Update Bookings api- PUT]: (https://ass-3-nine.vercel.app/api/bookings/6677029e83341448ff603d4d)

4.[Delete Booking api- DELETE]: (https://ass-3-nine.vercel.app/api/bookings/6677029e83341448ff603d4d)

5.[My Bookings api- GET]: (https://ass-3-nine.vercel.app/api/my-bookings)


## Routes Which Only Accessible By Admin:

1.[Create Room api- POST]: (https://ass-3-nine.vercel.app/api/rooms)

2.[Update Bookings api- PUT]: (https://ass-3-nine.vercel.app/api/bookings/66767e0379b469bb5c584ecc)

3.[Delete Booking api- DELETE]: (https://ass-3-nine.vercel.app/api/bookings/66767e0379b469bb5c584ecc)

4.[Create Slots api- POST]: (https://ass-3-nine.vercel.app/api/slots)

5.[Get All Bookings api- GET]: (https://ass-3-nine.vercel.app/api/bookings)

6.[Update Bookings api- PUT]: (https://ass-3-nine.vercel.app/api/bookings/6677029e83341448ff603d4d)

7.[Delete Booking api- DELETE]: (https://ass-3-nine.vercel.app/api/bookings/6677029e83341448ff603d4d)


## Routes Which Only Accessible By User:
1.[Add Booking api- POST]: (https://ass-3-nine.vercel.app/api/bookings)

2.[My Bookings api- GET]: (https://ass-3-nine.vercel.app/api/my-bookings)

## User Data

{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "p@ssw0rd",
    "phone": "123-456-7890",
    "role": "user",
    "address": "123 Main St"
}


## Admin Data

{
  "name": "Programming Hero",
  "email": "web@programming-hero.com",
  "password": "ph-password",
  "phone": "1234567890",
  "role": "admin", 
  "address": "123 Main Street, City, Country"
}







