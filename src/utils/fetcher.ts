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

  // fetch(url, conf)
  //   .then((response) => {
  //     if (!response.ok) throw response;

  //     const [contentType, contentDisposition] = [
  //       response.headers.get("content-type"),
  //       response.headers.get("content-disposition"),
  //     ];

  // const result =
  //   contentType &&
  //   (contentType?.indexOf("application/json") !== -1 ||
  //     contentType?.indexOf("text/plain") !== -1)
  //     ? response.json()
  //     : contentDisposition?.indexOf("attachment") !== -1
  //     ? response.blob()
  //     : response;

  //   console.log(response);
  //   return response.json();
  // })
  // .catch(async (error) => {
  // const contentType = error.headers.get("content-type");
  // const errResult =
  //   contentType && contentType?.indexOf("application/problem+json") !== -1
  //     ? await error.json()
  //     : error;
  //   console.log("catch", error);
  //   throw error;
  // });

  const [res, error] = await fetch(url, conf).then(
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
