import { useCallback, useEffect, useReducer } from "react";

const initialState = { status: "loading", data: null, error: null };

function reducer(state, action) {
  switch (action.type) {
    case "success": return { status: "success", data: action.data, error: null };
    case "error":   return { status: "error", data: null, error: action.error };
    default:        return initialState;
  }
}

// Tiny data-fetching hook: loading / success / error states + retry (features 12, 14)
export function useFetch(fetcher, deps = []) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const run = useCallback(() => {
    let alive = true;
    dispatch({ type: "loading" });
    fetcher()
      .then((data) => alive && dispatch({ type: "success", data }))
      .catch((error) => alive && dispatch({ type: "error", error }));
    return () => { alive = false; };
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, retry: run };
}