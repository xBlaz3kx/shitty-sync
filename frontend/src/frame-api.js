// Worker API code

import SWorker from '@/worker?sharedworker'
const worker = new SWorker()

console.log(worker)

function collectResponses(port, type) {
  return new Promise((resolve) => {
    const responses = []
    const handler = (e) => {
      if (!Array.isArray(e.data)) return
      if (e.data[0] == type) responses.push(e.data)
    }

    port.addEventListener('message', handler)
    port.start()
    setTimeout(() => {
      port.removeEventListener('message', handler)
      resolve(responses)
    }, 10)
  })
}

function switchTab(roomId, type, link, origin) {
  worker.port.postMessage(['setmedia', roomId, type, link, origin])
}

async function getAdminRooms() {
  worker.port.postMessage(['discovery'])
  return (await collectResponses(worker.port, 'alive')).map(([, id]) => id)
}

// UI events
async function query() {
  const listEl = document.getElementById('list')
  const rooms = await getAdminRooms()
  const html = rooms.map((id) => `<li>${id}</li>`).join('\n')
  listEl.innerHTML = html
}

function sendTabSwitch() {
  const args = ['id', 'type', 'link'].map((id) => document.getElementById(id).value)
  switchTab(...args, new URL(window.origin).host)
}

// postMessage API
window.onmessage = async (ev) => {
  const { data, source, origin } = ev

  if (!Array.isArray(data)) return
  switch (data[0]) {
    case 'getrooms': {
      const rooms = await getAdminRooms()
      source.postMessage(['roomsreply', rooms], '*')
      break
    }

    case 'setmedia':
      if (
        typeof data[1] !== 'string' ||
        !['cdn', 'youtube-link'].includes(data[2]) ||
        typeof data[3] !== 'string'
      )
        return
      switchTab(data[1], data[2], data[3], new URL(origin).host)
      break
  }
}

const queryBtn = document.getElementById('querybtn')
queryBtn.addEventListener('click', () => query())

const sendBtn = document.getElementById('sendbtn')
sendBtn.addEventListener('click', () => sendTabSwitch())

worker.port.start()