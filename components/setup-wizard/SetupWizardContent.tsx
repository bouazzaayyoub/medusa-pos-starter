import { useUpdateSettings } from '@/contexts/settings';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SalesChannelCreationStep } from './SalesChannelCreationStep';
import { SalesChannelSelectionStep } from './SalesChannelSelectionStep';
import { StockLocationCreationStep } from './StockLocationCreationStep';
import { StockLocationSelectionStep } from './StockLocationSelectionStep';
import { WelcomeStep } from './WelcomeStep';

// Step definitions
type SetupStep =
  | 'sales-channel-selection'
  | 'sales-channel-creation'
  | 'stock-location-selection'
  | 'stock-location-creation'
  | 'welcome';

interface SetupWizardContentProps {
  hasSalesChannels: boolean;
  hasStockLocations: boolean;
}

export const SetupWizardContent: React.FC<SetupWizardContentProps> = ({
  hasSalesChannels,
  hasStockLocations,
}) => {
  // Determine initial step based on available data
  const getInitialStep = (): SetupStep => {
    if (!hasSalesChannels) return 'sales-channel-creation';
    if (!hasStockLocations) return 'stock-location-creation';
    return 'sales-channel-selection';
  };

  const [currentStep, setCurrentStep] = useState<SetupStep>(getInitialStep());
  const [salesChannelId, setSalesChannelId] = useState<string>('');
  const [stockLocationId, setStockLocationId] = useState<string>('');

  const updateSettings = useUpdateSettings({
    onSuccess: () => {
      router.replace('/(tabs)/products');
    },
  });

  const handleSalesChannelComplete = (id: string) => {
    setSalesChannelId(id);
    if (!hasStockLocations) {
      setCurrentStep('stock-location-creation');
    } else {
      setCurrentStep('stock-location-selection');
    }
  };

  const handleSalesChannelCreateNew = () => {
    setCurrentStep('sales-channel-creation');
  };

  const handleSalesChannelBackToSelection = () => {
    setCurrentStep('sales-channel-selection');
  };

  const handleStockLocationComplete = (id: string) => {
    setStockLocationId(id);
    setCurrentStep('welcome');
  };

  const handleStockLocationCreateNew = () => {
    setCurrentStep('stock-location-creation');
  };

  const handleStockLocationBackToSelection = () => {
    setCurrentStep('stock-location-selection');
  };

  const handleWelcomeComplete = async () => {
    updateSettings.mutate({
      sales_channel_id: salesChannelId,
      stock_location_id: stockLocationId,
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'sales-channel-selection':
        // Only show selection if there are items to select
        if (!hasSalesChannels) {
          return (
            <SalesChannelCreationStep
              onComplete={handleSalesChannelComplete}
              onBackToSelection={handleSalesChannelBackToSelection}
            />
          );
        }
        return (
          <SalesChannelSelectionStep
            onComplete={handleSalesChannelComplete}
            onCreateNew={handleSalesChannelCreateNew}
            initialValue={salesChannelId}
          />
        );
      case 'sales-channel-creation':
        return (
          <SalesChannelCreationStep
            onComplete={handleSalesChannelComplete}
            onBackToSelection={
              hasSalesChannels ? handleSalesChannelBackToSelection : undefined
            }
          />
        );
      case 'stock-location-selection':
        // Only show selection if there are items to select
        if (!hasStockLocations) {
          return (
            <StockLocationCreationStep
              onComplete={handleStockLocationComplete}
              onBackToSelection={handleStockLocationBackToSelection}
            />
          );
        }
        return (
          <StockLocationSelectionStep
            onComplete={handleStockLocationComplete}
            onCreateNew={handleStockLocationCreateNew}
            initialValue={stockLocationId}
          />
        );
      case 'stock-location-creation':
        return (
          <StockLocationCreationStep
            onComplete={handleStockLocationComplete}
            onBackToSelection={
              hasStockLocations ? handleStockLocationBackToSelection : undefined
            }
          />
        );
      case 'welcome':
        return <WelcomeStep onComplete={handleWelcomeComplete} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 p-5 gap-10">
      {renderCurrentStep()}
    </SafeAreaView>
  );
};
