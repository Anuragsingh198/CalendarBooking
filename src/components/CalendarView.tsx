import React, { useState, useEffect } from 'react';
import { format, getDay } from 'date-fns';
import CalendarGrid from './CalendarGrid';
import TimeSlot from './TimeSlot';
import BookingModal from './BookingModal';
import { Call, BookingFormData, TimeSlot as TimeSlotType } from '../types';
import { generateTimeSlots, getCallsForDate, checkSlotAvailability, getSlotsNeeded } from '../utils/timeSlots';
import axios from 'axios';
import Footer from './Footer';

interface CalendarViewProps {
  onBackToHome: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onBackToHome }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [hoveredCallType, setHoveredCallType] = useState<'onboarding' | 'followup' | null>(null);
  
  const timeSlots = generateTimeSlots();
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const daysCalls = getCallsForDate(calls || [], selectedDateString);



const fetchCalls = async (date: string) => {
  setLoading(true);
  try {
    const { data } = await axios.get(`http://localhost:5001/api/calls?date=${date}`);
    setCalls(data.calls);  
  } catch (error) {
    console.error('Failed to fetch calls:', error);
  } finally {
    setLoading(false);
  }
};


  const handleBookCall = async (data: BookingFormData) => {
  setLoading(true);
  try {
    const storedClients = localStorage.getItem('clients');
    if (!storedClients) throw new Error('No clients in localStorage');

    const parsedClients = JSON.parse(storedClients);
    const client = parsedClients.find((c: any) => c._id === data.clientId);
    if (!client) throw new Error('Client not found');

    const payload = { ...data, client };
    // console.log("before  api call is called : " , )
    const response = await axios.post('http://localhost:5001/api/calls', payload);

    setCalls(prev => Array.isArray(prev) ? [...prev, response.data.call] : [response.data.call]);
    setBookingModalOpen(false);
    setSelectedTime('');
  } catch (error: any) {
    console.error('Failed to book call:', error);
    if (error.response?.status === 409) {
      console.log(" this is the error : " , error?.response?.data?.conflictingCalls)
      alert(`Cannot book this slot. Conflicts with: ${error?.response?.data?.conflictingCalls?.map((c: any) => c.clientName).join(', ')}`);
    } else {
      alert('Failed to book call. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};



const handleDeleteCall = async (callId: string) => {
  try {
    await axios.delete(`http://localhost:5001/api/calls/${callId}`);
    setCalls(prev => prev.filter(c => c._id !== callId));  
  } catch (error) {
    console.error('Failed to delete call:', error);
    alert('Failed to delete call. Please try again.');
  }
};



  const handleTimeSlotClick = (time: string) => {
    setSelectedTime(time);
    setBookingModalOpen(true);
  };

  useEffect(() => {
    fetchCalls(selectedDateString);
  }, [selectedDateString]);


const getSlotStatus = (time: string): { calls: Call[]; conflicted: boolean } => {
  if (!calls || !Array.isArray(calls)) return { calls: [], conflicted: false };

  const slotCalls = calls.filter(call => {
    const callSlotsNeeded = getSlotsNeeded(call.type);
    const callStartIndex = timeSlots.indexOf(call.time);
    const currentSlotIndex = timeSlots.indexOf(time);

    return (
      callStartIndex !== -1 &&
      currentSlotIndex >= callStartIndex &&
      currentSlotIndex < callStartIndex + callSlotsNeeded
    );
  });

  return { calls: slotCalls, conflicted: slotCalls.length > 0 };
};


  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
      <div className="w-[100%]  px-2 sm:px-6 lg:px-8 py-4">
       
        <div className="mb-8">
          <button
            onClick={onBackToHome}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-4 transition-colors duration-200"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Schedule Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Book and manage your coaching calls
          </p>
        </div>

        
        <div className="mt-2   dark:bg-gray-800 rounded-xl  border border-gray-200 dark:border-gray-700 p-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 m-auto ml-4">
            Daily Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-black dark:text-blue-400">
                {daysCalls.length}
              </div>
              <div className="text-sm  text-black dark:text-gray-400">
                Total Calls
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black dark:text-green-400">
                {daysCalls.filter(c => c.type === 'onboarding').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Onboarding
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black dark:text-blue-400">
                {daysCalls.filter(c => c.type === 'followup').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Follow-ups
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black dark:text-gray-400">
                {timeSlots.length - daysCalls.reduce((acc, call) => acc + getSlotsNeeded(call.type), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Available
              </div>
            </div>
          </div>
        </div>
      </div>


        <div className=" bg-slate-300 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 mb-2">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {format(selectedDate, 'EEEE')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {format(selectedDate, 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        <CalendarGrid 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate}
          calls={calls}
        />


        <div className="mb-6 mt-6 flex items-center justify-center  space-x-4">
          <button
            onMouseEnter={() => setHoveredCallType('followup')}
            onMouseLeave={() => setHoveredCallType(null)}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 text-sm font-medium"
          >
            Follow-up Preview (20 min)
          </button>
          <button
            onMouseEnter={() => setHoveredCallType('onboarding')}
            onMouseLeave={() => setHoveredCallType(null)}
            className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 text-sm font-medium"
          >
            Onboarding Preview (40 min)
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full px-8 h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4  bg-slate-100 dark:bg-slate-950 p-8">
            {timeSlots.map((time) => {
              const { calls: slotCalls, conflicted } = getSlotStatus(time);
              return (
                <TimeSlot
                  key={time}
                  time={time}
                  calls={slotCalls}
                  onBookCall={handleTimeSlotClick}
                  onDeleteCall={handleDeleteCall}
                  isConflicted={conflicted}
                  hoveredCallType={hoveredCallType}
                />
              );
            })}
          </div>
        )}

       

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedTime('');
        }}
        onSubmit={handleBookCall}
        selectedTime={selectedTime}
        selectedDate={selectedDateString}
        loading={loading}
      />

      <Footer/>
    </div>
  );
};

export default CalendarView;