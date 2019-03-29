"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Request = /** @class */ (function () {
    function Request(apiRoot) {
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
    Request.prototype.setOptions = function (options) {
        this.requestOptions = options;
        return this;
    };
    /**
     * Adds authorization to request headers. By default, uses a Bearer token taken from a "token" cookie.
     *
     * @param {bool|*} override Specify the authorization credentials and type to use. JWT by default.
     */
    Request.prototype.authorize = function (override) {
        // check that a header exists in the current options object.
        if (!this.requestOptions.headers) {
            this.requestOptions.headers = {
                'Content-Type': 'application/json'
            };
        }
        // add the authorization to the request headers
        this.requestOptions.headers.Authorization = override
            ? override
            : "Bearer " + this.getCookie('token');
        return this;
    };
    /**
     * Set the destination and then complete an HTTP request to the API.
     *
     * @param {string} route The API resource/method to access.
     * @param {function} callback Optional: will execute the request immediately if provided.
     */
    Request.prototype.send = function (route, callback) {
        // specify the uri for the api call
        this.route = route;
        var existingHeaders = this.requestOptions.headers;
        var currentOptions = this.requestOptions;
        this.requestOptions = __assign({ headers: __assign({ 'Content-Type': 'application/json' }, existingHeaders) }, currentOptions);
        if (callback) {
            return this.exec(callback);
        }
        return this;
    };
    /**
     * Create an HTTP GET request to the API.
     *
     * @param {string} route The API resource/method to access.
     * @param {function} callback Optional: will execute the request immediately if provided.
     */
    Request.prototype.get = function (route, callback) {
        var currentOptions = this.requestOptions;
        this.requestOptions = __assign({ method: 'GET' }, currentOptions);
        return this.send(route, callback);
    };
    /**
     * Create an HTTP POST request to the API.
     *
     * @param {string} route The API resource/method to access.
     * @param {*} body The data to send in the Request Body.
     * @param {function} callback Optional: will execute the request immediately if provided.
     */
    Request.prototype.post = function (route, body, callback) {
        var currentOptions = this.requestOptions;
        this.requestOptions = __assign({ method: 'POST', body: (function () { return (typeof body === 'string') ? body : JSON.stringify(body); })() }, currentOptions);
        return this.send(route, callback);
    };
    /**
     * Create an HTTP PUT request to the API.
     *
     * @param {string} route The API resource/method to access.
     * @param {*} body The data to send in the Request Body.
     * @param {function} callback Optional: will execute the request immediately if provided.
     */
    Request.prototype.put = function (route, body, callback) {
        var currentOptions = this.requestOptions;
        this.requestOptions = __assign({ method: 'PUT', body: body }, currentOptions);
        return this.send(route, callback);
    };
    /**
     * Create an HTTP DELETE request to the API.
     *
     * @param {string} route The API resource/method to access.
     * @param {*} body The data to send in the Request Body.
     * @param {function} callback Optional: will execute the request immediately if provided.
     */
    Request.prototype.delete = function (route, callback) {
        var currentOptions = this.requestOptions;
        this.requestOptions = __assign({ method: 'DELETE' }, currentOptions);
        return this.send(route, callback);
    };
    /**
     * Execute the request.
     * @param {function} callback
     */
    Request.prototype.exec = function (callback, errorHandler) {
        var _a = this, apiRoot = _a.apiRoot, route = _a.route, requestOptions = _a.requestOptions;
        return fetch(apiRoot + "/" + route, requestOptions).then(function (res) { return res.json(); }).then(function (res) {
            if (res.status === 0) {
                callback(res);
            }
            else if (errorHandler) {
                errorHandler(res);
            }
        });
    };
    Request.prototype.getCookie = function (name) {
        var key = name + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i += 1) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(key) === 0) {
                return c.substring(key.length, c.length);
            }
        }
        return false;
    };
    Request.prototype.setCookie = function (name, value, daysTillExpiration) {
        var d = new Date();
        d.setTime(d.getTime() + (daysTillExpiration * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    };
    return Request;
}());
exports.default = Request;
