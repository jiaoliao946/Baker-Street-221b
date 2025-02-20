# 基于Docsify搭建静态博客

> 本系列文章围绕Docsify从零开始讲解搭建静态博客的各方面知识技巧，大部分内容暂时只保证支持Windows系统，适用于所有略懂电脑知识、拥有基本代码能力（甚至不需要学过HTML、CSS和JavaScript）且想要搭建静态博客的读者。

### 为什么使用Docsify

​	读者可能使用过博客园、CSDN和WordPress等博客平台，但是它们自定义程度有限且略显臃肿，而完全从头开始使用HTML、CSS和JavaScript写一个高度自定义的博客又太过困难且没有必要。再考虑到个人博客基本上不需要后端，所以可以采用静态网站。

​	然而对于Jekyll、Hugo和Hexo等静态网站生成器，如果不使用它们的现有模板，想要高度自定义网页内容，需要一定程度上学习除HTML、CSS和JavaScript外的这些生成器各自语言的基础知识。这对于只学过HTML、CSS和JavaScript基础知识甚至这三者也没有学过的读者来说无疑是一件麻烦的事。

​	读者可能听说甚至使用过GitBook这样的文档转换工具，它们也可以把Markdown文件转换为静态网站，但是文件众多时漫长的构建时间对小细节的反复修改造成了阻碍，而且也许读者还会认为自定义程度不够。

​	哔哔赖赖了这么多，那么是否存在规避了上述缺点的网站生成工具呢，也就是说是不是有一个基本上可以用HTML、CSS和JavaScript高度自定义的，无需构建时间的，轻量化且不需要很多学习成本的静态网站生成器呢？有的，兄弟，有的，那就是本系列文章的主要研究对象——Docsify。

​	Docsify是一个神奇的静态网站生成器，它不构建静态HTML文件，而是动态生成网站，从而支持热重载。它可以加装大量插件，并且想要自己写插件也没有特别困难。

### 参考文档

1. [Docsify官方文档](https://docsify.js.org)；
2. [Waline官方文档](https://waline.js.org/)。

### 常用工具

1. [Git](https://git-scm.com/)；
2. [Github](https://git-scm.com/)；
3. [Cloudflare Pages](https://www.cloudflare-cn.com/)；
4. [Visual Studio Code](https://code.visualstudio.com/)；
5. [Typora](https://typoraio.cn/)。