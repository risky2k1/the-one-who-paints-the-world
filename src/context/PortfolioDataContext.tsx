'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DESTINATIONS, PORTFOLIO_DATA } from '../data/portfolio';
import { fetchPortfolioData } from '../lib/api/portfolioApi';
import {
  DestinationConfig,
  DestinationId,
  PortfolioData,
} from '../types/portfolio';

export interface PortfolioDataContextType {
  portfolioData: PortfolioData;
  destinations: DestinationConfig[];
  getDestinationById: (id: DestinationId) => DestinationConfig;
  isLive: boolean;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const PortfolioDataContext = createContext<PortfolioDataContextType>({
  portfolioData: PORTFOLIO_DATA,
  destinations: DESTINATIONS,
  getDestinationById: (id: DestinationId) =>
    DESTINATIONS.find((d) => d.id === id) || DESTINATIONS[0],
  isLive: false,
  isLoading: false,
  refreshData: async () => {},
});

export interface PortfolioDataProviderProps {
  initialData?: PortfolioData;
  initialIsLive?: boolean;
  children: React.ReactNode;
}

export const PortfolioDataProvider: React.FC<PortfolioDataProviderProps> = ({
  initialData = PORTFOLIO_DATA,
  initialIsLive = false,
  children,
}) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialData);
  const [destinations, setDestinations] = useState<DestinationConfig[]>(
    initialData.destinations && initialData.destinations.length > 0
      ? initialData.destinations
      : DESTINATIONS
  );
  const [isLive, setIsLive] = useState<boolean>(initialIsLive);
  const [isLoading, setIsLoading] = useState<boolean>(!initialIsLive);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchPortfolioData();
      setPortfolioData(res.data);
      if (res.data.destinations && res.data.destinations.length > 0) {
        setDestinations(res.data.destinations);
      }
      setIsLive(res.isLive);
    } catch {
      // Graceful fallback to initialData
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const getDestinationById = useCallback(
    (id: DestinationId): DestinationConfig => {
      const found = destinations.find((d) => d.id === id);
      return found || destinations[0] || DESTINATIONS[0];
    },
    [destinations]
  );

  return (
    <PortfolioDataContext.Provider
      value={{
        portfolioData,
        destinations,
        getDestinationById,
        isLive,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

export function usePortfolioData(): PortfolioDataContextType {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error(
      'usePortfolioData must be used within a PortfolioDataProvider'
    );
  }
  return context;
}

