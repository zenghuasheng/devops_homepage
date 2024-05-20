// popup.js
document.addEventListener('DOMContentLoaded', function () {
  // const backgroundConsole = chrome.extension.getBackgroundPage().console;
  let backgroundConsole = console;

  // projectUUID, 从 input 中获取
  const projectUUID = document.getElementById('projectUUID');

  // 从 localStorage 中获取 projectUUID 的值
    projectUUID.value = localStorage.getItem('projectUUID') || 'KuZfE9scT2ca5BXF';

  getAndShowSprints(projectUUID.value);

  // 增加监听事件，当输入框内容变化时，重新获取迭代
    projectUUID.addEventListener('input', function () {
        getAndShowSprints(projectUUID.value);
        // 把当前输入框的值存储到 localStorage 中
        localStorage.setItem('projectUUID', projectUUID.value);
    });

  function getAndShowSprints(project) {
      // 发送消息通知background.js获取任务
      chrome.runtime.sendMessage({ action: 'getSprints', project: project }, function (fetchedSprints) {
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
            <a href="https://devopsour.ones.pro/#/env?projectUUID=${sprint.project.uuid}&sprintUUID=${sprint.uuid}" target="_blank">${sprint.name}</a>
          `;
                  sprintsContainer.appendChild(sprintDiv);
              });
          } else {
              console.error('Invalid data:', fetchedSprints);
              sprintsContainer.innerHTML = 'Failed to fetch. Please try again.';
          }
      });
  }
});
