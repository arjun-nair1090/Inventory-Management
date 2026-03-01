import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Archive, BarChart2, TrendingUp, AlertTriangle, AlertCircle, Wallet, ChevronRight, Home, Bell, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState({ totalItems: 0, lowStockAlerts: 0, inventoryValue: 0 });
    const [recentItems, setRecentItems] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { user, logout, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        fetch('http://localhost:8080/api/v1/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Error fetching stats:", err));

        fetch('http://localhost:8080/api/v1/items', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setRecentItems(data.slice(0, 4)))
            .catch(err => console.error("Error fetching items:", err));

        fetch('http://localhost:8080/api/v1/transactions', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setTransactions(data))
            .catch(err => console.error("Error fetching transactions:", err));
    }, [token]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <div className="font-display text-slate-100 min-h-screen flex flex-col relative" style={{
            background: `radial-gradient(circle at 0% 0%, rgba(19, 91, 236, 0.15) 0%, transparent 40%),
                   radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
                   #0a0c14`
        }}>
            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/10 shadow-sm">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.05 }}
                        className="size-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
                    >
                        <Package className="text-white w-6 h-6" />
                    </motion.div>
                    <h1 className="text-lg font-bold tracking-tight">StockFlow</h1>
                </div>
                <div className="flex items-center gap-3 relative">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold">{user?.firstname} {user?.lastname}</p>
                        <p className="text-xs text-slate-400 capitalize">{user?.role.toLowerCase()}</p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="size-10 rounded-full border-2 border-blue-500/50 p-0.5 cursor-pointer flex-shrink-0"
                    >
                        <img alt="User Profile" className="w-full h-full rounded-full object-cover bg-slate-800" src={user?.avatar || "https://ui-avatars.com/api/?name=User"} />
                    </motion.div>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-12 right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                            >
                                <button
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        navigate('/admin');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <Shield className="w-4 h-4" /> Sign in as Admin
                                </button>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate('/login');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <UserIcon className="w-4 h-4" /> Change User
                                </button>
                                <div className="border-t border-white/10 my-1"></div>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate('/login');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            <main className="flex-1 p-4 pb-24 overflow-y-auto space-y-6">

                {/* Metrics Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {/* Total Items */}
                    <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden group shadow-lg">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Archive className="text-emerald-400 w-16 h-16" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                <BarChart2 className="w-6 h-6" />
                            </div>
                            <span className="text-slate-400 text-sm font-medium">Total Units in Stock</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-white">{stats.totalItems.toLocaleString()}</h2>
                                <p className="text-emerald-400 text-xs font-semibold mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" /> +2.4% vs last month
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Low Stock Alerts */}
                    <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden group shadow-lg">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertTriangle className="text-amber-400 w-16 h-16" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <span className="text-slate-400 text-sm font-medium">Low Stock Alerts</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-white">{stats.lowStockAlerts}</h2>
                                <p className="text-amber-400 text-xs font-semibold mt-1">Requires immediate action</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Total Value */}
                    <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden group shadow-lg">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wallet className="text-violet-400 w-16 h-16" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <span className="text-slate-400 text-sm font-medium">Inventory Value</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-white">${(stats.inventoryValue / 1000).toFixed(1)}k</h2>
                                <p className="text-violet-400 text-xs font-semibold mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" /> +1.2% this week
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Inventory Table Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-white">Recent Inventory</h3>
                        <button className="text-blue-500 text-sm font-semibold flex items-center gap-1 hover:text-blue-400 transition-colors">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Item</th>
                                        <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Stock</th>
                                        <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {recentItems.map((item: any) => (
                                        <motion.tr key={item.id} whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }} className="transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm text-white">{item.name}</span>
                                                    <span className="text-xs text-slate-400 uppercase mt-0.5">SKU: {item.sku}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="text-sm font-medium">{item.currentStock}</span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                {item.currentStock > 10 ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase shadow-sm">In Stock</span>
                                                ) : item.currentStock > 0 ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20 uppercase shadow-sm animate-pulse">Low Stock</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20 uppercase shadow-sm">Out of Stock</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-4 pt-6"
                >
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-white">Activity Log</h3>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                        {transactions.length > 0 ? (
                            <div className="divide-y divide-white/10">
                                {transactions.map((tx: any) => (
                                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                        <div>
                                            <p className="font-medium text-sm text-white">{tx.actionType}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Item: {tx.itemName} | By: {tx.userName}</p>
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">
                                            {new Date(tx.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                No recent activity
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>

            {/* Bottom Navigation Bar (Mobile) */}
            <div className="md:hidden fixed bottom-0 w-full bg-white/5 backdrop-blur-xl border-t border-white/10 px-6 pb-6 pt-3 flex justify-between items-center z-50">
                <a className="flex flex-col items-center gap-1 text-blue-500" href="#">
                    <div className="flex h-8 items-center justify-center">
                        <Home className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider">Home</p>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors" href="#">
                    <div className="flex h-8 items-center justify-center">
                        <Package className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider">Inventory</p>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors relative" href="#">
                    <div className="flex h-8 items-center justify-center">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-1 right-1 size-2 bg-amber-500 rounded-full ring-2 ring-[#0a0c14]"></span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider">Alerts</p>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors" href="#">
                    <div className="flex h-8 items-center justify-center">
                        <UserIcon className="w-6 h-6" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wider">Profile</p>
                </a>
            </div>
        </div>
    );
}
