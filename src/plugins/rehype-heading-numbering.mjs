/**
 * rehype 插件：为文章标题添加自动序号
 * 支持 h1-h6 六级标题，序号格式如：1、1.1、1.1.1 等
 */

export function rehypeHeadingNumbering() {
  return (tree) => {
    // 跟踪每个级别的计数器
    const counters = [0, 0, 0, 0, 0, 0]; // 支持6级标题

    // 遍历所有节点
    let index = 0;
    while (index < tree.children.length) {
      const node = tree.children[index];

      // 检查是否是标题元素
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        const level = parseInt(node.tagName.charAt(1), 10) - 1; // 转换为 0-5 索引

        // 更新计数器
        counters[level]++;
        // 重置所有更深层级的计数器
        for (let i = level + 1; i < 6; i++) {
          counters[i] = 0;
        }

        // 构建序号字符串
        const parts = [];
        for (let i = 0; i <= level; i++) {
          if (counters[i] > 0) {
            parts.push(counters[i]);
          }
        }
        const numbering = parts.join('.');

        // 创建序号元素
        const numberingElement = {
          type: 'element',
          tagName: 'span',
          properties: {
            className: ['heading-numbering'],
            'aria-hidden': 'true',
          },
          children: [
            {
              type: 'text',
              value: numbering,
            },
          ],
        };

        // 将序号插入到标题内容的最前面
        if (node.children && node.children.length > 0) {
          // 在标题内容前插入序号
          node.children.unshift(numberingElement);
          // 在序号后添加一个空格
          node.children.splice(1, 0, {
            type: 'text',
            value: ' ',
          });
        }
      }

      index++;
    }
  };
}
