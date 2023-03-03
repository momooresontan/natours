/* eslint-disable */

import axios from 'axios';
// import { loadStripe } from '@stripe/stripe-js';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51MZW0IKBtKBUFO02HPhh4G9WOPDm6zInbxbXEH9gyVrSZylFnS3XKLzHRCi5ouRWKdyJkyxdcAWylJ6bdMymXASz00Y7GH1ZlS'
);

export const bookTour = async (tourID) => {
  try {
    //1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourID}`
    );

    // const stripe = await loadStripe(
    //   'pk_test_51MZW0IKBtKBUFO02HPhh4G9WOPDm6zInbxbXEH9gyVrSZylFnS3XKLzHRCi5ouRWKdyJkyxdcAWylJ6bdMymXASz00Y7GH1ZlS'
    // );

    console.log(session);
    // console.log(session.data.id);

    //2) Create checkout form + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
    //return;
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
