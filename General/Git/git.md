# Git

> 本文以Github为例讲解Git的一些使用方法及技巧，其它代码托管平台大同小异。

## 基本操作

先去[Git官网](https://git-scm.com/)下载并安装Git。

## 远程仓库相关

### 添加远程仓库并推送本地项目

1. 方法一（使用Git GUI）

    打开电脑上的项目所在文件夹，右键点击空白处并选择`Open Git GUI here`，再点击`Create New Repository`，找到当前文件夹并点击`Create`，此时查看隐藏项目就会发现当前文件夹下多了一个`.git`文件夹，这说明Git仓库创建完成。

    打开某个Github仓库，点击带有`Code`字样的蓝色按钮，复制`HTTPS`栏目下的地址。

    此时Git GUI的页面也发生了变化，点击上方菜单中的`Remote`并选择`Add`，自己填写一个`Name`并在`Location`处填入刚才复制的地址，接着选择`Done Nothing Else Now`，最后点击`Add`。此时在项目所在文件夹打开命令提示符，输入命令如下：
    
    ```cmd
    git remote
    ```
    
    这样就会得到刚才填写的`Name`，说明远程仓库添加成功。接着依次点击Git GUI的`Stage Changed`、`Commit`（先填写`Commit Message`）和`Push`，就可以将本地项目推送到Github仓库。

2. 方法二（使用命令行）

### 常见问题

1. 缺少License

    如果在新建Github仓库时选择了License（即该仓库的开源协议），新建的仓库中就会有一个`LICENSE`文件，而本地没有这个文件，所以还需要在命令提示符打开该文件夹，输入命令如下：

    ```cmd
    git pull Name
    ```

    其中`Name`即刚才在Git GUI填写的`Name`。然后再进行`Stage Changed`、`Commit`和`Push`操作即可。