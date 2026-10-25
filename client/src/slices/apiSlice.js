import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { auth } from '../firebase';

const baseQuery = fetchBaseQuery({
  baseUrl: '',
  prepareHeaders: async (headers) => {
    try {
      const currentUser = auth?.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
          headers.set('Accept', 'application/json');
        }
      }
    } catch (err) {
      console.warn('Unable to attach auth token to request.', err);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Hotel', 'Room', 'Booking', 'Review'],
  endpoints: (builder) => ({}),
});
