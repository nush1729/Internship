import React from "react";
import { Link } from "react-router-dom";
import Navbar from './Navbar';
import { FiUploadCloud, FiBarChart2, FiPieChart, FiUsers, FiShield, FiZap } from "react-icons/fi";
import analyticsImage from '../assetss/images/analytics.svg';



function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
            Excel Analytics Platform
          </h1>
          <p className="text-lg text-gray-600">
            Empower your data decisions with our smart Excel analytics platform. Upload, analyze, and visualize your Excel files with ease.
            Whether you’re a student, data analyst, or business professional — our platform provides the tools you need.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium shadow">
              Get Started Free
            </Link>
            <Link to="/login" className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
              Login
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <img
            src={analyticsImage}
            alt="Analytics Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            {[
              {
                step: "1",
                title: "Upload Your File",
                desc: "Easily drag and drop or select your Excel file from your device.",
                icon: <FiUploadCloud className="text-blue-600 text-3xl" />,
              },
              {
                step: "2",
                title: "Analyze Your Data",
                desc: "Our platform processes your data and provides smart insights.",
                icon: <FiBarChart2 className="text-green-600 text-3xl" />,
              },
              {
                step: "3",
                title: "Visualize & Report",
                desc: "Generate interactive charts and reports to understand your data better.",
                icon: <FiPieChart className="text-yellow-600 text-3xl" />,
              },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Interactive Charts", desc: "Beautiful customizable 2D/3D graphs.", icon: <FiPieChart /> },
            { title: "Smart Insights", desc: "AI-powered summaries & key trends.", icon: <FiBarChart2 /> },
            { title: "Upload History", desc: "Access all previous uploads and results.", icon: <FiUploadCloud /> },
            { title: "Secure Data Handling", desc: "Your files are safe and encrypted.", icon: <FiShield /> },
            { title: "Fast Processing", desc: "Works well even with large Excel files.", icon: <FiZap /> },
            { title: "Easy Reporting", desc: "Generate shareable reports in seconds.", icon: <FiPieChart /> },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-2xl text-blue-700 mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who Can Benefit */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Who Can Benefit?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Students",
                desc: "Analyze research data, visualize project results, and create presentations with ease.",
              },
              {
                title: "Data Analysts",
                desc: "Streamline your workflow and generate insights & reports for stakeholders.",
              },
              {
                title: "Business Professionals",
                desc: "Track sales, market trends, and make data-driven business decisions.",
              },
            ].map((user, i) => (
              <div key={i} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-3 text-blue-800">{user.title}</h3>
                <p className="text-gray-600">{user.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Excel Analytics Platform. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
