const baseUrl = `http://127.0.0.1:${true ? "8080/dashboard" : "8888/api"}`;

const defaults = {
  mode: "cors" as const,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const fetcher = async (url: string, config: any = null) => {
  const conf = config
    ? { ...defaults, ...config }
    : { ...defaults, method: "GET" };

  const [res, error] = await fetch(baseUrl + url, conf).then(
    (data) => [data, null],
    (err) => [null, err],
  );
  if (!error) {
    return await res.json();
  } else {
    console.log(error);
  }
};

export default fetcher;
