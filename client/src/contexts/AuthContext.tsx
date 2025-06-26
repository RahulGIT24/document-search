import { createContext, useContext, useState, type ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

interface User {
    id: string;
    email: string;
    name: string;
    verified:boolean
}

interface AuthContextType {
    user: User | null;
    // setUser:React.Dispatch<React.SetStateAction<User | null>>
    getUser:()=>Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    verifyToken: (token: string) => Promise<void>
    forgotPassword:(email:string)=>Promise<void>
    resetPassword:(password:string,token:string)=>Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate=useNavigate()
    const [user, setUser] = useState<User | null>(null);

    const getUser = async()=>{
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/profile`
        try {
            const res = await axios.get(url, { withCredentials: true })
            console.log(res);
            setUser(res.data)
        } catch (error: any) {
            return;
        }
    }

    const login = async (email: string, password: string) => {
        if (password.length < 8) {
            toast.error('Password should contain minimum of 8 characters')
            return;
        }
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/login`
        try {
            const res = await axios.post(url, {
                email, password
            }, { withCredentials: true })
            setUser(res.data)
        } catch (error: any) {
            toast.error(error.response.data.detail)
        }
    };

    const register = async (name: string, email: string, password: string) => {
        if (password.length < 8) {
            toast.error('Password should contain minimum of 8 characters')
            return;
        }
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/register`
        try {
            const res = await axios.post(url, {
                email, password, name
            })
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response.data.detail)
        }
    };

    const verifyToken = async (token: string) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/verify-token?token=${token}`
        try {
            const res = await axios.get(url, {})
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response.data.detail)
        }
    }

    const forgotPassword = async (email: string) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/forgot-password`
        try {
            const res = await axios.post(url, {
                email
            })
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response.data.detail)
        }
    }

    const resetPassword = async(password:string,token:string)=>{
        if (password.length < 8) {
            toast.error('Password should contain minimum of 8 characters')
            return;
        }
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/reset-password?token=${token}`
        try {
            const res = await axios.post(url, {
                password
            })
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response.data.detail)
        }
    }

    const logout = async() => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/logout`
        try {
            const res = await axios.get(url, {withCredentials:true})
            setUser(null)
            toast.success(res.data.message)
            navigate('/home')
        } catch (error: any) {
            toast.error(error.response.data.detail)
        }
    };

    const value = {
        // user,
        getUser,
        login,
        register,
        logout,
        verifyToken,
        // setUser,
        user,
        resetPassword,
        forgotPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}