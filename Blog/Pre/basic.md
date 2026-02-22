# 搭建静态博客需要用到的前端基础知识和Docsify基础知识

> 本文依据Docsify初始化得到的文件讲解搭建静态博客需要用到的前端基础知识和Docsify基础知识。

​	网站开发分为前端开发和后端开发，前者关注用户界面和用户体验，后者负责服务器逻辑和数据库管理。对于静态网站，主要考虑前端开发。在大部分浏览器中随便打开一个网页并点击<kbd>F12</kbd>，即可看到前端相关内容。

## HTML

​	[HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML)（Hyper Text Markup Language，超文本标记语言）是一种用来结构化Web网页及其内容的标记语言（不是编程语言），即用于告诉浏览器网页结构和内容。HTML文件可用拓展名为`html`和`htm`，二者没有区别。

> [!NOTE]
> 由于HTML5是HTML最新修订版本，是最新一代HTML标准，且大部分浏览器已经具备了HTML5支持，所以本系列文章所讲HTML均为HTML5。

1. 元素

    -  HTML实例由一系列元素组成；
    -  元素通常由一对标签及其所包围的内容组成，其中结束标签用于关闭元素；

    > [!WARNING]
    > 不关闭元素时，大部分浏览器也会正确地显示HTML，但是可能会产生无法预料的错误，所以不推荐这么做。

    - 元素的内容可以为空；

    > [!TIP]
    > 空元素是一类特殊的内容为空的元素，它们没有对应的结束标签，而是直接通过在开始标签末尾添加`/`来关闭，比如换行元素`<br/>`。

    - 元素通常支持嵌套，即元素的内容为元素。

2. 标签

    - 标签是由尖括号包围的关键词，通常成对出现，一对标签中有开始标签（起始标签）和结束标签（闭合标签）；
    - 结束标签通常可由开始标签在元素名前加一`/`得到。

    > [!WARNING]
    > 标签对于元素名的大小写不敏感（比如`<P>`相当于`<p>`），但HTML5强制使用小写，所以推荐全部使用小写。

> [!TIP]
> 在实际交流中，`元素`和`标签`通常表示相同的意思。

3. 属性

    - 属性是元素的附加信息；
    - 属性通常出现于开始标签；
    - 属性用于定义元素的行为、样式和内容等特性；
    - 属性值通常为引用属性值，即`"value"`（`""`可以换成`''`，但若`""`是引用内容的一部分则必须使用`''`），加上属性名即为`name="value"`。

    > [!TIP]
    > 不包含ASCII空格（以及`"`、`'`、`` ` ``、`=`、`<`和`>`）的简单属性值可以不使用引号，但是为了方便阅读，推荐将所有属性值都用引号包围。

    > [!WARNING]
    > 属性对于大小写不敏感，但HTML5强制使用小写，所以推荐全部使用小写。

    - 常见属性有`class`和`id`，主要用作CSS和JavaScript选中该元素的依据，前者多个元素可有同一个属性值，一个元素可有多个属性值（在`""`内用空格分割）；后者元素和属性值一一对应。

    > [!TIP]
    > HTML5中，`class`和`id`可用于所有元素，但不一定发挥作用。

4. [`<!DOCTYPE>`声明](https://developer.mozilla.org/zh-CN/docs/Glossary/Doctype)

    - 写于HTML文档第一行，用于告诉浏览器使用的是哪个版本的HTML，此处表示使用的是HTML5；
    - 不区分大小写，比如`<!Doctype Html>`相当于`<!DOCTYPE html>`。

5. 注释

    使用`<!--`和`-->`包围注释。

## CSS

​	[CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS)（Cascading Style Sheets，层叠样式表，也简称样式表）是一种用来为结构化文档添加样式的语言，即用于告诉浏览器网页每部分具体表现为什么样。

> [!NOTE]
> 由于CSS3是最新一代CSS标准，所以本系列文章所讲CSS均为CSS3。

1. 语法

    - 每条样式由选择器和被`{}`包围的声明组成；
    - 每条声明由一个样式属性和一个属性值组成，二者之间用一个`:`隔开；
    - 每条声明由一个`;`结束；
    - CSS使用`/*`和`*/`包围注释。

    > [!TIP]
    > 为方便阅读，推荐一条声明一行，比如：
    >
    > ```css
    > p {
    >      color:red;
    >      text-align:center;
    > }
    > ```

2. 选择器

    - 选择器用于指定想要添加样式的HTML元素；
    - 元素选择器（标签选择器）写作`name`，选中元素值为`name`的HTML元素；
    - class选择器写作`.name`，选中`class`含有`name`的所有HTML元素，比如`.name`选中`class="name"`的HTML元素；
    - id选择器写作`#name`，选中`id`为`name`的HTML元素；
    - 其它所有选择器见[CSS 选择器](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Styling_basics/Basic_selectors)。

3. 插入方式

    ​	共有三种插入方式：

    - 外部样式表：使用`<link>`元素链接到样式表，比如`<link rel="stylesheet" href="mystyle.css"/>`
        - `rel="stylesheet"`表示链接的是一个样式表；
        - `href="mystyle.css"`表示链接到的样式表地址为`mystyle.css`，需指向一个拓展名为`css`的文件，可指向网络地址，也可指向本地计算机上的地址。
    - 内部样式表：在`<head>`元素中添加`<style>`元素并在后者内容中填入样式表，比如：
    
        ```html
        <head>
          <style>
            p {
              margin-left:20px;
            }
            body {
              background-image:url("images/back40.gif");
            }
          </style>
        </head>
        ```
    
    - 内联样式：只针对某个HTML元素，不需要选择器，直接写在它的的`style`属性中，比如：
    
        ```html
        <p style="color:sienna;margin-left:20px">这是一个段落。</p>
        ```
    
    ​	多个样式指向同一元素时，作用优先级通常为：内联样式>内/外部样式（后面的覆盖前面的）>浏览器默认样式，优先级规则具体见[层叠、优先级与继承](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts#%E4%BC%98%E5%85%88%E7%BA%A7_2)。

## JavaScript

​	[JavaScript](https://zh.javascript.info/intro)（简称JS）是一种具有[函数优先](https://developer.mozilla.org/zh-CN/docs/Glossary/First-class_Function)特性的轻量级、解释型或者说即时编译型的编程语言，它与HTML和CSS完全集成，因为作为前端开发中的脚本语言而被熟知。JS在网页加载时自动执行，不需要特殊的准备或编译。

​	JS代码必须位于`<script>`元素，`<script>`元素可位于`<head>`元素，也可位于`<body>`元素。

​	JS代码可以直接作为`<script>`元素的内容；也可以由`<script>`元素的`src`属性引入，即让属性值指向一个拓展名为`js`的文件，比如`<script src="myScript.js"></script>`。

> [!WARNING]
> `<script>`元素设置了`src`属性后，它的内容会被忽略。

## 讲解代码

​	用代码编辑器打开`index.html`文件，可以看到一个Docsify初始化后的HTML实例，如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="description" content="Description">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
  <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css">
</head>
<body>
  <div id="app"></div>
  <script>
    window.$docsify = {
      name: '',
      repo: ''
    }
  </script>
  <!-- Docsify v4 -->
  <script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
</body>
</html>
```

1. `<html lang="en"></html>`——[`html`元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/html)（根元素）

    - 包含整个页面的所有内容，是所有元素的容器；
    - `lang`属性用于设置网页的主要语种，此处表示主要语种为英文，属性值改为`"zh"`即表示主要语种为中文。

2. `<head></head>`——[`head`元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/head)

    - 所有头部元素的容器；
    - 主要保存供浏览器处理的信息，而非人类阅读信息，因而不会向用户显示；
    - 必须包含一个`<title>`元素。

3. `<meta/>`——[`meta`元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)

    ​	说明该HTML文档的元数据。

4. `<meta charset="UTF-8">`

    ​	说明该HTML文档采用UTF-8编码，否则中文会显示为乱码。

5. `<title>Document</title>`——[`title`元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/title)

    - 设置页面的标题；
    - 显示于浏览器标签页、搜索引擎结果中的标题和收藏网页的描述文字；
    - 一个HTML文档必须且只能有一个。

6. `<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />`

    ​	指定IE8浏览器去模拟某个特定版本浏览器的渲染方式，从而解决部分兼容问题。

7. `<meta name="description" content="Description">`

    ​	设置页面的描述文本，用于搜索引擎。

8. `<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">`

    - 设置窗口相关内容；
    - `width=device-width`表示宽度为屏幕宽度；
    - `initial-scale=1.0`表示默认缩放比例为1.0；
    - `minimum-scale=1.0`表示最小缩放比例为1.0。

9. `<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css">`——[`link`元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link)

    ​	引入外部样式表，此处用于设置Docsify主题，所有主题见[Themes](https://docsify.js.org/#/themes)；

10. `<body></body>`——[`<body>`元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/body)

    ​	HTML文档的主体元素，一个HTML文档只能有一个。

11. `<div id="app"></div>`——[`<div>`元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div)

    - `id`为`app`的`<div>`元素；
    - 布局时会被替换为Docsify的内容 ；
    - 内容即等待页面的内容。

12. ```html
        <script>
          window.$docsify = {
            name: '',
            repo: ''
          }
        </script>
    ```

    ​	引入JS，`window.$docsify`的内容用于配置Docsify。

13. `<script src="//cdn.jsdelivr.net/npm/docsify@4"></script>`

    ​	引入外部JS，此处用于加载Docsify相关JS。

> [!IMPORTANT]
> [MDN Web文档](https://developer.mozilla.org/zh-CN/)；
> 
> [现代JavaScript教程](https://zh.javascript.info)；
> 
> [菜鸟教程](https://www.runoob.com/)；
> 
> [HTML中Meta属性http-equiv="X-UA-Compatible"详解](https://www.cnblogs.com/zxx193/p/3368236.html)。