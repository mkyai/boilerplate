/*eslint-disable*/
let isReloadRequest;
function displayForm(bool) {
  isReloadRequest = bool;
  document.getElementById('overlay').style.display = 'block';
}

function closeForm() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('password').value = '';
}

async function getLogs() {
  const location = window.location.href;
  const password = document.getElementById('password').value;
  if (!password) {
    window.alert('Password required');

    return;
  }

  closeForm();
  try {
    const rawResponse = await fetch(`${location}api/logs`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    const response = await rawResponse.json();
    if (response && response.status == '422') {
      window.alert('UNAUTHORIZED\nInvalid Password');

      return;
    }

    if (response.data) {
      document.getElementById('table-content').style.display = 'none';
      document.getElementById('log-content').style.display = 'block';
      const logsContainer = document.getElementById('logs');
      response.data.split('\n').map((res) => {
        const log = document.createTextNode(res);
        const div = document.createElement('div');
        div.className = 'errors er-logs';
        div.appendChild(log);
        logsContainer.appendChild(div);
      });
    }
  } catch {
    setTimeout(function () {
      window.location.reload(true);
    }, 2000);
  }
}

function back() {
  window.location.reload();
}

async function reloadServer() {
  const location = window.location.href;
  const password = document.getElementById('password').value;
  if (!password) {
    window.alert('Password required');

    return;
  }

  closeForm();
  try {
    const rawResponse = await fetch(`${location}api/reload`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    setTimeout(async function () {
      await fetch(`${location}api/reload`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
    }, 1000);

    const response = await rawResponse.json();
    if (response && response.status === '422') {
      window.alert('UNAUTHORIZED\nInvalid Password');
    }
  } catch {
    setTimeout(function () {
      window.location.reload(true);
    }, 5000);
  }
}
