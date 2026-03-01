import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, UserCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Invalid admin credentials');
            }

            const data = await response.json();

            if (data.user.role !== 'ADMIN') {
                throw new Error('Access denied. Admin privileges required.');
            }

            login(data.token, data.user);
            toast.success('Admin authorization successful!', { icon: '🛡️' });
            navigate('/admin');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0c0812] font-display antialiased text-slate-100 min-h-screen relative overflow-hidden flex items-center justify-center p-6 transition-colors duration-500 selection:bg-[#7f13ec]/30">

            {/* Decorative Admin Glows */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#7f13ec]/20 rounded-full blur-[100px] -z-10"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[0%] left-[-10%] w-[300px] h-[300px] bg-red-500/10 rounded-full blur-[100px] -z-10"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[420px] flex flex-col items-center z-10"
            >
                <div className="mb-10 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#7f13ec]/20 border-2 border-[#7f13ec]/50 mb-6 shadow-[0_0_30px_rgba(127,19,236,0.5)]"
                    >
                        <UserCog className="text-[#7f13ec] w-10 h-10" />
                    </motion.div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">System <span className="text-[#7f13ec]">Admin</span></h1>
                    <p className="text-[#7f13ec]/70 mt-2 text-sm uppercase tracking-widest font-semibold">Restricted Access</p>
                </div>

                <motion.div
                    className="bg-black/40 backdrop-blur-2xl border border-white/10 w-full rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7f13ec]/50 to-transparent"></div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Admin Email</label>
                            <input
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 focus:ring-2 focus:ring-[#7f13ec]/50 focus:border-[#7f13ec] transition-all outline-none text-sm text-white placeholder:text-slate-600"
                                placeholder="admin@example.com"
                                type="email"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Master Password</label>
                            <div className="relative group">
                                <input
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-5 focus:ring-2 focus:ring-[#7f13ec]/50 focus:border-[#7f13ec] transition-all outline-none text-sm text-white placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    type="password"
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 group-focus-within:text-[#7f13ec] transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02, backgroundColor: "#6b0fca" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-[#7f13ec] disabled:opacity-70 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(127,19,236,0.4)] transition-all flex items-center justify-center gap-2 group mt-8"
                        >
                            <span>{isLoading ? 'Authenticating...' : 'Authorize Access'}</span>
                            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </motion.button>
                        <div className="text-center pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-slate-500 text-xs hover:text-white transition-colors"
                            >
                                Return to User Portal
                            </button>
                        </div>
                    </form>
                </motion.div>

                <div className="mt-12 flex gap-4 items-center opacity-30 text-[#7f13ec]">
                    <Shield className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Level 5 Security Clearance Required</span>
                </div>
            </motion.div>
        </div>
    );
}
