import { useGetGatesQuery } from '@/api/cruds';
import { useTypedSelector } from '@/api/store/store';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorComponent from '@/components/shared/ErrorComponent';
import { HeroSection } from '@/components/home/HeroSection';
import GatesSection from '@/components/home/GatesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import SystemInfoSection from '@/components/home/SystemInfoSection';

const HomePage = () => {
  const { data, isLoading, error, refetch } = useGetGatesQuery(null);
  const { isAuthenticated, user } = useTypedSelector((state) => state.auth);

  if (isLoading) return <LoadingIndicator text='Loading parking gates...' />;

  if (error) {
    return <ErrorComponent error={error} onRetry={refetch} />;
  }

  const gates = data || [];
  const totalZones = gates.reduce((acc, gate) => acc + gate.zoneIds.length, 0);

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <HeroSection
        isAuthenticated={isAuthenticated}
        user={user}
        gatesCount={gates.length}
        totalZones={totalZones}
      />

      {/* Gates Section */}
      <GatesSection gates={gates} />

      {/* Features Section */}
      <FeaturesSection />

      {/* System Information */}
      <SystemInfoSection />
    </div>
  );
};

export default HomePage;
