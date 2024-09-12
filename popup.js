document.addEventListener('DOMContentLoaded', function() {
  // 加载保存的代理列表
  loadProxyList();

  // 添加代理表单提交事件
  document.getElementById('proxyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addProxy();
  });

  // 应用选中代理按钮点击事件
  document.getElementById('applyProxy').addEventListener('click', applySelectedProxy);
});

function loadProxyList() {
  chrome.storage.sync.get('proxyList', function(data) {
    const proxyList = data.proxyList || [];
    const select = document.getElementById('proxyList');
    select.innerHTML = '';

    // 添加直接连接选项
    const directOption = document.createElement('option');
    directOption.value = 'direct';
    directOption.textContent = '直接连接';
    select.appendChild(directOption);

    proxyList.forEach((proxy, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${proxy.host}:${proxy.port}`;
      select.appendChild(option);
    });
  });
}

function addProxy() {
  const host = document.getElementById('host').value;
  const port = document.getElementById('port').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  chrome.storage.sync.get('proxyList', function(data) {
    const proxyList = data.proxyList || [];
    proxyList.push({ host, port, username, password });
    chrome.storage.sync.set({ proxyList }, function() {
      loadProxyList();
    });
  });
}

function applySelectedProxy() {
  const select = document.getElementById('proxyList');
  const selectedValue = select.value;

  if (selectedValue === 'direct') {
    chrome.runtime.sendMessage({ 
      action: 'applyProxy', 
      proxy: 'direct' 
    });
  } else if (selectedValue !== '') {
    chrome.storage.sync.get('proxyList', function(data) {
      const selectedProxy = data.proxyList[parseInt(selectedValue)];
      chrome.runtime.sendMessage({ 
        action: 'applyProxy', 
        proxy: selectedProxy 
      });
    });
  }
}