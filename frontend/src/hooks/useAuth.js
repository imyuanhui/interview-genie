import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let isPro = false
    let status = 'Basic'

    if (token) {
        const decoded = jwtDecode(token)
        const { id, username, permissions } = decoded.UserInfo
        
        isAdmin = permissions.includes('Admin')
        isPro = permissions.includes('Pro')

        if (isPro) status = 'Pro'
        if (isAdmin) status = 'Admin'

        return { id, username, permissions, status, isAdmin, isPro }
    }

    return { id:'', username: '', permissions: [], isAdmin, isPro, status }
}

export default useAuth
