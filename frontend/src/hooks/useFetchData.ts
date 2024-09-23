import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

// Define a generic type for the custom hook
function useFetchData<T>(queryKey: string[], apiCall: () => Promise<AxiosResponse<T>>): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      const response = await apiCall();
      return response.data; // Ensure that this matches the expected return type
    },
  });
}

export default useFetchData;
