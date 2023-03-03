const express = require('express');
const tourController = require('../controllers/tourContollers');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoute');

// const reviewController = require('../controllers/reviewController');

const router = express.Router();

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

//POST /tour/1ew23535/reviews
//GET /tour/21e1qe114/reviews

//Nested Routes
router.use('/:tourId/reviews', reviewRouter);

//For JSON
// router.param('id', tourController.checkId);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/top-5-expensive')
  .get(tourController.aliasExpensiveTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    tourController.getMonthlyPlan,
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide')
  );

//Geospacial
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
// .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
