'use strict';

function defaultDecorator(proxyReqOptBuilder /*, userReq */) {
  return proxyReqOptBuilder;
}

function postDecorateProxyReqOpts(container) {
  var resolverFn = container.options.proxyReqOptPostDecorator || defaultDecorator;

  return Promise
    .resolve(resolverFn(container.proxy.reqBuilder, container.proxy.bodyContent, container.user.req))
    .then(function(processedReqOpts) {
        delete processedReqOpts.params;
        container.proxy.reqBuilder = processedReqOpts;
        return Promise.resolve(container);
    });
}

module.exports = postDecorateProxyReqOpts;
