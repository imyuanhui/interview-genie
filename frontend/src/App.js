import { Routes, Route } from 'react-router-dom' 
import Layout from './components/Layout' 
import Public from './components/Public' 
import Login from './features/auth/Login'
import Signup from './features/auth/Signup' 
import DashLayout from './components/DashLayout' 
import Welcome from './features/auth/Welcome' 
import InterviewsList from './features/interviews/InterviewsList' 
import UsersList from './features/users/UsersList' 
import EditUser from './features/users/EditUser' 
import NewUserForm from './features/users/NewUserForm' 
import EditInterview from './features/interviews/EditInterview' 
import NewInterview from './features/interviews/NewInterview'
import UserProfile from './features/users/UserProfile' 
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { PERMISSIONS } from './config/permissions'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path='signup' element={<Signup />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedPermissions={[...Object.values(PERMISSIONS)]} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedPermissions={[PERMISSIONS.Adimin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="interviews">
                  <Route index element={<InterviewsList />} />
                  <Route path=":id" element={<EditInterview />} />
                  <Route path="new" element={<NewInterview />} />
                </Route>

                <Route path='profile'>
                  <Route index element={<UserProfile />} />
                </Route>

                </Route> {/* End Dash */}
              </Route>
          </Route>
         </Route> {/* End protected routes */}

      </Route>
    </Routes>
  )
}

export default App
