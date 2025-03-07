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
        
        // 添加波纹效果
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        copyButton.appendChild(ripple);
        
        // 动画结束后移除波纹
        ripple.addEventListener('animationend', function() {
          ripple.remove();
        });
        
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
  
  // 优化布局 - 将列表项+引用块+图片组合转换为卡片布局
  function enhanceDocumentStructure() {
    // 找到所有可能包含我们目标模式的列表项
    const documentItems = document.querySelectorAll('.main-content ul > li, .main-content ol > li');
    
    documentItems.forEach(function(item) {
      // 获取列表项的下一个元素
      let nextElement = item.nextElementSibling;
      
      // 检查是否有引用块作为下一个元素
      if (nextElement && nextElement.tagName.toLowerCase() === 'blockquote') {
        const blockquote = nextElement;
        
        // 再检查引用块后是否有图片
        let imageElement = null;
        let imageNextElement = blockquote.nextElementSibling;
        
        if (imageNextElement && 
            (imageNextElement.tagName.toLowerCase() === 'p' && 
             imageNextElement.querySelector('img'))) {
          imageElement = imageNextElement;
        }
        
        // 如果我们找到了完整的模式（列表项+引用块+可选图片），创建卡片
        if (blockquote) {
          // 创建卡片容器
          const card = document.createElement('div');
          card.className = 'description-item';
          
          // 创建一级描述区域
          const primaryDesc = document.createElement('div');
          primaryDesc.className = 'primary-desc';
          primaryDesc.innerHTML = item.innerHTML;
          card.appendChild(primaryDesc);
          
          // 创建二级描述区域（引用块）
          const secondaryDesc = blockquote.cloneNode(true);
          secondaryDesc.className += ' secondary-desc';
          card.appendChild(secondaryDesc);
          
          // 如果有图片，添加图片区域
          if (imageElement) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            imageContainer.innerHTML = imageElement.innerHTML;
            card.appendChild(imageContainer);
          }
          
          // 插入卡片，替换原始元素
          const parentList = item.parentNode;
          parentList.insertBefore(card, item);
          
          // 移除原始元素
          item.remove();
          blockquote.remove();
          if (imageElement) {
            imageElement.remove();
          }
        }
      }
    });
  }
  
  // 如果site.custom.enable_card_layout为true，则启用卡片布局
  if (typeof siteCustomEnableCardLayout !== 'undefined' && siteCustomEnableCardLayout) {
    enhanceDocumentStructure();
  }
});
