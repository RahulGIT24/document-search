import { useEffect, useRef, useState } from 'react';
import SessionSidebar from '../components/SideBar';
import type { Session } from '../types/session';
import axios from 'axios';
import { Eye, Paperclip, Send, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { marked } from 'marked';

type Message = {
    role: 'user' | 'ai';
    content: string;
    error?: boolean
    _id?: string
    created_at?: string
};
export default function ChatPage() {
    const [current, setCurrent] = useState<Session | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [uploading, setUploading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null)
    const [viewPdfs, setViewPdfs] = useState(false);
    const [input, setInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [thinking, setThinking] = useState(false);
    const getSessions = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/user/sessions`;
        const res = await axios.get(url, { withCredentials: true });
        setSessions(res.data);
    };

    const getMessages = async () => {
        if (!current?._id) return;
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/chat/get-chats?session_id=${current?._id}`;
            const res = await axios.get(url, { withCredentials: true })
            setMessages(res.data)
        } catch (error) {
            setMessages([])
        }
    }

    const handleCreateNewSessionIfNeeded = async (files: FileList) => {
        const selectedFiles = Array.from(files);

        if (selectedFiles.length > 4) {
            toast.error("You can only upload a maximum of 4 PDFs.");
            return;
        }
        setUploading(true);
        if (current) {
            await uploadToCurrentSession(current._id, files);
        } else {
            const formData = new FormData();
            for (const file of Array.from(files)) {
                formData.append('files', file);
            }

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/session/create-session`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status == 200) {
                const newSession: Session = res.data;
                setSessions((prev) => [newSession, ...prev]);
                setCurrent(newSession);
                if (res.status == 200) {
                    toast.success('File Uploaded successfully')
                } else {
                    toast.error('Error while uploading files')
                }
            }
        }
        setUploading(false);
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const uploadToCurrentSession = async (sessionId: string, files: FileList) => {
        const formData = new FormData();

        const selectedFiles = Array.from(files);

        if (selectedFiles.length > 4) {
            toast.error("You can only upload a maximum of 4 PDFs.");
            return;
        }
        for (const file of Array.from(files)) {
            formData.append('files', file);
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/session/add-file?session_id=${sessionId}`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }); ``
            const newPdfs = res.data
            setCurrent((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    pdfs: [...(prev.pdfs || []), ...newPdfs]
                }
            })
            if (res.status == 200) {
                toast.success('File Uploaded to current session')
            }
        } catch (error) {
            toast.error('Error uploading file in current session')
        } finally {
            setUploading(false)
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        if (!current) {
            toast.error('Please upload a PDF to start a session.');
            return;
        }

        setMessages((prev) => [...prev, { role: 'user', content: input }]);
        setInput('');

        // api call
        try {
            setThinking(true);
            const url = `${import.meta.env.VITE_BACKEND_URL}/chat/get-response?session_id=${current._id}`;
            const res = await axios.post(
                url,
                { content: input },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setMessages((prev) => [...prev, { role: 'ai', content: res.data.message }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: 'ai', content: 'Error while generating response', error: true }]);
        } finally {
            setThinking(false)
        }
    };

    const clearChat = () => {
        setMessages([]);
        setCurrent(null)
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const deleteFile = async (pdfId: string) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/session/delete-files?session_id=${current?._id}`;
        try {
            const res = await axios.delete(url, {
                withCredentials: true,
                data: {
                    pdfs: [pdfId]
                }
            });
            if (res.status == 200) toast.success('File Deleted')
            setCurrent((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    pdfs: prev.pdfs.filter((p) => p.id !== pdfId)
                };
            });
        } catch (error) {
            toast.error('Error while deleting file')
        }
    }

    const deleteSession = async (session_id: string) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/session?session_id=${session_id}`;
        try {
            const res = await axios.delete(url, {
                withCredentials: true,
            });
            if (res.status == 200) toast.success('Session Deleted')
            const filtered = sessions.filter(c => c._id !== session_id)
            setSessions(filtered)
            setCurrent(null)
            setMessages([])
        } catch (error) {
            toast.error('Error while deleting sessions')
        }
    }

    useEffect(() => {
        getSessions();
    }, []);
    useEffect(() => {
        getMessages()
    }, [current])

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar (fixed, scroll inside if needed) */}
            <div className="w-64 bg-gray-900 h-full overflow-y-auto">
                <SessionSidebar
                    sessions={sessions}
                    currentSessionId={current?._id || null}
                    onSelect={setCurrent}
                    deleteSession={deleteSession}
                    onCreate={clearChat}
                />
            </div>

            {/* Chat area */}
            <div className="flex-1 bg-gray-800 text-white flex flex-col">
                {/* Top bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold">Chat: {current?.name || 'No session yet'}</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {current?.pdfs && current.pdfs.length > 0 && (
                                <button
                                    className="flex justify-center border bg-gray-900 border-transparent rounded-xl p-3 hover:bg-gray-700 cursor-pointer text-white items-center gap-x-2.5"
                                    onClick={(e) => {
                                        setViewPdfs(!viewPdfs);
                                        e.stopPropagation();
                                    }}
                                >
                                    <Eye />
                                    <p>See Uploaded PDFs</p>
                                </button>
                            )}
                            {viewPdfs && (
                                <div className="w-full absolute bg-gray-700 p-2 text-sm gap-y-2.5 z-50">
                                    {current?.pdfs.map((p, i) => (
                                        <div key={i} className="flex justify-between items-center mb-1.5" onClick={(e) => e.stopPropagation()}>
                                            <a
                                                href={p.url}
                                                target="_blank"
                                                className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[80%]"
                                                title={p.name}
                                            >
                                                {p.name}
                                            </a>
                                            <Trash2Icon color="red" onClick={() => deleteFile(p.id)} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={handleUploadClick} className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                            <Paperclip className="w-4 h-4" />
                            <span className="hidden sm:inline">Upload PDF</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) {
                                    handleCreateNewSessionIfNeeded(e.target.files);
                                }
                            }}
                        />
                    </div>
                </div>

                {uploading && (
                    <div className="flex items-center justify-center bg-yellow-100 text-yellow-800 text-sm px-4 py-2">
                        <svg className="animate-spin h-4 w-4 mr-2 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Uploading file(s)... please wait
                    </div>
                )}

                {/* Scrollable chat area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {!current && messages.length === 0 ? (
                        <div className="w-full justify-center items-center">
                            <p className="text-gray-400 text-center">Upload PDF to start your chatting session</p>
                        </div>
                    ) : (

                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-xl px-4 py-2 rounded-lg ${msg.role === 'user'
                                    ? 'ml-auto bg-blue-600 text-white'
                                    : 'mr-auto bg-gray-700 text-gray-100'
                                    }`}
                            >
                                {msg.role === 'ai' ? (
                                    <div
                                        className="prose prose-sm prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                                    />
                                ) : (
                                    msg.content
                                )}
                            </div>
                        ))
                    )}
                    <div ref={bottomRef} />
                    {thinking && (
                        <div className="max-w-fit px-4 py-2 rounded-lg mr-auto bg-gray-700 text-gray-100 flex items-center space-x-1 animate-pulse">
                            <span className="text-sm">Searching</span>
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]" />
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky input box */}
                <div className="p-4 border-t border-gray-700 flex items-center gap-4 sticky bottom-0 bg-gray-800">
                    <input
                        type="text"
                        className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none"
                        placeholder="Ask something..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={uploading || thinking}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                        disabled={uploading || thinking}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

}
