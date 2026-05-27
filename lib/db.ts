type QueryParams = Record<string, unknown>

export const db = {
  async query<T>(operation: string, params?: QueryParams): Promise<T> {
    void params

    // Replace this adapter with Drizzle queries after schemas are defined.
    throw new Error(`Database operation not implemented: ${operation}`)
  },
}
