export interface ApiResponse<T = unknown> {
    status: 'success' | 'error';
    message?: string;
    data?: T;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
    get: <T = unknown>(url: string): Promise<ApiResponse<T>> =>
        fetch(`${BASE_URL}${url}`, {
            credentials: 'include',
        }).then(res => res.json()),

    post: <T = unknown>(url: string, body?: unknown): Promise<ApiResponse<T>> =>
        fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
        }).then(res => res.json()),

    patch: <T = unknown>(url: string, body?: unknown): Promise<ApiResponse<T>> =>
        fetch(`${BASE_URL}${url}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
        }).then(res => res.json()),

    delete: <T = unknown>(url: string): Promise<ApiResponse<T>> =>
        fetch(`${BASE_URL}${url}`, {
            method: 'DELETE',
            credentials: 'include',
        }).then(res => res.json()),

    upload: <T = unknown>(url: string, formData: FormData): Promise<ApiResponse<T>> =>
        fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        }).then(res => res.json()),

    uploadPatch: <T = unknown>(url: string, formData: FormData): Promise<ApiResponse<T>> =>
        fetch(`${BASE_URL}${url}`, {
            method: 'PATCH',
            credentials: 'include',
            body: formData,
        }).then(res => res.json()),
};