export interface Result<T> {
    isSuccess: boolean;
    data?: T;
    errors: string[] | null;
}