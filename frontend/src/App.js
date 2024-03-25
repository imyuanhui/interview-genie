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
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path='signup' element={<Signup />} />

        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>

              <Route index element={<Welcome />} />

              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path=":id" element={<EditUser />} />
                <Route path="new" element={<NewUserForm />} />
              </Route>

              <Route path="interviews">
                <Route index element={<InterviewsList />} />
                <Route path=":id" element={<EditInterview />} />
                <Route path="new" element={<NewInterview />} />
              </Route>

              </Route>{/* End Dash */}
            </Route>
          </Route>

      </Route>
    </Routes>
  )
}

export default App
