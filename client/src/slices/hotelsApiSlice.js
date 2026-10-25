import { apiSlice } from './apiSlice';

export const hotelsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: (filters) => ({
        url: '/api/hotels',
        params: filters,
      }),
      providesTags: ['Hotel'],
    }),
    getHotelById: builder.query({
      query: (id) => ({ url: `/api/hotels/${id}` }),
      providesTags: ['Hotel'],
    }),
    getRoomsByHotel: builder.query({
      query: (hotelId) => ({ url: `/api/rooms/hotel/${hotelId}` }),
      providesTags: ['Room'],
    }),
    getReviewsByHotel: builder.query({
      query: (hotelId) => ({ url: `/api/reviews/hotel/${hotelId}` }),
      providesTags: ['Review'],
    }),
    createBooking: builder.mutation({
      query: (data) => ({
        url: '/api/bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Booking'],
    }),
    getMyBookings: builder.query({
      query: () => ({ url: '/api/bookings/mybookings' }),
      providesTags: ['Booking'],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/api/bookings/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Booking'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: '/api/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Review', 'Hotel'],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useGetRoomsByHotelQuery,
  useGetReviewsByHotelQuery,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useCancelBookingMutation,
  useCreateReviewMutation,
} = hotelsApiSlice;
