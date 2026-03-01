import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Laptop, Armchair, Printer, Home, Package, Bell, User, X, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Items() {
    const { token } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, bounce: 0, duration: 0.4 } },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
    };

    const IconMap: Record<string, any> = {
        'Electronics': Laptop,
        'Furniture': Armchair,
        'Office': Printer,
        'default': Package
    };

    const [items, setItems] = useState<any[]>([]);

    // Form state
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Electronics');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('0');

    const fetchItems = () => {
        fetch('http://localhost:8080/api/v1/items', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => {
                console.error(err);
                if (token) toast.error("Failed to fetch items");
            });
    };

    useEffect(() => {
        if (token) fetchItems();
    }, [token]);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem = {
            name,
            sku: 'NEW-' + Math.floor(Math.random() * 10000),
            category,
            price: parseFloat(price) || 0,
            totalStock: parseInt(stock, 10),
            currentStock: parseInt(stock, 10),
            color: category === 'Electronics' ? 'blue-500' : category === 'Furniture' ? 'teal-500' : 'amber-500'
        };

        const loadingToast = toast.loading("Adding product...");
        fetch('http://localhost:8080/api/v1/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newItem)
        }).then(res => {
            if (!res.ok) throw new Error("Failed to add product");
            toast.success("Product added successfully", { id: loadingToast });
            fetchItems();
            setIsModalOpen(false);
            setName('');
            setPrice('');
            setStock('0');
        }).catch(err => {
            console.error(err);
            toast.error("Failed to add product", { id: loadingToast });
        });
    };

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        fetch(`http://localhost:8080/api/v1/items/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(() => {
                toast.success("Item deleted");
                fetchItems();
            })
            .catch(() => toast.error("Failed to delete item"));
    };

    const exportCsv = () => {
        if (items.length === 0) {
            toast.error("No items to export");
            return;
        }

        const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'];
        const rows = items.map(i => [
            i.id,
            `"${i.name}"`,
            i.sku,
            i.category,
            i.price,
            i.currentStock,
            i.currentStock > 10 ? 'In Stock' : i.currentStock > 0 ? 'Low Stock' : 'Out of Stock'
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(',') + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV Downloaded!");
    };

    return (
        <div className="bg-[#191022] font-display text-slate-100 min-h-screen relative overflow-x-hidden selection:bg-purple-500/30">
            {/* Background Decorative Glows */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7f13ec]/20 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"
            />

            <div className="relative flex flex-col min-h-screen">
                {/* Header */}
                <header className="flex items-center justify-between p-6 pt-8 md:pt-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Inventory</h1>
                        <p className="text-sm text-slate-400">Manage your assets</p>
                    </motion.div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={exportCsv}
                            className="flex items-center justify-center bg-white/10 border border-white/20 hover:bg-white/20 text-white p-3 rounded-xl shadow-lg transition-all"
                            title="Export to CSV"
                        >
                            <Download className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center bg-[#7f13ec] hover:bg-[#7f13ec]/90 text-white p-3 rounded-xl shadow-[0_0_20px_rgba(127,19,236,0.3)] transition-all"
                            title="Add Product"
                        >
                            <Plus className="w-5 h-5" />
                        </motion.button>
                    </div>
                </header>

                {/* Search Bar */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="px-6 mb-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg rounded-xl flex items-center px-4 py-3 gap-3 focus-within:border-[#7f13ec]/50 transition-colors">
                        <Search className="text-slate-400 w-5 h-5 flex-shrink-0" />
                        <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-500 text-white outline-none" placeholder="Search components..." type="text" />
                    </div>
                </motion.div>

                {/* Inventory List */}
                <main className="flex-1 px-6 pb-32 space-y-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 px-2">
                        <span>Item & Category</span>
                        <span>Stock / Price</span>
                    </motion.div>

                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                        {items.length === 0 ? (
                            <div className="text-center text-slate-500 py-10">Loading items...</div>
                        ) : items.map((item, index) => {
                            const ItemIcon = IconMap[item.category] || IconMap['default'];
                            const safeBg = item.color === 'blue-500' ? 'bg-blue-500' : item.color === 'teal-500' ? 'bg-teal-500' : 'bg-amber-500';
                            const safeBgOpacity = item.color === 'blue-500' ? 'bg-blue-500/20' : item.color === 'teal-500' ? 'bg-teal-500/20' : 'bg-amber-500/20';
                            const safeText = item.color === 'blue-500' ? 'text-blue-500' : item.color === 'teal-500' ? 'text-teal-500' : 'text-amber-500';

                            return (
                                <motion.div key={item.id} variants={itemVariants} initial="hidden" animate="show" custom={index} whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)" }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center justify-between group cursor-pointer shadow-lg transition-colors relative overflow-hidden">
                                    <div className="flex items-center gap-4 z-10">
                                        <div className={`h-12 w-12 rounded-lg ${safeBgOpacity} flex items-center justify-center ${safeText}`}>
                                            <ItemIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm text-white">{item.name}</h3>
                                            <p className="text-xs text-slate-400">{item.category} • SKU: {item.sku}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2 z-10">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-white">${item.price.toLocaleString()}</span>
                                            <button onClick={(e) => handleDelete(e, item.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1" title="Delete Item">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-slate-400">{item.currentStock}/{item.totalStock}</span>
                                            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (item.currentStock / item.totalStock) * 100)}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className={`h-full rounded-full ${safeBg}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </main>

                {/* Bottom Navigation Bar */}
                <nav className="fixed bottom-6 left-6 right-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-2 z-40">
                    <div className="flex items-center justify-around py-2">
                        <a className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors" href="/dashboard">
                            <Home className="w-6 h-6" />
                            <span className="text-[10px] font-medium tracking-wider">Home</span>
                        </a>
                        <a className="flex flex-col items-center gap-1 text-[#7f13ec]" href="/items">
                            <Package className="w-6 h-6 mb-0.5" />
                            <span className="text-[10px] font-bold tracking-wider">Inventory</span>
                        </a>
                        <a className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors relative" href="#">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-0 right-1 size-2 bg-amber-500 rounded-full ring-2 ring-[#191022]"></span>
                            <span className="text-[10px] font-medium tracking-wider">Alerts</span>
                        </a>
                        <a className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors" href="#">
                            <User className="w-6 h-6" />
                            <span className="text-[10px] font-medium tracking-wider">Profile</span>
                        </a>
                    </div>
                </nav>

                {/* Add New Item Modal Overlay */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsModalOpen(false)}
                            />

                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="w-full max-w-md bg-[#191022]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden z-10"
                            >
                                {/* Decorative Glow in Modal */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7f13ec]/20 blur-3xl -z-10" />

                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-white">Add New Item</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form className="space-y-6" onSubmit={handleCreate}>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-400 uppercase px-1 tracking-wider">Item Name</label>
                                        <div className="bg-white/5 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:ring-2 focus-within:ring-[#7f13ec]/50 transition-all shadow-inner">
                                            <input value={name} onChange={e => setName(e.target.value)} className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-500 text-white outline-none" placeholder="e.g. UltraWide Monitor" type="text" required />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-400 uppercase px-1 tracking-wider">Category</label>
                                            <div className="bg-white/5 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:ring-2 focus-within:ring-[#7f13ec]/50 transition-all shadow-inner">
                                                <select value={category} onChange={e => setCategory(e.target.value)} className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-300 outline-none cursor-pointer appearance-none">
                                                    <option className="bg-[#191022]">Electronics</option>
                                                    <option className="bg-[#191022]">Furniture</option>
                                                    <option className="bg-[#191022]">Office</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-400 uppercase px-1 tracking-wider">Price</label>
                                            <div className="bg-white/5 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:ring-2 focus-within:ring-[#7f13ec]/50 transition-all shadow-inner">
                                                <span className="text-sm text-slate-500 mr-1">$</span>
                                                <input value={price} onChange={e => setPrice(e.target.value)} className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-500 text-white outline-none" placeholder="0.00" type="number" step="0.01" required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-400 uppercase px-1 tracking-wider">Initial Quantity ({stock})</label>
                                        <div className="bg-white/5 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:ring-2 focus-within:ring-[#7f13ec]/50 transition-all shadow-inner">
                                            <input value={stock} onChange={e => setStock(e.target.value)} className="w-full accent-[#7f13ec] h-1.5 bg-slate-800 rounded-full cursor-pointer" max="100" min="0" type="range" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors" type="button">
                                            Cancel
                                        </button>
                                        <motion.button
                                            whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 py-4 bg-gradient-to-r from-[#7f13ec] to-[#a855f7] rounded-xl text-sm font-bold shadow-[0_4px_20px_rgba(127,19,236,0.4)] text-white transition-all border border-white/10" type="submit"
                                        >
                                            Save Item
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
