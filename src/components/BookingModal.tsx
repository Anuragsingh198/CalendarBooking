import React, { useState, useMemo } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Client, BookingFormData } from '../types';
import { DUMMY_CLIENTS } from '../data/clients';
import { formatTimeSlot } from '../utils/timeSlots';
import clsx from 'clsx';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
  selectedTime: string;
  selectedDate: string;
  loading?: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedTime,
  selectedDate,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [callType, setCallType] = useState<'onboarding' | 'followup'>('followup');
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const filteredClients = useMemo(() => {
    return DUMMY_CLIENTS.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    );
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const formData: BookingFormData = {
      clientId: selectedClient.id,
      callType,
      date: selectedDate,
      time: selectedTime
    };

    onSubmit(formData);
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setSearchTerm(client.name);
    setShowClientDropdown(false);
  };

  const resetForm = () => {
    setSearchTerm('');
    setSelectedClient(null);
    setCallType('followup');
    setShowClientDropdown(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="relative inline-block transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Book New Call
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Time and Date Display */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Selected Time:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatTimeSlot(selectedTime)} on {new Date(selectedDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Call Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Call Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCallType('followup')}
                  className={clsx(
                    'p-4 rounded-lg border-2 text-left transition-all duration-200',
                    callType === 'followup'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  )}
                >
                  <div className="font-medium text-gray-900 dark:text-white">Follow-up</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">20 minutes • Weekly recurring</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setCallType('onboarding')}
                  className={clsx(
                    'p-4 rounded-lg border-2 text-left transition-all duration-200',
                    callType === 'onboarding'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  )}
                >
                  <div className="font-medium text-gray-900 dark:text-white">Onboarding</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">40 minutes • One-time</div>
                </button>
              </div>
            </div>

            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Client
              </label>
              <div className="relative">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowClientDropdown(true);
                      if (!e.target.value) setSelectedClient(null);
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                    placeholder="Search clients by name or phone..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Dropdown */}
                {showClientDropdown && searchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => handleClientSelect(client)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {client.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <PhoneIcon className="w-3 h-3 mr-1" />
                              {client.phone}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                        No clients found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Client Display */}
              {selectedClient && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedClient.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedClient.phone}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedClient || loading}
                className={clsx(
                  'flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200',
                  selectedClient && !loading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                )}
              >
                {loading ? 'Booking...' : 'Book Call'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;