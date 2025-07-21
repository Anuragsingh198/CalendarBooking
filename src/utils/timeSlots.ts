import { format, addMinutes, parseISO, getDay } from 'date-fns';
import { Call, TimeSlot } from '../types';

export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  const startTime = new Date();
  startTime.setHours(10, 30, 0, 0);
  
  const endTime = new Date();
  endTime.setHours(19, 30, 0, 0);
  
  let current = startTime;
  while (current <= endTime) {
    slots.push(format(current, 'HH:mm'));
    current = addMinutes(current, 20);
  }
  
  return slots;
};

export const getSlotDuration = (callType: 'onboarding' | 'followup'): number => {
  return callType === 'onboarding' ? 40 : 20;
};

export const getSlotsNeeded = (callType: 'onboarding' | 'followup'): number => {
  return callType === 'onboarding' ? 2 : 1;
};

export const checkSlotAvailability = (
  startTime: string,
  callType: 'onboarding' | 'followup',
  existingCalls: Call[],
  selectedDate: string
): { available: boolean; conflictingCalls: Call[] } => {
  const slotsNeeded = getSlotsNeeded(callType);
  const timeSlots = generateTimeSlots();
  const startIndex = timeSlots.indexOf(startTime);
  
  if (startIndex === -1 || startIndex + slotsNeeded > timeSlots.length) {
    return { available: false, conflictingCalls: [] };
  }
  
  const conflictingCalls: Call[] = [];
  
  for (let i = 0; i < slotsNeeded; i++) {
    const slotTime = timeSlots[startIndex + i];
    const conflict = existingCalls.find(call => {
      if (call.time === slotTime) return true;
      
      // Check if this slot is occupied by a multi-slot call
      const callSlotsNeeded = getSlotsNeeded(call.type);
      const callStartIndex = timeSlots.indexOf(call.time);
      
      if (callStartIndex !== -1) {
        for (let j = 0; j < callSlotsNeeded; j++) {
          if (timeSlots[callStartIndex + j] === slotTime) {
            return true;
          }
        }
      }
      
      return false;
    });
    
    if (conflict && !conflictingCalls.find(c => c.id === conflict.id)) {
      conflictingCalls.push(conflict);
    }
  }
  
  return { available: conflictingCalls.length === 0, conflictingCalls };
};

export const getCallsForDate = (calls: Call[], date: string): Call[] => {
  const selectedDate = parseISO(date);
  const dayOfWeek = getDay(selectedDate);
  
  return calls.filter(call => {
    // Include one-time calls for the exact date
    if (!call.recurring && call.date === date) {
      return true;
    }
    
    // Include recurring calls that match the day of the week
    if (call.recurring && call.dayOfWeek === dayOfWeek) {
      return true;
    }
    
    return false;
  });
};

export const formatTimeSlot = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};