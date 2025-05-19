const API_URL = "http://localhost:8000"

interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export async function postData<T, R>(url: string, data: T): Promise<R> {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();
      throw new Error(Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message || `Error ${response.status}`);
    }
    return response.json() as Promise<R>;
  } catch (error) {
    console.error('API call failed:', error);
    throw new Error(formatErrorMessage(error));
  }
}

function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocorreu um erro desconhecido na comunicação com o servidor';
}