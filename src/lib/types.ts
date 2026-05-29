// Contains types that we'll use when doing CRUD-operations.
// How to use:
// To specify the correct return type for a CRUD function,
// you write like this:
//
// async function example(): Promise<Result<[data type to be used]>> {
//     const data = "testestest";
//     return C;
// }
// If there was an error, you return { success: false, error: "error message" }.
// When we do CRUD-operations that doesn't fetch any data, you can leave it out
// and just write return { success: true }

type SuccessResult<T> = {
    success: true;
    data: T;
};

type ErrorResult<T = string> = {
    success: false;
    error: T;
};

type Result<TData, TError = string> = SuccessResult<TData> | ErrorResult<TError>;

export type { SuccessResult, ErrorResult, Result };
