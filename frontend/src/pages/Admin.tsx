import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight, Factory, Truck, Package, Cpu, User, Home, Bell, UserCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Admin() {
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);

    const toggleAdmin = async (id: number) => {
        const user = users.find(u => u.id === id);
        if (!user) return;

        const newRole = user.isAdmin ? 'USER' : 'ADMIN';

        try {
            const res = await fetch(`http://localhost:8080/api/v1/users/${id}/role?role=${newRole}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to update user role");

            setUsers(users.map(u => u.id === id ? { ...u, isAdmin: !u.isAdmin, displayRole: newRole === 'ADMIN' ? 'System Admin' : 'Staff' } : u));
            toast.success(`${user.name} is now ${newRole}`);
        } catch (error) {
            toast.error("Could not update role");
        }
    };

    const IconMap: Record<string, any> = {
        'Factory': Factory,
        'Truck': Truck,
        'Package': Package,
        'Cpu': Cpu,
        'default': Factory
    };

    const [suppliers, setSuppliers] = useState<any[]>([]);

    useEffect(() => {
        if (!token) return;

        // Fetch Suppliers
        fetch('http://localhost:8080/api/v1/suppliers', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(err => console.error(err));

        // Fetch Users
        fetch('http://localhost:8080/api/v1/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const mappedUsers = data.map((u: any) => ({
                    id: u.id,
                    name: `${u.firstname} ${u.lastname}`,
                    displayRole: u.role === 'ADMIN' ? 'System Admin' : 'Staff',
                    isAdmin: u.role === 'ADMIN',
                    avatar: u.avatar || `https://ui-avatars.com/api/?name=${u.firstname}+${u.lastname}&background=random`,
                    dotColor: u.role === 'ADMIN' ? 'bg-[#7f13ec]' : 'bg-slate-500'
                }));
                setUsers(mappedUsers);
            })
            .catch(err => console.error(err));

        // Fetch Logs
        fetch('http://localhost:8080/api/v1/transactions', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error(err));

    }, [token]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <div className="bg-[#0c0812] font-display text-slate-100 min-h-screen relative overflow-x-hidden selection:bg-[#7f13ec]/30">

            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(circle at 0% 0%, rgba(127, 19, 236, 0.15) 0%, transparent 50%)' }}
                />
                <motion.div
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)' }}
                />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen pb-24">
                {/* Header */}
                <header className="flex items-center justify-between p-6 sticky top-0 z-20 bg-[#0c0812]/40 backdrop-blur-xl border-b border-white/5">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-2xl font-extrabold tracking-tight text-white">Admin <span className="text-[#7f13ec]">Panel</span></h1>
                        <p className="text-xs text-slate-400 font-medium tracking-wide">System Management</p>
                    </motion.div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-br from-[#7f13ec] to-[#a855f7] hover:brightness-110 transition-all p-3 rounded-xl shadow-[0_0_20px_rgba(127,19,236,0.3)] flex items-center justify-center border border-white/10"
                    >
                        <Plus className="text-white w-6 h-6" />
                    </motion.button>
                </header>

                <main className="px-6 py-6 space-y-8">

                    {/* User Roles Section */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white tracking-wide">User Roles</h2>
                            <span className="text-xs font-semibold text-[#7f13ec] px-3 py-1 bg-[#7f13ec]/10 rounded-lg border border-[#7f13ec]/20 shadow-inner">{users.length} Active</span>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 shadow-2xl">
                            <AnimatePresence>
                                {users.map((user) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                        className="flex items-center gap-4 p-4 transition-colors"
                                    >
                                        <div className="relative">
                                            <img className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-sm" alt={user.name} src={user.avatar} />
                                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${user.dotColor} border-2 border-[#0c0812] rounded-full`}></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-white">{user.name}</p>
                                            <p className="text-xs text-slate-400">{user.displayRole}</p>
                                        </div>

                                        {/* Apple-style Toggle Switch */}
                                        <label className="relative flex items-center cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={user.isAdmin}
                                                onChange={() => toggleAdmin(user.id)}
                                            />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7f13ec] shadow-inner transition-colors"></div>
                                        </label>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.section>

                    {/* Supplier Management Section */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white tracking-wide">Supplier Management</h2>
                            <button className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                                View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {suppliers.length === 0 ? (
                                <div className="text-center text-slate-500 py-10 w-full col-span-4">Loading suppliers...</div>
                            ) : suppliers.map((supplier) => {
                                const SupplierIcon = IconMap[supplier.icon] || IconMap['default'];
                                return (
                                    <motion.div
                                        key={supplier.id}
                                        variants={itemVariants}
                                        initial="hidden" animate="show"
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#7f13ec]/40 rounded-2xl p-5 flex flex-col gap-3 group transition-all shadow-lg cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className={`w-12 h-12 rounded-xl ${supplier.color}/20 flex items-center justify-center ${supplier.text} shadow-inner`}>
                                                <SupplierIcon className="w-6 h-6" />
                                            </div>
                                            <div className="flex h-2.5 w-2.5 relative mt-1">
                                                {supplier.status === 'Active' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${supplier.status === 'Active' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <p className="font-bold text-sm text-white line-clamp-1 truncate">{supplier.name}</p>
                                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                <User className="w-4 h-4" /> {supplier.contact}
                                            </p>
                                        </div>
                                        <div className={`mt-1 flex items-center gap-1 text-[10px] font-bold ${supplier.status === 'Active' ? 'text-green-500' : 'text-slate-500'} uppercase tracking-wider`}>
                                            {supplier.status}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </motion.section>

                    {/* Full Audit Log Section */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white tracking-wide">System Audit Log</h2>
                            <span className="text-xs font-semibold text-slate-400">Total: {logs.length} Events</span>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                                {logs.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 text-sm">No recent activity recorded.</div>
                                ) : (
                                    logs.map((log, i) => (
                                        <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${log.type?.includes('Add') ? 'bg-green-500/10 text-green-500' : log.type?.includes('Remove') ? 'bg-red-500/10 text-red-500' : 'bg-[#7f13ec]/10 text-[#7f13ec]'}`}>
                                                    <Bell className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{log.type}</p>
                                                    <p className="text-xs text-slate-400 mt-1">Item: {log.item?.name} | By: {log.user?.firstname} {log.user?.lastname}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.section>
                </main>

                {/* Glassmorphic Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
                    <div className="bg-[#191022]/80 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-around px-2 py-3 shadow-2xl pointer-events-auto w-full max-w-md mx-auto">
                        <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors" href="/dashboard">
                            <Home className="w-6 h-6" />
                            <span className="text-[10px] font-medium tracking-wider">Home</span>
                        </a>
                        <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors" href="/items">
                            <Package className="w-6 h-6 mb-0.5" />
                            <span className="text-[10px] font-medium tracking-wider">Inventory</span>
                        </a>
                        <a className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors relative" href="#">
                            <Bell className="w-6 h-6" />
                            <div className="absolute top-0 right-1 w-2.5 h-2.5 bg-[#7f13ec] rounded-full border-2 border-[#191022]"></div>
                            <span className="text-[10px] font-medium tracking-wider">Alerts</span>
                        </a>
                        <a className="flex flex-col items-center gap-1 text-[#7f13ec] transition-colors" href="/admin">
                            <UserCog className="w-6 h-6 drop-shadow-[0_0_8px_rgba(127,19,236,0.5)]" />
                            <span className="text-[10px] font-bold tracking-wider">Admin</span>
                        </a>
                    </div>
                </nav>
            </div>
        </div>
    );
}
