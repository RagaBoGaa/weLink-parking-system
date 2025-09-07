import { useEffect, useState } from 'react';

import { auditLogService, AuditLogEntry } from '@/services/auditLogService';
import { useWebSocket } from '@/services/websocket';

const AdminAuditLog = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const websocket = useWebSocket();
  console.log('AdminAuditLog: Current logs:', auditLogs);
  console.log(
    'AdminAuditLog: Current websocket subscriptions:',
    websocket.getCurrentSubscriptions()
  );

  // Subscribe to audit log updates
  // Note: Initialization is now handled by the main AdminDashboard component
  useEffect(() => {
    console.log('AdminAuditLog: Subscribing to audit log service');

    const unsubscribe = auditLogService.subscribe((logs) => {
      console.log('AdminAuditLog: Received logs update from service:', logs);
      setAuditLogs(logs);
    });

    return () => {
      console.log('AdminAuditLog: Unsubscribing from audit log service');
      unsubscribe();
    };
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'zone-opened':
        return 'text-green-600 bg-green-50 border-green-200';

      case 'zone-closed':
        return 'text-red-600 bg-red-50 border-red-200';

      case 'category-rates-changed':
        return 'text-blue-600 bg-blue-50 border-blue-200';

      case 'vacation-added':
        return 'text-purple-600 bg-purple-50 border-purple-200';

      case 'rush-updated':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';

      case 'user-added':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';

      case 'zone-state-changed':
        return 'text-teal-600 bg-teal-50 border-teal-200';

      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatActionText = (log: AuditLogEntry) => {
    switch (log.action) {
      case 'zone-opened':
        return `opened zone ${log.targetId}`;

      case 'zone-closed':
        return `closed zone ${log.targetId}`;

      case 'category-rates-changed':
        return `updated rates for category ${log.targetId}`;

      case 'vacation-added':
        return `added vacation period ${log.targetId}`;

      case 'rush-updated':
        return `updated rush hours ${log.targetId}`;

      case 'user-added':
        return `added user ${log.targetId}`;

      case 'zone-state-changed': {
        const details = log.details;
        return `zone ${log.targetId} updated (${
          details?.occupied || 0
        } occupied, ${details?.free || 0} free)`;
      }

      default:
        return `performed ${log.action} on ${log.targetType} ${log.targetId}`;
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-lg font-bold text-gray-900'>Admin Audit Log</h2>

          <p className='text-sm text-gray-600'>
            Live feed of administrative actions
          </p>
        </div>

        <div className='text-sm text-gray-600 space-y-2'>
          <div>{auditLogs.length} recent actions</div>
          <div className='text-xs text-blue-600'>
            Active subscriptions:{' '}
            {websocket.getCurrentSubscriptions().join(', ') || 'none'}
          </div>
          {websocket.getCurrentSubscriptions().length > 1 && (
            <button
              onClick={() => {
                console.log('Cleaning up duplicate subscriptions');
                websocket.unsubscribeFromAllGates();
              }}
              className='px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600'
            >
              Clear All Subscriptions
            </button>
          )}
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm border'>
        {auditLogs.length === 0 ? (
          <div className='p-12 text-center'>
            <div className='text-gray-400 text-4xl mb-4'>📋</div>

            <h3 className='text-lg font-medium text-gray-500 mb-2'>
              No Recent Activity
            </h3>

            <p className='text-sm text-gray-400'>
              Admin actions will appear here in real-time
            </p>
          </div>
        ) : (
          <div className='divide-y divide-gray-200'>
            {auditLogs.map((log) => (
              <div key={log.id} className='p-4 hover:bg-gray-50'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2 mb-1'>
                      <span className='font-medium text-gray-900'>
                        {log.adminId}
                      </span>

                      <span className='text-gray-600'>
                        {formatActionText(log)}
                      </span>
                    </div>

                    <div className='flex items-center space-x-4 text-sm'>
                      <span
                        className={`px-2 py-1 rounded border ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>

                      <span className='text-gray-500'>
                        Target: {log.targetType}
                      </span>

                      {log.details && (
                        <span className='text-gray-500'>
                          Details: {JSON.stringify(log.details)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='text-sm text-gray-500 ml-4'>
                    {formatTimestamp(log.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {auditLogs.length > 0 && (
        <div className='text-center'>
          <button
            onClick={() => auditLogService.clearLogs()}
            className='text-sm text-gray-500 hover:text-gray-700 underline'
          >
            Clear Log History
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLog;
