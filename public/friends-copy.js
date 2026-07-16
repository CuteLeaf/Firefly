// public/friends-copy.js
document.addEventListener('DOMContentLoaded', function() {
  // 查找所有带有 copy-btn 类的按钮
  var copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(function(btn) {
    btn.addEventListener('click', async function(e) {
      // 从 data-copy-value 属性读取要复制的内容
      var textToCopy = this.getAttribute('data-copy-value');
      var iconCopy = this.querySelector('.icon-copy');
      var iconSuccess = this.querySelector('.icon-success');

      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        if (iconCopy && iconSuccess) {
          iconCopy.classList.add('hidden');
          iconSuccess.classList.remove('hidden');
          setTimeout(function() {
            iconCopy.classList.remove('hidden');
            iconSuccess.classList.add('hidden');
          }, 1500);
        }
      } catch (err) {
        // 降级方案
        var textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          if (iconCopy && iconSuccess) {
            iconCopy.classList.add('hidden');
            iconSuccess.classList.remove('hidden');
            setTimeout(function() {
              iconCopy.classList.remove('hidden');
              iconSuccess.classList.add('hidden');
            }, 1500);
          }
        } catch (e) {
          alert('复制失败，请手动复制');
        }
        document.body.removeChild(textArea);
      }
    });
  });
});