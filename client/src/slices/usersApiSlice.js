import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile from MongoDB (app-specific data)
    profile: builder.query({
      query: () => ({
        url: '/api/auth/profile',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useSyncUserMutation,
  useProfileQuery,
} = usersApiSlice;
