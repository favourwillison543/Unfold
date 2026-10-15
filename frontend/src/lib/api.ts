import { http } from "./http";

export const post = async <TResponse, TBody = undefined>(
  url: string,
  body?: TBody
): Promise<TResponse> => {
  const response = await http.post(url, body);
  return response.data;
};

export const get = async <TResponse>(
  url: string
): Promise<TResponse> => {
  try {
    const response = await http.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patch = async <TResponse, TBody = undefined>(
  url: string,
  body?: TBody
): Promise<TResponse> => {
  const response = await http.patch(url, body);
  return response.data;
};

export const del = async <TResponse = void>(
  url: string
): Promise<TResponse> => {
  const response = await http.delete(url);
  return response.data;
};