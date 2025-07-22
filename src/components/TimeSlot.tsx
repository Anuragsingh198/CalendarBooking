import React, { useState } from 'react';
import { PlusIcon, TrashIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Call } from '../types';
import { formatTimeSlot, getSlotsNeeded } from '../utils/timeSlots';
import clsx from 'clsx';

interface TimeSlotProps {
  time: string;
  calls: Call[];
  onBookCall: (time: string) => void;
  onDeleteCall: (callId: string) => void;
  isConflicted?: boolean;
  hoveredCallType?: 'onboarding' | 'followup' | null;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ 
  time, 
  calls, 
  onBookCall, 
  onDeleteCall, 
  isConflicted = false,
  hoveredCallType 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const call = calls.find(c => c.time === time);
  const isOccupied = call !== undefined;
   console.log(" this is  the calls  from the  TimeSlot: ", calls)
  // Check if this slot would be affected by the hovered call type
  const wouldBeAffected = hoveredCallType && !isOccupied;
  const slotsNeeded = hoveredCallType ? getSlotsNeeded(hoveredCallType) : 0;
  
  const handleDeleteClick = (callId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(callId);
  };

  const confirmDelete = (callId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteCall(callId);
    setShowDeleteConfirm(null);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  };

  return (
    <div
      className={clsx(
        'relative rounded-lg border-2 transition-all duration-200 min-h-[80px]',
        {
          // Empty slot styles
          'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md cursor-pointer': !isOccupied && !isConflicted,
          
          // Occupied slot styles
          'border-blue-200 dark:border-blue-700': isOccupied && call?.type === 'followup',
          'border-green-200 dark:border-green-700': isOccupied && call?.type === 'onboarding',
          'bg-blue-50 dark:bg-blue-900/20': isOccupied && call?.type === 'followup',
          'bg-green-50 dark:bg-green-900/20': isOccupied && call?.type === 'onboarding',
          
          // Conflicted slot styles
          'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 cursor-not-allowed': isConflicted,
          
          // Hover preview styles
          'border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30': wouldBeAffected && hoveredCallType === 'followup',
          'border-green-300 dark:border-green-500 bg-green-50 dark:bg-green-900/30': wouldBeAffected && hoveredCallType === 'onboarding'
        }
      )}
      onClick={() => !isOccupied && !isConflicted ? onBookCall(time) : undefined}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {formatTimeSlot(time)}
          </span>
          
          {wouldBeAffected && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              {hoveredCallType === 'onboarding' ? '40 min' : '20 min'}
            </span>
          )}
        </div>
        
        {isOccupied && call ? (
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {call.clientName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {call.clientPhone}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <PhoneIcon className="w-3 h-3 text-gray-500" />
                  <span className={clsx(
                    'text-xs font-medium px-2 py-1 rounded-full',
                    call.type === 'followup' 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  )}>
                    {call.type === 'followup' ? 'Follow-up' : 'Onboarding'}
                    {call.recurring && ' • Weekly'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-2">
                {showDeleteConfirm === call._id ? (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => confirmDelete(call._id, e)}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors duration-200"
                      title="Confirm delete"
                    >
                      ✓
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                      title="Cancel"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleDeleteClick(call._id, e)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors duration-200"
                    title="Delete call"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : isConflicted ? (
          <div className="text-sm text-red-600 dark:text-red-400">
            Conflicted
          </div>
        ) : (
          <div className="flex items-center justify-center py-2">
            <PlusIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
          </div>
        )}
      </div>
      
      {wouldBeAffected && hoveredCallType === 'onboarding' && slotsNeeded === 2 && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
            2 slots needed
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlot;