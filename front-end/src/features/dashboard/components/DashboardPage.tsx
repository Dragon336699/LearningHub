export const DashboardPage = () => {
    return (
        <div className="w-full max-w-4xl p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg text-white">
            <h1 className="text-3xl font-bold text-primary mb-2">
                Dashboard
            </h1>
            <p className="text-zinc-400 mb-6">
                Chào mừng bạn quay trở lại với hệ thống Learning Hub!
            </p>
            
            <div className="flex items-center justify-center h-40 border-2 border-dashed border-zinc-700 rounded-xl bg-zinc-950">
                <span className="text-xl font-medium tracking-wide text-zinc-500 animate-pulse">
                    👋 Hello World! Dashboard content coming soon...
                </span>
            </div>
        </div>
    );
};