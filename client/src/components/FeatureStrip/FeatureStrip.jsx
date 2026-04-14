import { Truck, ShieldCheck, RotateCcw } from "lucide-react";

const features = [
    {
        icon: <Truck size={22} />,
        title: "Free Delivery",
    },
    {
        icon: <ShieldCheck size={22} />,
        title: "Secure Payment",
    },
    {
        icon: <RotateCcw size={22} />,
        title: "Easy Returns",
    },
];

const FeatureStrip = () => {
    return (
        <div className="mt-4 px-1 w-full max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl p-3 shadow-lg">
                <div className="flex justify-between items-center text-white">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-1 items-center justify-center gap-2 text-xs md:text-sm font-medium"
                        >
                            {item.icon}
                            <span>{item.title}</span>

                            {/* Divider */}
                            {index !== features.length - 1 && (
                                <div className="hidden md:block h-6 w-[1px] bg-white/40 mx-3"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FeatureStrip
