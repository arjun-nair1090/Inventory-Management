import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Lock, ArrowRight, Shield, RefreshCcw, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
        const payload = isLogin
            ? { email, password }
            : { firstname, lastname, email, password };

        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || (isLogin ? 'Invalid credentials' : 'Registration failed'));
            }

            const data = await response.json();
            login(data.token, data.user);
            toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        toast.success("A password reset link has been sent if the email exists.", { icon: '📧' });
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 font-display antialiased text-slate-900 dark:text-slate-100 min-h-screen relative overflow-hidden flex items-center justify-center p-6 transition-colors duration-500">

            {/* Decorative Organic Shapes with Framer Motion */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] -z-10"
            />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[10%] right-[-5%] w-[250px] h-[250px] bg-teal-500/20 rounded-full blur-[80px] -z-10"
            />
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    opacity: [0.4, 0.5, 0.4]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-[40%] right-[-10%] w-[200px] h-[200px] bg-violet-500/20 rounded-full blur-[80px] -z-10"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[400px] flex flex-col items-center z-10"
            >
                {/* Logo Area */}
                <div className="mb-10 text-center">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 mb-4 shadow-lg shadow-blue-500/30"
                    >
                        <Package className="text-white w-8 h-8" />
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Inventory Pro</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Premium Asset Management</p>
                </div>

                {/* Login Card */}
                <motion.div
                    className="bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/40 dark:border-white/10 w-full rounded-2xl p-8 shadow-2xl relative overflow-hidden"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Glass highlight effect */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent"></div>

                    <div className="space-y-6">
                        {/* Header Inside Card */}
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {isLogin ? 'Please enter your details to continue' : 'Sign up to manage your inventory'}
                            </p>
                        </div>

                        {/* Input Fields */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="flex gap-4 overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-1.5 w-1/2">
                                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">First Name</label>
                                            <input
                                                required
                                                value={firstname}
                                                onChange={(e) => setFirstname(e.target.value)}
                                                className="w-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none text-sm placeholder:text-slate-400"
                                                placeholder="John"
                                                type="text"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5 w-1/2">
                                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Last Name</label>
                                            <input
                                                required
                                                value={lastname}
                                                onChange={(e) => setLastname(e.target.value)}
                                                className="w-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none text-sm placeholder:text-slate-400"
                                                placeholder="Doe"
                                                type="text"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col gap-1.5 mt-4">
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none text-sm placeholder:text-slate-400"
                                        placeholder="Enter your email"
                                        type="email"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none text-sm placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {isLogin && (
                                <div className="flex items-center justify-between text-xs px-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input className="w-4 h-4 rounded border-slate-300 dark:border-white/10 bg-transparent text-blue-500 focus:ring-blue-500" type="checkbox" />
                                        <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors">Remember me</span>
                                    </label>
                                    <button type="button" onClick={handleForgotPassword} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline decoration-2 underline-offset-4">Forgot Password?</button>
                                </div>
                            )}

                            {/* Sign In Button */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group mt-6"
                            >
                                <span>{isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}</span>
                                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>

                {/* Footer Links */}
                <div className="mt-8 text-center text-sm">
                    <p className="text-slate-600 dark:text-slate-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline decoration-2 underline-offset-4 ml-1"
                        >
                            {isLogin ? "Create Account" : "Sign In"}
                        </button>
                    </p>
                </div>

                {/* Decorative Info */}
                <div className="mt-12 flex gap-8 items-center opacity-40">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white">Secure Cloud</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white">Real-time Sync</span>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
