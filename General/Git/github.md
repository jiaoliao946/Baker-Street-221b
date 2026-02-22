# 使用Github

> Github是一个以Git为唯一版本库格式的代码托管平台，阅读本文章前请先安装好Git。

## 基本操作

​	先去[Github官网](https://github.com/)用邮箱注册一个账号，Github在国内不稳定，可以考虑使用[Watt Toolkit](https://steampp.net/)（即Steam++）加速或者干脆科学上网。

### 配置SSH key

​	为了方便将本地项目上传到Github仓库，需要Github账号给电脑权限，即配置SSH key。先查看电脑是否有SSH key，打开`C:\Users\Administrator`查看是否存在`.ssh`文件夹，如果存在且`.ssh`文件夹中有`id_rsa`和`id_rsa.pub`文件，则说明有shh key，反之没有。

​	如果没有SSH key，打开命令提示符，输入命令如下：

```cmd
ssh-keygen -t rsa
```
> [!WARNING]
> 此时如果出现`ssh-keygen : 无法将“ssh-keygen”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。`，则说明未安装Git或未配置Git到环境变量，需要在安装好Git后将安装到的目录下的`Git\usr\bin`文件夹的路径添加到系统变量的`Path`中。

​	命令执行完成后，打开`C:\Users\Administrator\.ssh\id_rsa.pub`，全选并复制。登录Github账号，点击右上角头像，选择`Settings`，点击`SSH and GPG keys`，再点击右上角带有`New SSH key`字样的蓝色按钮，自己填写一个`Title`并在`Key`处填入刚才复制的内容，最后点击`Add SSH key`。

![ssh](./assets/ssh.png)

### 从IDE创建仓库

#### IntelliJ IDEA

​	对于没有创建Git仓库的项目，打开IntelliJ IDEA后点击左侧的`更多工具窗口`并选择`提交`，此时左侧会出现一个带有`提交`字样的新图标，点击该图标，在弹出的栏目中点击`添加Git仓库`的链接并选择项目所在文件夹，则可为项目创建Git仓库。

​	创建好Git仓库并在IntelliJ IDEA中打开项目后，点击左上角的`主菜单`，移动到`Git`选项，悬停于下方的`GitHub`，点击`在GitHub上共享项目`，设置好仓库名称、是否为私有仓库和远程仓库的本地名称后登录Github账号并点击`共享`即可在Github账号上自动新建一个仓库，并且该仓库会被自动添加为本地仓库的远程仓库。

### 实用技巧

1. 统一Git和Github的主分支默认名称

    ​	因为Git的主分支默认名称为`master`而Github为`main`，所以如果想更加快捷地使用Git GUI一键推送，可以将二者统一，这有多种方法：

    - 安装Git时配置：当安装进行到`Adjusting the name of the initial branch in new repositories.`时，选择`Override the default branch name for new repositories`并输入`main`；
    - 安装完Git后配置：
    - 配置Github：