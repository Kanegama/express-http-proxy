'use strict';

var debug = require('debug')('express-http-proxy');
var url = require("url");
var http = require('http');
var https = require('https');

function resolveProxyReqHost(container) {
    if (container.options.proxyReqHostResolver) {
        return Promise
            .resolve(container.options.proxyReqHostResolver(container.user.req))
            .then(function (resolvedHost) {

                let parsedHost = parseHost(container, resolvedHost);

                container.proxy.reqBuilder.host = parsedHost.host;
                container.proxy.reqBuilder.port = parsedHost.port;
                container.proxy.requestModule = parsedHost.module;

                return Promise.resolve(container);
            });
    }
    return Promise.resolve(container);
}

function parseHost(container, host) {

    if (!host) {
        return new Error('Empty host parameter');
    }

    if (!/http(s)?:\/\//.test(host)) {
        host = 'http://' + host;
    }

    var parsed = url.parse(host);

    if (!parsed.hostname) {
        return new Error('Unable to parse hostname, possibly missing protocol://?');
    }

    var ishttps = container.options.https || parsed.protocol === 'https:';

    return {
        host: parsed.hostname,
        port: parsed.port || (ishttps ? 443 : 80),
        module: ishttps ? https : http,
    };
}

module.exports = resolveProxyReqHost;
