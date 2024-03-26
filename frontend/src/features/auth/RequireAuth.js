import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const RequireAuth = ({ allowedPermissions }) => {
    const location = useLocation()
    const { permissions } = useAuth()
    
    const content = (
        permissions.some(permission => allowedPermissions.includes(permission))
            ? <Outlet />
            : <Navigate to='/dash' state={{ from: location }} replace />
    )

    return content
}

export default RequireAuth