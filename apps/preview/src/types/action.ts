export type ActionResult<T = void> =
    | (T extends void ? { success: true } : { success: true } & T)
    | { success: false; error: string };

export function unwrapAction<T>(result: ActionResult<T>): T {
    if (!result.success) {
        throw new Error(result.error);
    }
    const { success: _success, ...rest } = result as { success: true } & T;
    return rest as T;
}
