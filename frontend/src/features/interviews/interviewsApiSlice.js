import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"


// Sort the interviews by status order: Pending, Ongoing and Finished
const interviewsAdapter = createEntityAdapter({
    sortComparer: (a, b) => {
        const statusOrder = { "Pending": 1, "Ongoing": 2, "Finished": 3 };
        return statusOrder[a.status] - statusOrder[b.status];
    }
});


const initialState = interviewsAdapter.getInitialState()

export const interviewsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getInterviews: builder.query({
            query: () => '/interviews',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedInterviews = responseData.map(interview => {
                    interview.id = interview._id
                    return interview
                })
                return interviewsAdapter.setAll(initialState, loadedInterviews)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'interview', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'interview', id }))
                    ]
                } else return [{ type: 'interview', id:'LIST' }]
            }
        }),
        addNewInterview: builder.mutation({
            query: initialInterviewData => ({
                url: '/interviews',
                method: 'POST',
                body: {
                    ...initialInterviewData,
                }
            }),
            invalidatesTags: [
                { type: 'Interview', id: "LIST" }
            ]
        }),
        updateInterview: builder.mutation({
            query: initialInterviewData => ({
                url: '/interviews',
                method: 'PATCH',
                body: {
                    ...initialInterviewData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Interview', id: arg.id }
            ]
        }),
        deleteInterview: builder.mutation({
            query: ({ id }) => ({
                url: `/interviews`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Interview', id: arg.id }
            ]
        })
    })
})

export const {
    useGetInterviewsQuery,
    useAddNewInterviewMutation,
    useUpdateInterviewMutation,
    useDeleteInterviewMutation} = interviewsApiSlice

const selectinterviewsResult = interviewsApiSlice.endpoints.getInterviews.select()

const selectInterviewsData = createSelector(
    selectinterviewsResult,
    interviewsResult => interviewsResult.data
)

export const {
    selectAll: selectAllInterviews,
    selectById: selectInterviewById,
    selectIds: selectInterviewIds
} = interviewsAdapter.getSelectors(state => selectInterviewsData(state) ?? initialState)