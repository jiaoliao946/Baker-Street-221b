# 在Windows上部署支持AMD显卡的PyTorch环境

## 使用DirectML

​	[DirectML](https://learn.microsoft.com/zh-cn/windows/ai/directml/dml)（直接机器学习）是由Microsoft提供的一款机器学习（ML）的低级别 API，可用于加速I卡和A卡的机器学习任务。Conda是一个开源的包管理系统和环境管理系统，可用于设置完全独立的环境来运行不同版本的Python。此处使用DirectML在Conda的Python环境上部署PyTorch。

### 部署在Conda环境上

​	首先去[Conda官网](https://docs.conda.io/projects/conda/en/stable/)下载并安装Miniconda或完整的Conda，安装位置自行设置，当安装进行到`Advanced Installation Options`时，勾选`Register Miniconda3 as the system Python3.13`，这样可以在安装后直接用cmd执行Conda命令，而不需要再配置环境变量。

​	然后新建一个Conda环境，在cmd（在PowerShell可能会无法真正执行命令）执行命令如下：

```cmd
conda create -n torch_dml python=3.12
```

​	其中`-n`是`--name`的简写；`torch_dml`是该Conda环境的名称，可以更改；貌似DirectML暂时还不支持python3.13，所以该环境的Python版本设为3.12。命令执行过程中遇到询问，都回答`a`或者`y`即可。

​	国内下载Conda的文件较慢，可以使用镜像源，命令如下：

```cmd
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
```

​	其中`https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/`是清华提供的一个镜像源，可以上网搜索并替换网址从而添加几个别的镜像源。但是即使添加了镜像源，仍然可能因为无法下载而报错，所以需要耐心多试几次。

​	新建完Conda环境后还要激活该环境，命令如下：

```cmd
conda activate torch_dml
```

​	这样就会发现命令行前多了一段`(torch_dml)`，说明现在处于刚才新建的环境中。

​	最后下载DirectML，命令如下：

```cmd
pip install torch-directml -i https://pypi.tuna.tsinghua.edu.cn/simple
```

​	其中`-i https://pypi.tuna.tsinghua.edu.cn/simple`表示使用清华提供的一个镜像源，一般使用了镜像源下载都不会太慢。在执行该命令下载DirectML时，会自动下载对应版本的torch和torchvision，所以无需额外下载。

### 测试是否成功

​	首先打开VSCode（使用其它IDE当然也可以）并新建一个.py文件用于测试，代码如下：

```python
import torch
import torch_directml
dml = torch_directml.device()
tensor1 = torch.tensor([1]).to(dml)
tensor2 = torch.tensor([2]).to(dml)
dml_algebra = tensor1 + tensor2
print("result:",dml_algebra.item())
```

​	然后按<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>打开VSCode的命令面板，搜索`Python: Select Interpreter`，点击并选择带有刚才创建的Conda环境的名称字样的选项，比如我选的是带有`(torch_dml)`的。再同样打开VSCode的命令面板，搜索`Terminal: Select Default Profile`，点击并选择`Command Prompt`选项从而将VSCode的默认终端设置为cmd。

​	最后运行该Python文件并打开任务管理器，如果在运行过程中看到A卡的利用率上升且终端输出一行`result:3`则部署成功。

### 把张量和模型放到A卡上

​	先添加一行代码`import torch_directml`导入DirectML库，再定义一个变量`dml = torch_directml.device()`以得到当前的DirectML设备，而后就可以在定义张量和模型时传入一个参数`device=dml`从而把它们储存到A卡上，当然也可以对已定义好的张量和模型使用`to(dml)`方法。

​	如果有多个显卡，可以定义多个变量从而得到多个设备，只需要在定义时给$torch\_directml.device$函数传入不同的数字参数以表示设备序号，序号的顺序一般为先独显后核显。

### 常见问题

1. 注意

    - 对使用DirectML储存到A卡上的张量的单个元素进行赋值时可能无法赋值成功，可以尝试一些别的方式，比如转换为卷积乘法。

1. 使用VSCode时代码中的`torch`和`torch_directml`带有波浪线

    ​	这可能是因为装了Pylance插件但该插件未检测到torch和torch_directml，所以需要手动指定一下位置。具体操作为：

    - 找到MiniConda的安装位置并打开`miniconda3`文件夹；
    - 进入其中的`envs`文件夹并打开和新建的Conda环境名称一致的文件夹；
    - 进入`Lib`文件夹，找到`site-packages`文件夹并右键，点击`复制文件地址`；
    - 点击VSCode菜单栏的`文件`，把光标移动到`首选项`并点击`设置`；
    - 搜索`python.analysis.extraPaths`并点击`添加项`；
    - 把复制的文件地址粘贴到框中，删除两边的引号并点击`确定`。

> [!IMPORTANT]
> [在 Windows 上通过 DirectML 启用 PyTorch](https://learn.microsoft.com/zh-cn/windows/ai/directml/pytorch-windows)。