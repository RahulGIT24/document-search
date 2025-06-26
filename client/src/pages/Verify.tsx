import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router';

export default function Verify() {
    const [isLoading, setIsLoading] = useState(false);
    const { verifyToken } = useAuth();
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!searchParams.get('token')) {
            navigate('/',{replace:true})
            return;
        }
        if (!verified) {
            verifyTokenFunc()
        }
    }, [])

    const verifyTokenFunc = async () => {
        setIsLoading(true);
        try {
            verifyToken(searchParams.get('token')!)
            setVerified(true);
        } catch (error: any) {
            setError(error.response.data.detail)
            console.error('Token error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Logo and Header */}
                <div className="text-center">
                    {isLoading && <h2 className="text-3xl font-bold text-white mb-2">Verifying Token</h2>}
                    {!isLoading && error && <h2 className="text-3xl font-bold text-white mb-2">{error}</h2>}
                    {!isLoading && verified && (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-2">Token Verified. Please click on the below button for sign in</h2>
                            <button
                                type="button"
                                className="bg-blue-600 text-white px-4 py-2 rounded mt-4 cursor-pointer"
                                onClick={() => navigate('/signin',{replace:true})}
                            >
                                Go for Signin
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}