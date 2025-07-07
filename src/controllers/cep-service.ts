// CEP Service - Clean Architecture Service Layer

import { 
  CepApiResponse, 
  CepServiceResult, 
  CepError, 
  isValidCepFormat, 
  mapCepResponseToAddress 
} from '../model/address';

export class CepService {
  private static readonly BASE_URL = 'https://viacep.com.br/ws';
  private static readonly TIMEOUT = 5000; // 5 seconds timeout

  /**
   * Fetches address information from CEP API
   * @param cep - Brazilian postal code (CEP)
   * @returns Promise with service result containing address or error
   */
  static async fetchAddressByCep(cep: string): Promise<CepServiceResult> {
    try {
      // Validate CEP format
      if (!isValidCepFormat(cep)) {
        return {
          success: false,
          error: CepError.INVALID_FORMAT,
        };
      }

      // Clean CEP (remove any non-digit characters)
      const cleanCep = cep.replace(/\D/g, '');

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      // Make API request
      const response = await fetch(`${this.BASE_URL}/${cleanCep}/json/`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Clear timeout
      clearTimeout(timeoutId);

      // Check if response is ok
      if (!response.ok) {
        return {
          success: false,
          error: CepError.NETWORK_ERROR,
        };
      }

      // Parse response
      const data: CepApiResponse = await response.json();

      // Check if CEP was found
      if (data.erro) {
        return {
          success: false,
          error: CepError.NOT_FOUND,
        };
      }

      // Validate response data
      if (!this.isValidCepResponse(data)) {
        return {
          success: false,
          error: CepError.INVALID_RESPONSE,
        };
      }

      // Convert to internal Address model
      const address = mapCepResponseToAddress(data);

      return {
        success: true,
        address,
      };

    } catch (error) {
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: CepError.NETWORK_ERROR,
          };
        }
      }

      return {
        success: false,
        error: CepError.NETWORK_ERROR,
      };
    }
  }

  /**
   * Validates if the CEP API response contains required fields
   * @param data - API response data
   * @returns boolean indicating if response is valid
   */
  private static isValidCepResponse(data: CepApiResponse): boolean {
    return !!(
      data.cep &&
      data.logradouro &&
      data.bairro &&
      data.localidade &&
      data.uf
    );
  }

  /**
   * Batch fetch multiple CEPs (utility method for future use)
   * @param ceps - Array of CEP strings
   * @returns Promise with array of service results
   */
  static async fetchMultipleCeps(ceps: string[]): Promise<CepServiceResult[]> {
    const promises = ceps.map(cep => this.fetchAddressByCep(cep));
    return Promise.all(promises);
  }
} 