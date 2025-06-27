import { useEffect, useState } from 'react';
import { Ellipsis, FileText, LogOutIcon, PlusCircle, Trash2Icon } from 'lucide-react';
import type { Session } from '../types/session';
import { useAuth } from '../contexts/AuthContext';

type Props = {
    sessions: Session[];
    currentSessionId: string | null;
    onSelect: (s: Session) => void;
    onCreate: () => void;
    deleteSession:(sessionId:string)=>Promise<void>
};

export default function SessionSidebar({ sessions, currentSessionId, onSelect, onCreate,deleteSession }: Props) {
    const [isOpen, setIsOpen] = useState(true);
    const { logout } = useAuth()
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

    const toggleMenu = (sessionId: string) => {
        setMenuOpenId(prev => (prev === sessionId ? null : sessionId));
    };

    const handleClickOutside = () => setMenuOpenId(null);

    useEffect(() => {
        const handleClick = () => handleClickOutside();
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return (
        <div className={`h-screen ${isOpen ? 'w-64' : 'w-16'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <FileText className="text-white w-5 h-5" />
                    {isOpen && <span className="text-white font-semibold text-lg">Sessions</span>}
                </div>
                {isOpen && (
                    <button
                        className="text-blue-500 hover:text-blue-400 transition"
                        onClick={onCreate}
                        title="New Session"
                    >
                        <PlusCircle className="w-5 h-5" />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto">
                {sessions.length === 0 ? (
                    <div className="text-gray-500 text-sm text-center p-4">
                        {isOpen ? 'No sessions yet' : null}
                    </div>
                ) : (
                    <ul className="text-sm text-gray-300 space-y-1 mt-2 px-2">
                        {sessions.map((s) => (
                            <li
                                key={s._id}
                                
                                className={`cursor-pointer relative px-3 py-2 rounded-lg hover:bg-gray-800 transition ${s._id === currentSessionId
                                        ? 'bg-gradient-to-r from-blue-700 to-purple-700 text-white'
                                        : 'cursor-pointer'
                                    }`}
                            >
                                {isOpen ? (
                                    <div className="flex justify-between items-center">
                                        {/* ✅ CLICK WORKS: use a div, not input */}
                                        <div
                                            className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap pr-2"
                                            onClick={() => onSelect(s)}
                                        >
                                            <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                                {s.name}
                                            </span>
                                        </div>

                                        {/* ⚙️ Ellipsis Menu */}
                                        <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
                                            <Ellipsis className="cursor-pointer" onClick={() => toggleMenu(s._id)} />
                                            {menuOpenId === s._id && (
                                                <div className="absolute right-0 top-6 flex flex-col bg-gray-800 text-white shadow-md rounded z-50 min-w-[100px]">
                                                    <button
                                                        className="flex items-center gap-2 px-3 py-1 text-sm hover:bg-red-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteSession(s._id);
                                                            setMenuOpenId(null);
                                                        }}
                                                    >
                                                        <Trash2Icon size={16} />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-2 h-2 bg-gray-500 rounded-full mx-auto mt-1.5" />
                                )}
                            </li>


                        ))}
                    </ul>
                )}
            </div>

            <button
                onClick={() => { logout() }}
                className="text-white flex justify-center items-center gap-x-2 hover:text-white p-2 text-xs transition border-t border-gray-800"
            >
                {/* <div> */}
                <p className='text-md'>Log Out</p> <LogOutIcon size={15} />
                {/* </div> */}
            </button>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-white p-2 text-xs transition border-t border-gray-800"
            >
                {isOpen ? 'Collapse ◀' : '▶'}
            </button>
        </div>
    );
}
