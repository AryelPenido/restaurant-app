// Address-related types and interfaces

export interface CepApiResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface Address {
  cep: string;
  street: string;
  complement?: string;
  district: string;
  city: string;
  uf: string;
  number?: string;
}

export interface CepServiceResult {
  success: boolean;
  address?: Address;
  error?: string;
}

export enum CepError {
  INVALID_FORMAT = 'CEP deve conter exatamente 8 dígitos',
  NOT_FOUND = 'CEP não encontrado',
  NETWORK_ERROR = 'Erro de conexão. Verifique sua internet',
  INVALID_RESPONSE = 'Resposta inválida do servidor',
}

// Utility function to validate CEP format
export const isValidCepFormat = (cep: string): boolean => {
  const cleanCep = cep.replace(/\D/g, '');
  return cleanCep.length === 8;
};

// Utility function to format CEP
export const formatCep = (cep: string): string => {
  const cleanCep = cep.replace(/\D/g, '');
  return cleanCep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};

// Convert API response to internal Address model
export const mapCepResponseToAddress = (response: CepApiResponse): Address => {
  return {
    cep: response.cep,
    street: response.logradouro,
    complement: response.complemento,
    district: response.bairro,
    city: response.localidade,
    uf: response.uf,
  };
}; 