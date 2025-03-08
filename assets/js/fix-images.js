document.addEventListener('DOMContentLoaded', function() {
  // 修复图片链接问题
  function fixImagePaths() {
    // 获取所有图片元素
    const images = document.querySelectorAll('img');
    
    // 记录已处理过的图片，避免重复处理
    const processedImages = new Set();
    
    // 为每个图片添加加载状态标记
    images.forEach(function(img) {
      if (processedImages.has(img)) return;
      
      const originalSrc = img.getAttribute('src');
      // 仅处理_res目录下的图片
      if (originalSrc && originalSrc.includes('_res/')) {
        processedImages.add(img);
        
        // 标记图片状态
        img.setAttribute('data-loading-status', 'pending');
        
        // 设置较长的加载超时时间
        const loadTimeout = setTimeout(function() {
          // 只有在图片仍在加载且没有成功的情况下才尝试修复
          if ((!img.complete || img.naturalHeight === 0) && img.getAttribute('data-loading-status') === 'pending') {
            attemptImageFix(img);
          }
        }, 8000); // 延长到8秒，给网络加载更多时间
        
        // 图片加载成功时清除超时并标记状态
        img.onload = function() {
          clearTimeout(loadTimeout);
          img.setAttribute('data-loading-status', 'loaded');
          // 添加成功加载的类，可用于样式处理
          img.classList.add('image-loaded');
        };
        
        // 图片加载失败时尝试修复
        img.onerror = function() {
          clearTimeout(loadTimeout);
          // 只有在状态为pending时才尝试修复，避免重复处理
          if (img.getAttribute('data-loading-status') === 'pending') {
            attemptImageFix(img);
          }
        };
      }
    });
  }
  
  // 尝试修复图片加载问题
  function attemptImageFix(img) {
    // 获取原始路径和alt文本
    const originalSrc = img.getAttribute('src');
    const altText = img.getAttribute('alt') || '图片';
    console.log('尝试修复图片:', originalSrc);
    
    // 标记为正在尝试修复
    img.setAttribute('data-loading-status', 'fixing');
    
    // 添加重试按钮UI
    const imgParent = img.parentNode;
    const retryWrapper = document.createElement('div');
    retryWrapper.className = 'image-retry-wrapper';
    retryWrapper.innerHTML = `
      <div class="image-error">
        <div class="image-error-icon">&#9888;</div>
        <div class="image-error-text">图片加载中断</div>
        <div class="image-error-filename">${altText}</div>
        <button class="retry-button">重试加载</button>
      </div>
    `;
    
    // 替换图片为重试UI
    imgParent.replaceChild(retryWrapper, img);
    
    // 添加重试按钮事件
    const retryButton = retryWrapper.querySelector('.retry-button');
    retryButton.addEventListener('click', function() {
      // 更改状态提示
      const errorText = retryWrapper.querySelector('.image-error-text');
      errorText.textContent = '正在重新加载...';
      
      // 准备新的图片元素
      const newImg = document.createElement('img');
      newImg.alt = altText;
      
      // 尝试不同的编码方式创建修复后的URL
      let fixedSrc = '';
      
      // 方案1: 使用原始路径但重新加载
      if (originalSrc.includes('_res/')) {
        fixedSrc = originalSrc + '?t=' + new Date().getTime(); // 添加时间戳避免缓存
      }
      
      // 方案2: 根据alt文本构建简化文件名
      if (!fixedSrc || retryButton.getAttribute('data-retry-count') > 0) {
        fixedSrc = '_res/' + encodeURIComponent(altText.split(',')[0].trim()) + '.png';
      }
      
      // 设置重试计数
      const retryCount = parseInt(retryButton.getAttribute('data-retry-count') || '0');
      retryButton.setAttribute('data-retry-count', (retryCount + 1).toString());
      
      // 设置新图片的加载和错误处理
      newImg.onload = function() {
        retryWrapper.parentNode.replaceChild(newImg, retryWrapper);
        newImg.classList.add('image-loaded');
      };
      
      newImg.onerror = function() {
        errorText.textContent = '图片加载失败';
        retryButton.textContent = '再次重试';
        // 如果重试次数超过3次，提供更多信息
        if (retryCount >= 3) {
          const infoElement = document.createElement('div');
          infoElement.className = 'image-error-help';
          infoElement.textContent = '多次重试失败，可能是网络问题或图片不存在';
          retryWrapper.querySelector('.image-error').appendChild(infoElement);
        }
      };
      
      // 设置src开始加载
      newImg.src = fixedSrc;
    });
  }

  // 延迟执行，确保DOM完全加载
  setTimeout(fixImagePaths, 3000); // 延迟3秒，给初始加载更多时间
  
  // 添加页面加载指示器
  function addPageLoadIndicator() {
    const loadIndicator = document.createElement('div');
    loadIndicator.className = 'page-load-indicator';
    loadIndicator.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-text">正在加载图片资源，请稍候...</div>
    `;
    document.body.appendChild(loadIndicator);
    
    // 当所有图片都加载完成或者超时后隐藏指示器
    const hideTimeout = setTimeout(() => {
      loadIndicator.style.opacity = '0';
      setTimeout(() => loadIndicator.remove(), 1000);
    }, 15000); // 15秒后无论如何都隐藏
    
    // 监听所有图片加载完成
    window.addEventListener('load', function() {
      clearTimeout(hideTimeout);
      loadIndicator.style.opacity = '0';
      setTimeout(() => loadIndicator.remove(), 1000);
    });
  }
  
  // 图片加载状态检查
  function checkAllImagesStatus() {
    const images = document.querySelectorAll('img');
    const totalImages = images.length;
    let loadedImages = 0;
    
    images.forEach(img => {
      if (img.complete) loadedImages++;
    });
    
    const loadingProgress = document.querySelector('.loading-text');
    if (loadingProgress) {
      loadingProgress.textContent = `正在加载图片资源 (${loadedImages}/${totalImages})`;
    }
    
    // 继续检查直到所有图片加载完成
    if (loadedImages < totalImages) {
      setTimeout(checkAllImagesStatus, 500);
    }
  }
  
  // 添加加载指示器并开始检查
  addPageLoadIndicator();
  setTimeout(checkAllImagesStatus, 1000);
  
  // 添加一个图片预览功能
  function addImagePreviewFeature() {
    const images = document.querySelectorAll('.main-content img');
    
    images.forEach(function(img) {
      // 创建一个包装器
      const wrapper = document.createElement('div');
      wrapper.className = 'image-preview-wrapper';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      
      // 添加点击放大功能
      img.addEventListener('click', function() {
        const modal = document.createElement('div');
        modal.className = 'image-preview-modal';
        modal.innerHTML = `
          <div class="modal-content">
            <span class="close-button">&times;</span>
            <img src="${this.src}" alt="${this.alt}">
            <p class="image-filename">${this.alt}</p>
          </div>
        `;
        document.body.appendChild(modal);
        
        // 添加关闭模态框功能
        modal.querySelector('.close-button').addEventListener('click', function() {
          document.body.removeChild(modal);
        });
        
        // 点击模态框背景关闭
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            document.body.removeChild(modal);
          }
        });
      });
    });
  }
  
  // 添加相关的CSS样式
  function addImageStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .image-preview-wrapper {
        position: relative;
        margin: 1.8rem 0;
        display: inline-block;
      }
      
      .main-content img {
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      
      .main-content img:hover {
        transform: scale(1.02);
      }
      
      .image-preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      
      .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
      }
      
      .modal-content img {
        max-width: 100%;
        max-height: 80vh;
        border-radius: 5px;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      }
      
      .close-button {
        position: absolute;
        top: -30px;
        right: 0;
        color: white;
        font-size: 28px;
        cursor: pointer;
      }
      
      .image-filename {
        color: white;
        text-align: center;
        margin-top: 10px;
        font-family: monospace;
        word-break: break-all;
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  // 执行图片预览功能和样式添加
  addImageStyles();
  setTimeout(addImagePreviewFeature, 1500); // 延迟执行，确保图片已加载
});
