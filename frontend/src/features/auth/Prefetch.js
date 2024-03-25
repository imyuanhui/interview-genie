import {store} from '../../app/store'
import { interviewsApiSlice } from '../interviews/interviewsApiSlice'
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
    useEffect(() => {

        console.log("subscribing")
        const interviews = store.dispatch(interviewsApiSlice.endpoints.getInterviews.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            console.log("unsubscribing")
            interviews.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}

export default Prefetch