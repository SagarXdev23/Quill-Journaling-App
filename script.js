// script.js
const chatBtn = document.querySelector('.chat-container');
let chatBox;

chatBtn.addEventListener('click', () => {
  // If popup already exists, remove it
  if (chatBox) {
    chatBox.remove();
    chatBox = null;
    return;
  }

  // Otherwise create popup
  chatBox = document.createElement('div');
  chatBox.className = 'chat-box';
  chatBox.innerHTML = `
    <div class="chat-header">
      Chat <span class="close-btn">&times;</span>
    </div>
    <div class="chat-body">
      <p>Chat feature coming soon...</p>
    </div>
  `;
  document.body.appendChild(chatBox);

  // Close button inside chat
  chatBox.querySelector('.close-btn').addEventListener('click', () => {
    chatBox.remove();
    chatBox = null;
  });
});
