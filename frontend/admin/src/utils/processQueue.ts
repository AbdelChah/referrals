let failedQueue: any[] = [];

export const processQueue = (error: any, token: string | null = null, accessToken: any) => {
    failedQueue.forEach((prom) => {
      if (token) {
        prom.resolve(token);
      } else {
        prom.reject(error);
      }
    });
    failedQueue = [];
  };