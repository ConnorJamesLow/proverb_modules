export default class Request {
    apiRoot: string;
    route: string;
    requestOptions: any;
    constructor(apiRoot: string);
    /**
     * Add options to the request.
     *
     * @param {*} options Request options: Headers, body, etc.
     * @return {Data} This.
     */
    setOptions(options: any): this;
    /**
     * Adds authorization to request headers. By default, uses a Bearer token taken from a "token" cookie.
     *
     * @param {bool|*} override Specify the authorization credentials and type to use. JWT by default.
     */
    authorize(override?: string): this;
    /**
     * Set the destination and then complete an HTTP request to the API.
     *
     * @param {string} route The API resource/method to access.
     * @param {function} callback Optional: will execute the request immediately if provided.
     */
    send(route: string, callback?: (value: any) => any): Promise<void> | this;
    /**
     * Create an HTTP GET request to the API.
     *
     * @param {string} route The API resource/method to access.
     * @param {function} callback Optional: will execute the request immediately if provided.
     */
    get(route: string, callback?: (value: any) => any): Promise<void> | this;
    /**
     * Create an HTTP POST request to the API.
     *
     * @param {string} route The API resource/method to access.
     * @param {*} body The data to send in the Request Body.
     * @param {function} callback Optional: will execute the request immediately if provided.
     */
    post(route: string, body: any, callback?: (value: any) => any): Promise<void> | this;
    /**
     * Create an HTTP PUT request to the API.
     *
     * @param {string} route The API resource/method to access.
     * @param {*} body The data to send in the Request Body.
     * @param {function} callback Optional: will execute the request immediately if provided.
     */
    put(route: string, body: any, callback?: (value: any) => any): Promise<void> | this;
    /**
     * Create an HTTP DELETE request to the API.
     *
     * @param {string} route The API resource/method to access.
     * @param {*} body The data to send in the Request Body.
     * @param {function} callback Optional: will execute the request immediately if provided.
     */
    delete(route: string, callback?: (value: any) => any): Promise<void> | this;
    /**
     * Execute the request.
     * @param {function} callback
     */
    exec(callback: (value: any) => any, errorHandler?: (value: any) => any): Promise<void>;
    getCookie(name: string): string | false;
    setCookie(name: string, value: string, daysTillExpiration: number): void;
}
