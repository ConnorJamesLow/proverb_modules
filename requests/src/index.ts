export default class Request {
  apiRoot: string;
  route: string;
  requestOptions: any;

  constructor(apiRoot: string) {
    this.apiRoot = apiRoot;
    this.requestOptions = {};
    this.route = '';
  }

  /**
   * Add options to the request.
   * 
   * @param {*} options Request options: Headers, body, etc.
   * @return {Data} This.
   */
  setOptions(options: any) {
    this.requestOptions = options;
    return this;
  }

  /**
   * Adds authorization to request headers. By default, uses a Bearer token taken from a "token" cookie.
   * 
   * @param {bool|*} override Specify the authorization credentials and type to use. JWT by default.
   */
  authorize(override?: string) {

    // check that a header exists in the current options object.
    if (!this.requestOptions.headers) {
      this.requestOptions.headers = {
        'Content-Type': 'application/json'
      };
    }

    // add the authorization to the request headers
    this.requestOptions.headers.Authorization = override
      ? override
      : `Bearer ${this.getCookie('token')}`;
    return this;
  }

  /**
   * Set the destination and then complete an HTTP request to the API.
   *
   * @param {string} route The API resource/method to access.
   * @param {function} callback Optional: will execute the request immediately if provided.
   */
  send(route: string, callback?: (value: any) => any) {

    // specify the uri for the api call
    this.route = route;
    const { headers: existingHeaders } = this.requestOptions
    const { requestOptions: currentOptions } = this;
    this.requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...existingHeaders
      },
      ...currentOptions
    }
    if (callback) {
      return this.exec(callback);
    }
    return this;
  }

  /**
   * Create an HTTP GET request to the API.
   *
   * @param {string} route The API resource/method to access.
   * @param {function} callback Optional: will execute the request immediately if provided.
   */
  get(route: string, callback?: (value: any) => any) {
    const { requestOptions: currentOptions } = this;
    this.requestOptions = {
      method: 'GET',
      ...currentOptions
    }
    return this.send(route, callback);
  }

  /**
   * Create an HTTP POST request to the API.
   *
   * @param {string} route The API resource/method to access.
   * @param {*} body The data to send in the Request Body.
   * @param {function} callback Optional: will execute the request immediately if provided.
   */
  post(route: string, body: any, callback?: (value: any) => any) {
    const { requestOptions: currentOptions } = this;
    this.requestOptions = {
      method: 'POST',
      body: (() => (typeof body === 'string') ? body : JSON.stringify(body))(),
      ...currentOptions
    }
    return this.send(route, callback);
  }

  /**
   * Create an HTTP PUT request to the API.
   *
   * @param {string} route The API resource/method to access.
   * @param {*} body The data to send in the Request Body.
   * @param {function} callback Optional: will execute the request immediately if provided.
   */
  put(route: string, body: any, callback?: (value: any) => any) {
    const { requestOptions: currentOptions } = this;
    this.requestOptions = {
      method: 'PUT',
      body,
      ...currentOptions
    }
    return this.send(route, callback);
  }

  /**
   * Create an HTTP DELETE request to the API.
   *
   * @param {string} route The API resource/method to access.
   * @param {*} body The data to send in the Request Body.
   * @param {function} callback Optional: will execute the request immediately if provided.
   */
  delete(route: string, callback?: (value: any) => any) {
    const { requestOptions: currentOptions } = this;
    this.requestOptions = {
      method: 'DELETE',
      ...currentOptions
    }
    return this.send(route, callback);
  }

  /**
   * Execute the request.
   * @param {function} callback 
   */
  exec(callback: (value: any) => any, errorHandler?: (value: any) => any) {
    const { apiRoot, route, requestOptions } = this;
    return fetch(`${apiRoot}/${route}`, requestOptions).then(res => res.json()).then((res) => {
      if (res.status === 0) {
        callback(res);
      } else if (errorHandler) {
        errorHandler(res);
      }
    });
  }

  getCookie(name: string) {
    const key = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(key) === 0) {
        return c.substring(key.length, c.length);
      }
    }
    return false;
  }

  setCookie(name: string, value: string, daysTillExpiration: number) {
    const d = new Date();
    d.setTime(d.getTime() + (daysTillExpiration * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }
}