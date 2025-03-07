document.addEventListener('DOMContentLoaded', function() {
  // 查找所有引用块
  const blockquotes = document.querySelectorAll('blockquote');
  
  // 为每个引用块添加复制按钮
  blockquotes.forEach(function(blockquote) {
    // 获取引用块内的文本
    let contentToCopy = blockquote.textContent.trim();
    
    // 确保引用块有相对定位以便放置按钮
    if (blockquote.style.position !== 'relative') {
      blockquote.style.position = 'relative';
    }
    
    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.setAttribute('aria-label', '复制内容');
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
    `;
    
    // 将按钮添加到blockquote
    blockquote.appendChild(copyButton);
    
    // 添加点击事件
    copyButton.addEventListener('click', function() {
      // 使用clipboard API复制文本
      navigator.clipboard.writeText(contentToCopy).then(function() {
        // 复制成功，显示反馈
        copyButton.classList.add('success');
        
        // 更改按钮SVG为对勾图标
        copyButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        `;
        
        // 2秒后恢复原状
        setTimeout(function() {
          copyButton.classList.remove('success');
          copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          `;
        }, 2000);
      }).catch(function(error) {
        console.error('复制失败:', error);
      });
    });
  });
});
