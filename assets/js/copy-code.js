document.addEventListener('DOMContentLoaded', function() {
  // 查找所有引用块中的代码
  const codeBlocks = document.querySelectorAll('blockquote code');
  
  // 为每个代码块添加复制按钮
  codeBlocks.forEach(function(codeBlock) {
    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.setAttribute('aria-label', '复制代码');
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
    `;
    
    // 确保blockquote有相对定位以便放置按钮
    const blockquote = codeBlock.closest('blockquote');
    if (blockquote.style.position !== 'relative') {
      blockquote.style.position = 'relative';
    }
    
    // 将按钮添加到blockquote而不是code
    blockquote.appendChild(copyButton);
    
    // 添加点击事件
    copyButton.addEventListener('click', function() {
      // 获取代码文本
      const codeText = codeBlock.textContent;
      
      // 使用clipboard API复制文本
      navigator.clipboard.writeText(codeText).then(function() {
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
  
  // 可选：将您特定结构转换为卡片布局
  function createCardLayout() {
    // 查找模式：h2/h3 后跟列表项、引用和图片
    const headings = document.querySelectorAll('h2, h3');
    
    headings.forEach(heading => {
      let currentElement = heading.nextElementSibling;
      
      // 处理每个标题下的内容块
      while (currentElement && !currentElement.matches('h2, h3')) {
        // 检查是否符合我们的模式：列表项 -> 引用块 -> 图片
        if (currentElement.matches('ul, ol')) {
          const listItems = currentElement.querySelectorAll('li');
          
          listItems.forEach(listItem => {
            // 获取列表项内的第一个元素（一级描述）
            let primaryDesc = listItem.innerHTML;
            
            // 看看是否有blockquote作为下一个兄弟元素
            let sibling = listItem.nextElementSibling;
            let blockquote = null;
            let image = null;
            
            if (sibling && sibling.matches('blockquote')) {
              blockquote = sibling;
              
              // 再看下一个是否是图片
              sibling = blockquote.nextElementSibling;
              if (sibling && sibling.querySelector('img')) {
                image = sibling;
              }
            }
            
            // 如果找到了完整的模式，创建卡片
            if (blockquote) {
              // 创建卡片容器
              const card = document.createElement('div');
              card.className = 'description-card';
              
              // 添加一级描述
              const primarySection = document.createElement('div');
              primarySection.className = 'primary-desc';
              primarySection.innerHTML = primaryDesc;
              card.appendChild(primarySection);
              
              // 添加二级描述
              card.appendChild(blockquote.cloneNode(true));
              
              // 如果有图片，添加图片
              if (image) {
                const imageSection = document.createElement('div');
                imageSection.className = 'card-image';
                imageSection.innerHTML = image.innerHTML;
                card.appendChild(imageSection);
              }
              
              // 替换原始元素
              listItem.parentNode.insertBefore(card, listItem);
              listItem.remove();
              if (blockquote) blockquote.remove();
              if (image) image.remove();
            }
          });
        }
        
        currentElement = currentElement.nextElementSibling;
      }
    });
  }
  
  // 如果您希望启用卡片布局，取消下面这行的注释
  // createCardLayout();
});
