# 使用Github

## 使用Github存放代码

### 安装Git并注册Github账号

​	Git是一个开源的分布式版本控制系统，而Github是一个以Git为唯一版本库格式的代码托管平台，本系列文章采用Github托管代码，当然，采用Gitee等其它代码托管平台大致也没什么不同。

​	先去[Git官网](https://git-scm.com/)下载并安装Git，安装时安装位置自行设置，当进行到`Adjusting the name of the initial branch in new repositories.`时，选择`Override the default branch name for new repositories`并输入`main`，其余选项一律不用在意。这是因为Git的主分支默认名称为`master`而Github为`main`，为了方便用Git GUI一键推送，所以将Git改为与Github一致。当然，如果更改Github，或者干脆使用命令提示符推送也可以。

​	再去[Github官网](https://github.com/)用邮箱注册一个账号，Github在国内不稳定，可以考虑使用[Watt Toolkit](https://steampp.net/)（即Steam++）加速或者干脆科学上网。

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