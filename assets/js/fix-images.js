document.addEventListener('DOMContentLoaded', function() {
  // 修复图片链接问题
  function fixImagePaths() {
    // 获取所有图片元素
    const images = document.querySelectorAll('img');
    
    images.forEach(function(img) {
      // 检查图片是否已加载
      if (!img.complete || img.naturalHeight === 0) {
        // 获取原始src和alt
        const originalSrc = img.getAttribute('src');
        const altText = img.getAttribute('alt');
        
        // 仅处理_res目录下的图片
        if (originalSrc && originalSrc.includes('_res/')) {
          console.log('修复图片路径:', originalSrc);
          
          // 尝试不同的编码方式
          // 方案1: 根据alt文本构建简化的文件名
          let fixedSrc = '_res/' + encodeURIComponent(altText.split(',')[0].trim()) + '.png';
          
          // 设置一个备用图片，如果修复失败则显示
          img.onerror = function() {
            console.log('图片加载失败:', fixedSrc);
            // 显示图片加载失败提示
            this.onerror = null; // 防止循环触发
            this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="#f8f9fa"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" text-anchor="middle">图片加载失败</text></svg>');
            this.style.border = '1px dashed #ccc';
            this.style.padding = '10px';
          };
          
          // 尝试修复的路径
          img.src = fixedSrc;
        }
      }
    });
  }

  // 延迟执行，确保DOM完全加载
  setTimeout(fixImagePaths, 1000);
  
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
