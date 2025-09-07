import { useState, useCallback } from 'react';
import { Map } from 'lucide-react';
import ErrorComponent from '@/components/shared/ErrorComponent';
import { AdminCardLayout } from '@/components/shared/AdminCardLayout';
import { Zone } from '@/types/parking';
import { useZoneManagement } from '@/hooks/useZoneManagement';

import GateSelector from './zone-management/GateSelector';
import BulkActions from './zone-management/BulkActions';
import ZoneStatistics from './zone-management/ZoneStatistics';
import ZoneGrid from './zone-management/ZoneGrid';
import ZoneActionConfirmation from './zone-management/ZoneActionConfirmation';
import BulkActionConfirmation from './zone-management/BulkActionConfirmation';
import Loading from '@/components/ui/loading';
import toast from 'react-hot-toast';

const ZoneManagement = () => {
  const {
    state,
    actions,
    zones,
    zoneStats,
    selectedGateData,
    gatesData,
    gatesLoading,
    gatesError,
    zonesLoading,
    zonesError,
    updateLoading,
    refetchZones,
  } = useZoneManagement();

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    zone: Zone | null;
    action: 'open' | 'close';
  }>({ isOpen: false, zone: null, action: 'open' });

  const [bulkConfirmDialog, setBulkConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'open' | 'close';
    zones: Zone[];
  }>({ isOpen: false, action: 'open', zones: [] });

  const handleStatusToggle = useCallback((zone: Zone) => {
    setConfirmDialog({
      isOpen: true,
      zone,
      action: zone.open ? 'close' : 'open',
    });
  }, []);

  const handleConfirmAction = useCallback(async () => {
    const { zone, action } = confirmDialog;
    if (!zone) return;

    try {
      await actions.handleStatusToggle(zone.id, action === 'open');
    } catch {
      toast.error('Failed to update zone status');
    } finally {
      setConfirmDialog({ isOpen: false, zone: null, action: 'open' });
    }
  }, [confirmDialog, actions]);

  const handleBulkAction = useCallback(
    (action: 'open' | 'close') => {
      const selectedZoneObjects = zones.filter((zone) =>
        state.selectedZones.has(zone.id)
      );
      setBulkConfirmDialog({
        isOpen: true,
        action,
        zones: selectedZoneObjects,
      });
    },
    [zones, state.selectedZones]
  );

  const handleConfirmBulkAction = useCallback(async () => {
    const { action } = bulkConfirmDialog;

    try {
      await actions.handleBulkOperation(action);
    } catch {
      toast.error('Failed to perform bulk action');
    } finally {
      setBulkConfirmDialog({ isOpen: false, action: 'open', zones: [] });
    }
  }, [bulkConfirmDialog, actions]);

  if (gatesLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loading size='lg' />
      </div>
    );
  }

  if (gatesError) {
    return (
      <ErrorComponent
        error={gatesError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <AdminCardLayout
        title='Zone Status Management'
        description='Open or close parking zones for maintenance or capacity control'
        icon={Map}
        iconColor='from-blue-500 to-blue-600'
        headerActions={
          <BulkActions
            selectedCount={state.selectedZones.size}
            onSelectAll={actions.handleSelectAll}
            onBulkOpen={() => handleBulkAction('open')}
            onBulkClose={() => handleBulkAction('close')}
            allSelected={
              state.selectedZones.size === zones.length && zones.length > 0
            }
            hasZones={zones.length > 0}
          />
        }
      >
        <div className='space-y-4 sm:space-y-6'>
          {/* Gate Selection */}
          <GateSelector
            selectedGate={state.selectedGate}
            gates={gatesData || []}
            onGateChange={actions.setSelectedGate}
          />

          {/* Statistics */}
          {state.selectedGate && zones.length > 0 && (
            <ZoneStatistics stats={zoneStats} selectedGate={selectedGateData} />
          )}

          {/* Zones Content */}
          {state.selectedGate && (
            <div>
              {zonesLoading ? (
                <div
                  className='flex items-center justify-center py-8 sm:py-12'
                  role='status'
                  aria-label='Loading zones'
                >
                  <Loading size='lg' />
                </div>
              ) : zonesError ? (
                <ErrorComponent error={zonesError} onRetry={refetchZones} />
              ) : (
                <div className='space-y-4'>
                  {zones.length > 0 && (
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                      <h2 className='font-medium text-gray-900'>
                        {zones.length} zone{zones.length !== 1 ? 's' : ''} found
                        {selectedGateData && ` for ${selectedGateData.name}`}
                      </h2>
                    </div>
                  )}

                  <ZoneGrid
                    zones={zones}
                    selectedZones={state.selectedZones}
                    onZoneSelect={actions.handleZoneSelect}
                    onStatusToggle={handleStatusToggle}
                    isLoading={updateLoading}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </AdminCardLayout>

      {/* Confirmation Dialogs */}
      <ZoneActionConfirmation
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({ isOpen: false, zone: null, action: 'open' })
        }
        onConfirm={handleConfirmAction}
        zone={confirmDialog.zone}
        action={confirmDialog.action}
        isLoading={updateLoading}
      />

      <BulkActionConfirmation
        isOpen={bulkConfirmDialog.isOpen}
        onClose={() =>
          setBulkConfirmDialog({
            isOpen: false,
            action: 'open',
            zones: [],
          })
        }
        onConfirm={handleConfirmBulkAction}
        zones={bulkConfirmDialog.zones}
        action={bulkConfirmDialog.action}
        isLoading={updateLoading}
      />
    </>
  );
};

export default ZoneManagement;
