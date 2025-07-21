import React, { useState, useEffect } from 'react';
import { format, getDay } from 'date-fns';
import CalendarGrid from './CalendarGrid';
import TimeSlot from './TimeSlot';
import BookingModal from './BookingModal';
import { Call, BookingFormData, TimeSlot as TimeSlotType } from '../types';
import { generateTimeSlots, getCallsForDate, checkSlotAvailability, getSlotsNeeded } from '../utils/timeSlots';
import { DUMMY_CLIENTS } from '../data/clients';

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
  const daysCalls = getCallsForDate(calls, selectedDateString);

  // This would be replaced with actual API calls
  const fetchCalls = async (date: string) => {
    setLoading(true);
    try {
      // Simulated API call - replace with actual backend call
      // const response = await fetch(`/api/calls?date=${date}`);
      // const data = await response.json();
      
      // For demo purposes, using mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock some demo calls
      const mockCalls: Call[] = [
        {
          id: '1',
          clientId: '3',
          clientName: 'Sriram Krishnan',
          clientPhone: '+91 76543 21098',
          date: '2025-01-16',
          time: '11:10',
          type: 'onboarding',
          recurring: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          clientId: '4',
          clientName: 'Shilpa Reddy',
          clientPhone: '+91 65432 10987',
          date: '2025-01-16',
          time: '15:50',
          type: 'followup',
          recurring: true,
          dayOfWeek: 4, // Thursday
          createdAt: new Date().toISOString()
        }
      ];
      
      setCalls(mockCalls);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookCall = async (data: BookingFormData) => {
    setLoading(true);
    try {
      const client = DUMMY_CLIENTS.find(c => c.id === data.clientId);
      if (!client) throw new Error('Client not found');

      // Check for conflicts
      const { available, conflictingCalls } = checkSlotAvailability(
        data.time,
        data.callType,
        daysCalls,
        data.date
      );

      if (!available) {
        alert(`Cannot book this slot. Conflicts with: ${conflictingCalls.map(c => c.clientName).join(', ')}`);
        return;
      }

      // Simulated API call - replace with actual backend call
      // const response = await fetch('/api/calls', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCall: Call = {
        id: Date.now().toString(),
        clientId: data.clientId,
        clientName: client.name,
        clientPhone: client.phone,
        date: data.date,
        time: data.time,
        type: data.callType,
        recurring: data.callType === 'followup',
        dayOfWeek: data.callType === 'followup' ? getDay(new Date(data.date)) : undefined,
        createdAt: new Date().toISOString()
      };

      setCalls(prev => [...prev, newCall]);
      setBookingModalOpen(false);
      setSelectedTime('');
    } catch (error) {
      console.error('Failed to book call:', error);
      alert('Failed to book call. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCall = async (callId: string) => {
    try {
      // Simulated API call - replace with actual backend call
      // await fetch(`/api/calls/${callId}`, { method: 'DELETE' });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setCalls(prev => prev.filter(c => c.id !== callId));
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
    const slotCalls = daysCalls.filter(call => {
      // Direct match
      if (call.time === time) return true;
      
      // Check if this slot is occupied by a multi-slot call
      const callSlotsNeeded = getSlotsNeeded(call.type);
      const callStartIndex = timeSlots.indexOf(call.time);
      const currentSlotIndex = timeSlots.indexOf(time);
      
      if (callStartIndex !== -1 && currentSlotIndex !== -1) {
        return currentSlotIndex >= callStartIndex && currentSlotIndex < callStartIndex + callSlotsNeeded;
      }
      
      return false;
    });

    return { calls: slotCalls, conflicted: false };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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

        {/* Calendar Grid */}
        <CalendarGrid 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate}
          calls={calls}
        />

        {/* Selected Date Display */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {format(selectedDate, 'EEEE')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {format(selectedDate, 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Call Type Hover Preview */}
        <div className="mb-6 flex items-center justify-center space-x-4">
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

        {/* Time Slots Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Stats */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {daysCalls.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Calls
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {daysCalls.filter(c => c.type === 'onboarding').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Onboarding
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {daysCalls.filter(c => c.type === 'followup').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Follow-ups
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {timeSlots.length - daysCalls.reduce((acc, call) => acc + getSlotsNeeded(call.type), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
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
    </div>
  );
};

export default CalendarView;