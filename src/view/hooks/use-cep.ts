import React, { useState, useCallback } from 'react';
import { CepService } from '../../controllers/cep-service';
import { Address, CepServiceResult } from '../../model/address';

export interface UseCepReturn {
  address: Address | null;
  loading: boolean;
  error: string | null;
  fetchAddress: (cep: string) => Promise<void>;
  clearAddress: () => void;
  clearError: () => void;
}

/**
 * Custom hook for CEP integration
 * Provides state management and actions for CEP lookup
 */
export const useCep = (): UseCepReturn => {
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches address information by CEP
   * @param cep - Brazilian postal code
   */
  const fetchAddress = useCallback(async (cep: string): Promise<void> => {
    // Clear previous states
    setError(null);
    setAddress(null);
    setLoading(true);

    try {
      const result: CepServiceResult = await CepService.fetchAddressByCep(cep);
      if (result.success && result.address) {
        setAddress(result.address);
      } else {
        setError(result.error || 'Erro desconhecido');
      }
    } catch (err) {
      setError('Erro inesperado ao buscar CEP');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clears the current address data
   */
  const clearAddress = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    address,
    loading,
    error,
    fetchAddress,
    clearAddress,
    clearError,
  };
};

/**
 * Hook for CEP with auto-fetch functionality
 * Automatically fetches address when CEP changes and is valid
 */
export const useCepAutoFetch = (cep: string, enabled: boolean = true): UseCepReturn => {
  const cepHook = useCep();

  // Auto-fetch when CEP changes and is valid
  React.useEffect(() => {
    if (enabled && cep && cep.replace(/\D/g, '').length === 8) {
      cepHook.fetchAddress(cep);
    } else {
      cepHook.clearAddress();
    }
  }, [cep, enabled, cepHook.fetchAddress, cepHook.clearAddress]);

  return cepHook;
};

 