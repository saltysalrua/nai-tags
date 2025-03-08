document.addEventListener("DOMContentLoaded", function() {
  // 修复所有图片链接
  function fixImagePaths() {
    // 获取所有图片元素
    const images = document.querySelectorAll("img");
    
    images.forEach(function(img) {
      const src = img.getAttribute("src");
      
      // 只处理_res目录下的图片
      if (src && src.includes("_res/")) {
        // 对URL进行编码，但保留路径分隔符"/"
        const parts = src.split("/");
        
        // 编码最后一部分（文件名）
        if (parts.length > 0) {
          const filename = parts[parts.length - 1];
          // 重要：只对文件名进行编码，保持目录结构不变
          const encodedFilename = encodeURIComponent(filename)
            // 修复编码后的括号，GitHub Pages可能对某些字符处理特殊
            .replace(/\(/g, "%28")
            .replace(/\)/g, "%29")
            .replace(/\[/g, "%5B")
            .replace(/\]/g, "%5D")
            .replace(/\'/g, "%27")
            .replace(/\*/g, "%2A")
            .replace(/,/g, "%2C");
          
          parts[parts.length - 1] = encodedFilename;
          const newSrc = parts.join("/");
          
          // 设置新的src属性
          img.setAttribute("src", newSrc);
        }
      }
    });
    
    // 记录修复过程
    console.log("已完成图片路径修复");
  }
  
  // 页面加载完成后执行修复
  fixImagePaths();
  
  // 如果有延迟加载的内容，可以设置一个定时器再次执行
  setTimeout(fixImagePaths, 1000);
});
