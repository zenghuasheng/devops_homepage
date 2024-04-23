// popup.js
document.addEventListener('DOMContentLoaded', function () {
  // const backgroundConsole = chrome.extension.getBackgroundPage().console;
  let backgroundConsole = console;

  // 发送消息通知background.js获取任务
  chrome.runtime.sendMessage({ action: 'getSprints' }, function (fetchedSprints) {
    const sprintsContainer = document.getElementById('sprintsContainer');
    sprintsContainer.innerHTML = ''; // 清空之前的任务列表

    if (fetchedSprints && Array.isArray(fetchedSprints)) {
      fetchedSprints.forEach(sprint => {
        const sprintDiv = document.createElement('div');
        sprintDiv.classList.add('sprintItem'); // Add a class for styling
        sprintDiv.dataset.sprintinfo = JSON.stringify(sprint); // Store sprint info as a data attribute
        // https://devopsour.ones.pro/#/env?projectUUID=KuZfE9scT2ca5BXF&sprintUUID=HxN3hM66
        // 增加迭代链接，展示 name, 链接url 取 uuid
        sprintDiv.innerHTML = `
            <a href="https://devopsour.ones.pro/#/env?projectUUID=KuZfE9scT2ca5BXF&sprintUUID=${sprint.uuid}" target="_blank">${sprint.name}</a>
          `;
        sprintsContainer.appendChild(sprintDiv);
      });
    } else {
      console.error('Invalid data:', fetchedSprints);
      sprintsContainer.innerHTML = 'Failed to fetch. Please try again.';
    }
  });
});
