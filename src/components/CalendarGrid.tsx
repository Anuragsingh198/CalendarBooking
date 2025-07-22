import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Call } from '../types';
import { getCallsForDate, generateTimeSlots, formatTimeSlot, getSlotsNeeded } from '../utils/timeSlots';
import clsx from 'clsx';

interface CalendarGridProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  calls: Call[];
}
const POPUP_WIDTH = 320;
const POPUP_HEIGHT = 400;
const OFFSET = 10;

interface DatePopupProps {
  date: Date;
  calls: Call[];
  onClose: () => void;
  position: { x: number; y: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}
const DatePopup: React.FC<DatePopupProps> = ({
  date,
  calls,
  onClose,
  position,
  onMouseEnter,
  onMouseLeave
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ left: 0, top: 0 });

useEffect(() => {
  const { innerWidth } = window;

  let left = position.x;
  let top = position.y + OFFSET; 

  if (left + POPUP_WIDTH > innerWidth) {
    left = position.x - POPUP_WIDTH -  230 - OFFSET; 
  }

  if (left < OFFSET) left = 100 + OFFSET;


  setPopupPosition(prev => {
    if (prev.left !== left || prev.top !== top) {
      return { left, top };
    }
    return prev;
  });

  setIsVisible(true);
}, [position]);



  const timeSlots = generateTimeSlots();
  const daysCalls = getCallsForDate(calls, format(date, 'yyyy-MM-dd'));

  const getSlotStatus = (time: string) => {
    const slotCalls = daysCalls.filter(call => {
      if (call.time === time) return true;

      const callSlotsNeeded = getSlotsNeeded(call.type);
      const callStartIndex = timeSlots.indexOf(call.time);
      const currentSlotIndex = timeSlots.indexOf(time);

      if (callStartIndex !== -1 && currentSlotIndex !== -1) {
        return currentSlotIndex >= callStartIndex && currentSlotIndex < callStartIndex + callSlotsNeeded;
      }

      return false;
    });

    return slotCalls.length > 0 ? slotCalls[0] : null;
  };

  const availableSlots = timeSlots.filter(time => !getSlotStatus(time));
  const bookedSlots = timeSlots.filter(time => getSlotStatus(time));

  return (
    <>
      <div className="fixed inset-0 z-40 pointer-events-none" />

      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={clsx(
          "fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-80 max-h-96 overflow-y-auto transition-all duration-200 pointer-events-auto",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        style={{
          left: popupPosition.left,
          top: popupPosition.top
        }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(date, 'EEEE, MMMM d')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {format(date, 'yyyy')}
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {availableSlots.length}
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">
                Available
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">
                {bookedSlots.length}
              </div>
              <div className="text-xs text-red-700 dark:text-red-300">
                Booked
              </div>
            </div>
          </div>

          {bookedSlots.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Booked Slots
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {bookedSlots.map(time => {
                  const call = getSlotStatus(time);
                  if (!call) return null;

                  return (
                    <div
                      key={time}
                      className={clsx(
                        'p-2 rounded-lg text-xs',
                        call.type === 'onboarding'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      )}
                    >
                      <div className="font-medium">{formatTimeSlot(time)}</div>
                      <div className="truncate">{call.clientName}</div>
                      <div className="text-xs opacity-75">
                        {call.type === 'onboarding' ? 'Onboarding' : 'Follow-up'}
                        {call.recurring && ' • Weekly'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {availableSlots.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Available Times
              </h4>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {availableSlots.slice(0, 12).map(time => (
                  <div
                    key={time}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-center"
                  >
                    {formatTimeSlot(time)}
                  </div>
                ))}
                {availableSlots.length > 12 && (
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded text-center">
                    +{availableSlots.length - 12}
                  </div>
                )}
              </div>
            </div>
          )}

          {daysCalls.length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <p className="text-sm">No appointments scheduled</p>
              <p className="text-xs">All slots available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
const CalendarGrid: React.FC<CalendarGridProps> = ({ selectedDate, onDateSelect, calls }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const [popupData, setPopupData] = useState<{
    date: Date;
    position: { x: number; y: number };
    visible: boolean;
  } | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    setPopupData(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    setPopupData(null);
  };

  const showPopup = (date: Date, event: React.MouseEvent) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.right + 10,
      y: rect.top
    };

    if (!popupData || popupData.date.getTime() !== date.getTime() || !popupData.visible) {
      setPopupData({
        date,
        position,
        visible: true
      });
    }
  };

  const hidePopup = () => {
    const timeout = setTimeout(() => {
      setPopupData(null);
    }, 100);
    setHideTimeout(timeout);
  };

  const cancelHide = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
  };

  const forceHide = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setPopupData(null);
  };

  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  const getDateCallsCount = (date: Date) => {
    const daysCalls = getCallsForDate(calls, format(date, 'yyyy-MM-dd'));
    return daysCalls.length;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const callsCount = getDateCallsCount(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              onMouseEnter={(e) => showPopup(day, e)}
              onMouseLeave={hidePopup}
              className={clsx(
                'relative p-3 text-sm rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700',
                {
                  'text-gray-300 dark:text-gray-600': !isCurrentMonth,
                  'text-gray-900 dark:text-white': isCurrentMonth,
                  'bg-blue-600 text-white hover:bg-blue-700': isSelected,
                  'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800': isCurrentDay && !isSelected,
                  'font-semibold': isCurrentDay,
                }
              )}
            >
              <span>{format(day, 'd')}</span>
              
              {callsCount > 0 && (
                <div className={clsx(
                  'absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium',
                  isSelected 
                    ? 'bg-white text-blue-600' 
                    : 'bg-blue-600 text-white'
                )}>
                  {callsCount}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {popupData && popupData.visible && (
        <DatePopup
          date={popupData.date}
          calls={calls}
          onClose={forceHide}
          position={popupData.position}
          onMouseEnter={cancelHide}
          onMouseLeave={hidePopup}
        />
      )}
    </div>
  );
};

export default CalendarGrid;