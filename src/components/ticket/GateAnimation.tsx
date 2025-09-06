import React from 'react';

const GateAnimation: React.FC<{
  gateAnimationPhase: 'closed' | 'opening' | 'open';
  showSuccess: boolean;
}> = ({ gateAnimationPhase, showSuccess }) => {
  return (
    <div className='relative h-24 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden border-2 border-gray-300'>
      {/* Road */}
      <div className='absolute bottom-0 left-0 right-0 h-8 bg-gray-600 flex items-center'>
        <div className='w-full h-1 border-dashed border-white border-t-2 opacity-60'></div>
      </div>

      {/* Gate Posts */}
      <div className='absolute bottom-8 left-4 w-2 h-12 bg-gray-700 rounded-t'></div>
      <div className='absolute bottom-8 right-4 w-2 h-12 bg-gray-700 rounded-t'></div>

      {/* Gate Barrier */}
      <div
        className={`absolute bottom-14 left-6 right-6 h-2 bg-red-500 origin-left transition-transform duration-1000 ease-in-out ${
          gateAnimationPhase === 'closed'
            ? 'rotate-0'
            : gateAnimationPhase === 'opening'
            ? 'rotate-45'
            : 'rotate-90'
        }`}
        style={{
          background: gateAnimationPhase === 'open' ? '#10b981' : '#ef4444',
        }}
      >
        {/* Barrier stripes */}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30'></div>
      </div>

      {/* Car */}
      <div
        className={`absolute bottom-8 text-2xl transition-all duration-2000 ease-in-out ${
          gateAnimationPhase === 'closed'
            ? 'left-[-40px]'
            : gateAnimationPhase === 'opening'
            ? 'left-8'
            : 'left-16'
        }`}
      >
        🚗
      </div>

      {/* Success indicator */}
      {showSuccess && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce'>
            ✓ Access Granted
          </div>
        </div>
      )}
    </div>
  );
};

export default GateAnimation;
