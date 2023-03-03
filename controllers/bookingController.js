const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get currently booked tour
  const tour = await Tour.findById(req.params.tourID);

  //2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        // name: `${tour.name} Tour`,
        // description: tour.summary,
        // images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        // amount: tour.price * 100,
        // currency: 'usd',
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });

  //res.redirect(303, session.url);
  //3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  //This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});


exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

// const app = express();

// app.post(
//   '/create-checkout-session',
//   catchAsync(async (req, res, next) => {
//     //1) Get currently booked tour
//     const tour = await Tour.findById(req.params.tourID);
//     //console.log(tour);

//     //2) Create checkout session
//     const session = await stripe.checkout.sessions.create({
//       success_url: `${req.protocol}://${req.get('host')}/`,
//       cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
//       customer_email: req.user.email,
//       client_reference_id: req.params.tourID,
//       mode: 'payment',
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             unit_amount: tour.price * 100,
//             product_data: {
//               name: `${tour.name} Tour`,
//               description: tour.summary,
//               images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
//             },
//           },
//           quantity: 1,
//         },
//       ],
//     });

//     //console.log(session);
//     //console.log(session.id);

//     res.redirect(303, session.url);
//     //3) Create session as response
//     res.status(200).json({
//       status: 'success',
//       id: session.id,
//     });
//   })
// );