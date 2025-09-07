import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onSelectAll: () => void;
  onBulkOpen: () => void;
  onBulkClose: () => void;
  allSelected: boolean;
  hasZones: boolean;
}

const BulkActions: React.FC<BulkActionsProps> = React.memo(
  ({
    selectedCount,
    onSelectAll,
    onBulkOpen,
    onBulkClose,
    allSelected,
    hasZones,
  }) => (
    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2'>
      {selectedCount > 0 && (
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto'>
          <span className='text-sm font-medium text-gray-700 whitespace-nowrap'>
            {selectedCount} selected
          </span>
          <div className='flex gap-2 w-full sm:w-auto'>
            <button
              onClick={onBulkOpen}
              className='flex-1 sm:flex-none px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1'
              aria-label={`Open ${selectedCount} selected zones`}
            >
              Open All
            </button>
            <button
              onClick={onBulkClose}
              className='flex-1 sm:flex-none px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1'
              aria-label={`Close ${selectedCount} selected zones`}
            >
              Close All
            </button>
          </div>
        </div>
      )}
      {hasZones && (
        <button
          onClick={onSelectAll}
          className='flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 w-full sm:w-auto justify-center sm:justify-start'
          aria-label={allSelected ? 'Deselect all zones' : 'Select all zones'}
        >
          {allSelected ? (
            <CheckSquare className='h-4 w-4 mr-2' aria-hidden='true' />
          ) : (
            <Square className='h-4 w-4 mr-2' aria-hidden='true' />
          )}
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      )}
    </div>
  )
);

BulkActions.displayName = 'BulkActions';

export default BulkActions;
