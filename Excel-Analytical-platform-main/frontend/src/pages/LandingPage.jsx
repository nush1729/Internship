import React from 'react';
import { Link } from 'react-router-dom';
import { FiUploadCloud, FiEye, FiCpu, FiDownload, FiBarChart2, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Navbar from './Navbar.jsx';
import heroImage from '../assetss/images/analytics.svg';

const LandingPage = () => {
    const featureVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5 }
        })
    };

    const features = [
        { icon: <FiUploadCloud />, title: "Seamless File Upload", desc: "Drag & drop any .xls or .xlsx file to get started instantly." },
        { icon: <FiEye />, title: "Dynamic 2D & 3D Charts", desc: "Generate interactive bar, line, pie, and stunning 3D charts." },
        { icon: <FiCpu />, title: "AI-Powered Summaries", desc: "Get smart, automated insights and reports from your data with one click." },
        { icon: <FiBarChart2 />, title: "Customizable Axes", desc: "Dynamically map X and Y axes from your Excel column headers." },
        { icon: <FiDownload />, title: "Downloadable Reports", desc: "Export your charts as high-quality PNG or multi-page PDF files." },
        { icon: <FiZap />, title: "Secure & Private", desc: "Your data is yours. Secure authentication and private file history." },
    ];

    return (
        <div className="bg-slate-50 text-gray-800">
            <Navbar />
            <main>
                <section className="pt-32 pb-20 md:pt-40 md:pb-24 text-center md:text-left bg-white overflow-hidden">
                    <div className="container mx-auto px-6 max-w-7xl grid md:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                                Turn Excel Data into <span className="text-blue-600">Powerful Visuals</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
                                Upload, analyze, and create stunning 2D & 3D visualizations from your Excel files in seconds. Powered by AI for smarter summaries.
                            </p>
                            <div className="flex justify-center md:justify-start">
                                <Link to="/register" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                                    Get Started Free
                                </Link>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} className="hidden md:block">
                            <img src={heroImage} alt="Data Analytics" className="w-full max-w-lg mx-auto" />
                        </motion.div>
                    </div>
                </section>
                <section id="features" className="py-20">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">A Feature-Packed Analytics Powerhouse</h2>
                            <p className="text-lg text-gray-600 mt-2">Everything you need to understand your data better.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 text-center" custom={index} variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
                                    <div className="text-4xl text-blue-600 mb-4 inline-block">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
export default LandingPage;