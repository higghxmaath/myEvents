import { useEffect, useState } from "react";

export default function useFetch(asyncFn) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    asyncFn()
      .then((res) => {
        if (!ignore) {
          setData(res);
          setError(null); 
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => (ignore = true);
  }, [asyncFn]);

  return { data, loading, error };
}
