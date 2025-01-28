# 基于Docsify、Github和Cloudflare Pages的静态博客搭建与部署

## 使用Docsify搭建网站

### 为什么使用Docsify

​	读者可能使用过博客园、CSDN和WordPress等博客平台，但是它们自定义程度有限且略显臃肿，而完全从头开始使用HTML、CSS和JavaScript写一个高度自定义的博客又太过困难且没有必要。再考虑到个人博客基本上不需要后端，所以可以采用静态网站。

​	然而对于Jekyll、Hugo和Hexo等静态网站生成器，如果不使用它们的现有模板，想要高度自定义网页内容，需要一定程度上学习除HTML、CSS和JavaScript外的这些生成器各自语言的基础知识。这对于只学过HTML、CSS和JavaScript基础知识甚至这三者也没有学过的读者来说无疑是一件麻烦的事。

​	读者可能听说甚至使用过GitBook这样的文档转换工具，它们也可以把Markdown文件转换为静态网站，但是文件众多时漫长的构建时间对小细节的反复修改造成了阻碍，而且也许读者还会认为自定义程度不够。

​	哔哔赖赖了这么多，那么是否存在规避了上述缺点的网站生成工具呢，也就是说是不是有一个基本上可以用HTML、CSS和JavaScript高度自定义的，无需构建时间的，轻量化且不需要很多学习成本的静态网站生成器呢？有的，兄弟，有的，那就是本系列文章的主要研究对象——Docsify。

​	Docsify是一个神奇的静态网站生成器，它不构建静态HTML文件，而是动态生成网站，从而支持热重载。它可以加装大量插件，并且想要自己写插件也没有特别困难。

### Docsify初始化

1. 安装docsify-cli

​	Docsify是使用Node.js编写的，所以需要先去[Node.js官网](https://nodejs.org)下载并安装Node.js，安装时除了安装位置自行设置，其余选项一律不用在意。安装完毕后，可以按键盘Win+R并输入`cmd`打开命令提示符，再分别查看是否成功安装Node.js和npm，命令如下：

```cmd
node -v
npm -v
```

​	npm是Node.js的包管理器，需要使用npm安装docsify-cli包，为了方便在电脑的任意位置执行Docsify命令，建议全局安装docsify-cli包，命令如下：

```cmd
npm i docsify-cli -g
```

2. 初始化项目

​	其中`i`即`install`，`g`即`global`。安装完毕后，记住想要存放项目的文件夹的路径（该文件夹不需要真的存在，执行Docsify初始化命令后会自动创建），再初始化项目，命令如下：

```cmd
docsify init path/to/your/folder
```

​	初始化项目后，可以在刚才的文件夹下看到三个文件：`index.html`、`README.md`和`.nojekyll`，第一个文件是入口文件，表示项目所有代码的出发点；第二个文件是网站主页要解析的Markdown文件；第三个文件用于在部署到Github Pages时防止其忽视文件名以`_`开头的文件。

### 本地测试

​	因为浏览器会阻止File协议加载远程JS资源，所以不能直接用浏览器打开`index.html`文件，而需要用Docsify命令在本地开服务器运行该项目，命令如下：

```cmd
docsify serve path/to/your/folder
```

​	也可以先在命令提示符打开刚才的文件夹，然后直接执行命令如下：

```cmd
docsify serve
```

​	这两种方式默认都会在本地开放端口`3000`（如果被占了会开放别的端口，在命令提示符中会显示），而后用浏览器打开`http://localhost:3000`即可看见初始化后的博客。

## 使用Github存放代码

### 安装Git并注册Github账号

​	Git是一个开源的分布式版本控制系统，而Github是一个以Git为唯一版本库格式的代码托管平台，本系列文章采用Github托管代码，当然，采用Gitee等其它代码托管平台大致也没什么不同。

​	先去[Git官网](https://git-scm.com/)下载并安装Git，安装时安装位置自行设置，当进行到`Adjusting the name of the initial branch in new repositories.`时，选择`Override the default branch name for new repositories`并输入`main`，其余选项一律不用在意。这是因为Git的主分支默认名称为`master`而Github为`main`，为了方便用Git GUI一键推送，所以将Git改为与Github一致。当然，如果更改Github，或者干脆使用命令提示符推送也可以。

​	再去[Github官网](https://github.com/)用邮箱注册一个账号，Github在国内不一定能直接连上，可以考虑使用[Watt Toolkit](https://steampp.net/)（即Steam++）加速或者干脆科学上网。

### 把项目推送到Github仓库

1. 配置SSH key

​	为了方便将本地项目上传到Github仓库，需要Github账号给电脑权限，即配置SSH key。先查看电脑是否有SSH key，打开`C:\Users\Administrator`查看是否存在`.ssh`文件夹，如果存在且`.ssh`文件夹中有`id_rsa`和`id_rsa.pub`文件，则说明有shh key，反之没有。

​	如果没有SSH key，打开命令提示符，输入命令如下：

```cmd
ssh-keygen -t rsa
```

​	命令执行完成后，打开`C:\Users\Administrator\.ssh\id_rsa.pub`，全选并复制。登录Github账号，点击右上角头像，选择`Settings`，点击`SSH and GPG keys`，再点击右上角带有`New SSH key`字样的蓝色按钮，自己填写一个`Title`并在`Key`处填入刚才复制的内容，最后点击`Add SSH key`。

2. 把项目推送到Github仓库

​	打开项目所在文件夹，右键点击空白处并选择`Open Git GUI here`，再点击`Create New Repository`，找到当前文件夹并点击`Create`，此时查看隐藏项目就会发现当前文件夹下多了一个`.git`文件夹，这说明Git仓库创建完成。

​	Github主页左侧点击`Create repository`新建Github仓库，因为已经有`README.md`文件了，所以不用勾选`Add a README file`。打开新建的仓库，点击带有`Code`字样的蓝色按钮，复制`HTTPS`栏目下的地址。

​	此时Git GUI的页面也发生了变化，点击上方菜单中的`Remote`并选择`Add`，自己填写一个`Name`并在`Location`处填入刚才复制的地址，接着选择`Done Nothing Else Now`，最后点击`Add`。此时在项目所在文件夹打开命令提示符，输入命令如下：

```cmd
git remote
```

​	这样就会得到刚才填写的`Name`，说明远程仓库添加成功。接着依次点击Git GUI的`Stage Changed`、`Commit`（先填写`Commit Message`）和`Push`，就可以将本地项目推送到Github仓库。

3. 常见问题

​	如果在新建Github仓库时选择了License（即该仓库的开源协议），新建的仓库中就会有一个`LICENSE`文件，而本地没有这个文件，所以还需要在命令提示符打开该文件夹，输入命令如下：

```cmd
git pull Name
```

​	其中`Name`即刚才在Git GUI填写的`Name`。然后再进行`Stage Changed`、`Commit`和`Push`操作即可。

## 使用Cloudflare Pages部署网站

​	可以免费部署静态网站的平台有很多，Cloudflare的免费额度比较大方，有域名保护，而且Cloudflare Pages的域名没有被墙。当然，嫌麻烦的话，直接部署到Github Pages上也可以（在Github仓库页面上方菜单点击`Settings`，左侧选择`Pages`，再填写一些内容即可），不过Github Pages比较慢。

​	先去[Cloudflare官网](https://www.cloudflare-cn.com/)注册一个账号，注册时选择免费的计划即可。再在仪表盘的侧边栏下拉，选择`计算（Workers）`，点击`创建`，选择`Pages`，点击`连接到Git`，按照提示登录Github账号，选择之前新建的仓库，点击`开始设置`，自己填写一个`项目名称`，最后点击`保存并部署`。部署完成后可以看到Cloudflare分配的域名，访问该地址即可看见和之前本地服务器一样初始化后的博客。

## 参考文档

1. [Docsify官方文档](https://docsify.js.org)。