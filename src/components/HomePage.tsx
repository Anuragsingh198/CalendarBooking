import React from 'react';
import { CalendarDaysIcon, ClockIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Footer from './Footer';

interface HomePageProps {
  onBookCall: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onBookCall }) => {
  const features = [
    {
      icon: CalendarDaysIcon,
      title: 'Smart Scheduling',
      description: 'Intelligent time slot management with conflict prevention and optimal booking suggestions.'
    },
    {
      icon: ClockIcon,
      title: 'Flexible Call Types',
      description: 'Support for 40-minute onboarding calls and 20-minute recurring follow-up sessions.'
    },
    {
      icon: UserGroupIcon,
      title: 'Client Management',
      description: 'Comprehensive client database with searchable contacts and call history tracking.'
    }
  ];




  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl shadow-lg">
                <CalendarDaysIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Professional
              <span className="block text-blue-600">Healthcare Scheduling</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline your coaching practice with intelligent appointment scheduling. 
              Manage onboarding sessions and recurring follow-ups with zero conflicts and maximum efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onBookCall}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 hover:shadow-blue-500/25"
              >
                <span>Book Your Call</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Available Slots</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Booked Slots</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-500 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to manage your practice
            </h2>
            <p className="text-lg text-gray-900 dark:text-gray-300 max-w-2xl mx-auto">
              Built specifically for healthcare professionals who need reliable, conflict-free scheduling.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:bg-white dark:hover:bg-gray-600 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-400 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to streamline your scheduling?
          </h2>
          <p className="text-xl text-blue-300 mb-8 leading-relaxed">
            Start booking calls with intelligent conflict detection and seamless recurring appointment management.
          </p>
          <button
            onClick={onBookCall}
            className="group bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
          >
            <span>Get Started Now</span>
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;