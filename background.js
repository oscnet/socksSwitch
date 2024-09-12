chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'applyProxy') {
    if (request.proxy === 'direct') {
      // 直接连接，不使用代理
      chrome.proxy.settings.clear({ scope: 'regular' }, function() {
        console.log('已清除代理设置，使用直接连接');
      });
    } else {
      const { host, port, username, password } = request.proxy;
      const config = {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme: "socks5",
            host: host,
            port: parseInt(port)
          },
          bypassList: ["localhost"]
        }
      };

      chrome.proxy.settings.set(
        { value: config, scope: 'regular' },
        function() {
          console.log('代理已应用');
        }
      );

      if (username && password) {
        chrome.webRequest.onAuthRequired.addListener(
          function authListener(details) {
            if (details.isProxy) {
              chrome.webRequest.onAuthRequired.removeListener(authListener);
              return {
                authCredentials: { username: username, password: password }
              };
            }
          },
          { urls: ["<all_urls>"] },
          ["blocking"]
        );
      }
    }
  }
});