type State = { ids: number[]; refreshedAt: number }

export const createItemCache = (ttlMs: number, staleMs: number) => {
  let state: State | null = null
  return {
    set(ids: number[], refreshedAt: number) {
      state = { ids, refreshedAt }
    },
    snapshot() {
      return state
    },
    get(now: number) {
      if (!state) return null
      const age = now - state.refreshedAt
      if (age <= ttlMs) return { state: 'fresh' as const, ids: state.ids }
      if (age <= staleMs) return { state: 'stale' as const, ids: state.ids, refreshNeeded: true }
      return null
    },
  }
}
