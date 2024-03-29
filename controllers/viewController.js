const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get tour data from collection
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('No tour found with that name', 404));
  }
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.loginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: `Log into your account`,
  });
});

exports.signupForm = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: `Create your account`,
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('user', {
    title: `Your Account Settings`,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //2) Find tour with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).render('user', {
    title: 'Your Account Settings',
    user: updatedUser,
  });
});
