# 学习模组基本知识

> 本文大致介绍了Minecraft 1.12.2 forge模组及其开发的基本原理，在后续开发中回看本文可能会得到不一样的理解。

## 电子游戏运行机制

### 游戏主循环

​	计算机程序在模拟游戏场景时需要将连续的时间离散化（Discretize），并为每个离散的时刻模拟游戏场景，由此引出了游戏主循环的概念。刻（Tick）是计算机程序模拟游戏场景的基本单位，每刻模拟一次游戏场景，因而任意游戏程序从开始到结束可以大致分为以下步骤：

- 初始化游戏；
- 加载游戏存档；
- 读取用户输入；
- 模拟第1刻场景；
- 读取用户输入；
- 模拟第2刻场景；

​	......

- 读取用户输入；
- 模拟第N刻场景；
- 保存游戏存档。

​	可以注意到绝大多数游戏内容都处于不断读取用户输入和模拟当前刻场景的过程中，该过程是一个循环，即游戏主循环（Game Loop），几乎所有电子游戏的程序内都至少有一个游戏主循环的实现。

### 更新频率

​	如果任意1刻的时长为固定值，则需要设定时间的计算机程序的实现就非常方便，而该值的倒数即为游戏的更新频率，众所周知，Minecraft中的1个游戏刻为50ms，因此更新频率就是20Hz。

​	为了让任意1刻的时长为固定值，需要在每刻开始前启动计时器，并在场景模拟完成后停止计时器，再将计时所得值和设定的1刻固定时长做差（假设计时所得值更小），而后先延迟差值的时长再进行下一刻即可实现任意1刻的时长为固定值。

​	然而读取用户输入和模拟场景要在短短50ms内做完并不是一个很容易达到的要求，如果无法达到，1刻的时间就会超过50ms，即更新频率低于20Hz，这个时候后台日志就会出现一条常见的语句“Can't keep up! Did the system time change, or is the server overloaded?”。

### 游戏状态

​	为了从当前tick的场景推出下一tick的场景，应为游戏设置一个状态（State），它一般要做以下几件事：

- 从存档读入（$state.load()$）；
- 写入存档（$state.save()$）；
- 处理用户输入（$state.handleInput()$）；
- 从当前tick更新到下一tick（$state.tick()$）；
- 计数器（$state.currentTick$）；
- 判断是否继续游戏（$state.isRunning$）。

​	由此，游戏程序的步骤可以总结为：

- 初始化游戏，得到游戏状态$state$；
- 加载游戏存档，即$state.load()$；
- 启动计时器$timer()$；
- 将$state.currentTick$加1；
- 读取用户输入，即$state.handleInput()$；
- 模拟第tick刻场景，并更新$state$，即$state.tick()$；
- 终止$timer$并重置，得到时间相差t ms；
- 延时(50 - t) ms；
- $state.isRunning$为真吗？若为真则跳到第3步，反之继续；
- 保存游戏存档，即$state.save()$。

​	这其实已经非常接近Minecraft的运行机制了，不过还是有细小差别，比如第5步已经内化进了第6步，也不是只有到游戏主循环结束后才保存存档。

​	游戏状态需要能从存档读入及写入存档，这要求它包含能导出成存档的全部消息，因而其架构为：若干分立的维度，每个维度都有若干区块，区块里储存着方块状态、方块实体（Tile Entity）和包括玩家在内的各种实体。

## 模组开发原理

### 模组框架

​	如果每个模组都独自直接修改Minecraft代码，那么每个模组运行时所面对的代码都将和编写模组时期望的有所区别。为了解决这个问题，出现了各种各样的模组框架，通常情况下，模组框架为ModLoader本身，在本系列文章中为FML（Forge Mod Loader）。

​	每个框架都会维护一个模组的列表，在合适的时机加载模组，在Minecraft本体代码的合适位置添加钩子（Hook），并在钩子触发时告诉模组应该做什么。添加钩子的工作由模组框架统一完成，因此在避免模组直接修改Minecraft本体代码的同时，也允许模组为Minecraft添加各种丰富的功能。

### 事件系统

​	对于事件系统（Event System），模组框架会维护一个事件监听器（Event Listener）的列表，并在合适的时机发布事件（Post Event）。事件监听器$listener$需要实现接收事件的方法，即$listener.accept(event)$，对于所有钩子，事件监听和触发的机制都是类似的，将事件监听器的列表包装起来就引入了事件总线（Event Bus）的概念。事件总线$eventBus$需要实现注册事件监听器的方法和发布事件的方法，即$eventBus.register(listener)$和$eventBus.post(event)$。

​	由此，和玩家登录事件有关的过程可以总结为：

1. 初始化

    ​	......

    - 定义事件总线$eventBus$；
    - 向事件总线添加事件监听器$listener$：$eventBus.register(listener)$。

    ​	......

2. 游戏主循环

    ​	......

    - 创建一个代表玩家的游戏元素；
    - 设置玩家的游戏进度、位置和面朝方向等；
    - 引入代表玩家进入世界的事件$event$；
    - 向事件总线发布事件$event$：$eventBus.post(event)$；
    - 在世界上生成玩家。

    ​	......

​	实际的事件总线和上述实现略有差别但本质一样。很多模组框架都会在Minecraft代码中插入大量的钩子，并提供大量的事件，FML有三条事件总线：一般事件总线（$MinecraftForge.EVENT\_BUS$）、矿物生成总线（$MinecraftForge.ORE\_GEN\_BUS$）和地形生成总线（$MinecraftForge.TERRAIN\_GEN\_BUS$）。

> [!WARNING]
> 此处没有考虑FML中用于模组加载的生命周期事件，这些事件和其它事件不同，监听器的声明方式也有所不同，在本系列文章的后续代码中应特别注意。

### 注册系统

​	考虑Minecraft中的游戏元素，比如物品种类，Minecraft使用一个字符串到物品类型的的映射存储所有物品种类，该映射中的字符串就是物品ID，如果想要添加新的物品种类，就要向该映射里添加新的键值对。

​	模组框架的做法是在Minecraft的游戏元素注册完成后，Minecraft引擎初始化开始前加入钩子，并触发不同游戏元素的注册事件，从而让模组在事件监听器中注册物品等模组提供的第三方游戏元素。

​	就Minecraft1.12.2而言，FML为很多不同类型的游戏元素都提供了注册事件，包括但不限于方块类型、物品类型、状态效果、药水类型、附魔类型和村民类型等。不过，Minecraft体系庞杂，游戏元素种类繁多，FML不可能面面俱到，因而FML除注册事件外还提供了生命周期（Life Cycle）事件。

> [!TIP]
> 状态效果和药水类型是分开注册的，对应于同一状态效果的不同时长和等级的药水类型分别注册，有不同的ID。

​	生命周期事件有很多种，不过就模组开发而言，常用的生命周期事件只有3种，分别为Pre-Initialization事件、Initialization事件和Post-Initialization事件。这三种生命周期事件都会在游戏初始化时触发，其中，Pre-Initialization事件安插在Minecraft引擎初始化前，而Initialization事件和Post-Initialization事件安插在Minecraft引擎初始化后。

​	由此，添加了生命周期事件的初始化过程可以总结为：

1. 初始化模组框架

    ​	......

    - 定义事件总线$eventBus$；
    - 将所有模组的事件监听器添加到$eventBus$；
    - 定义生命周期事件总线$lifeCycleEventBus$；
    - 将所有模组的生命周期事件监听器添加到$lifeCycleEventBus$。

    ​	......

2. 注册Minecraft的游戏元素

3. 向生命周期事件总线发布Pre-Initialization事件

    - 定义Pre-Initialization事件$event$；
    - 发布Pre-Initialization事件：$lifeCycleEventBus.post(event)$。

4. 触发模组元素的注册事件

5. 进行Minecraft引擎的初始化工作

6. 向生命周期事件总线发布Initialization事件

    - 定义Initialization事件$event$；
    - 发布Initialization事件：$lifeCycleEventBus.post(event)$。

7. 向生命周期事件总线发布Post-Initialization事件

    - 定义Post-Initialization事件$event$；
    - 发布Post-Initialization事件：$lifeCycleEventBus.post(event)$。

​	就模组开发而言，何时使用什么生命周期事件往往有一些不成文的惯例，在本系列文章的后续内容中会慢慢讲解。

​	由此可见，整个模组开发都是围绕着事件监听器进行的，一个普通的模组不能也不应该直接修改Minecraft本体代码。因而，和成熟的第三方库不同，模组开发必须深入挖掘Minecraft本身，从代码的每一个片段入手，以模组框架提供的事件为基础实现想要添加的游戏特性。这也就是每个模组开发者都应该适应的所谓“戴着镣铐跳舞”的感觉。

## Forge内部机制

### MCP

​	Minecraft是闭源的，对其进行反编译（Decompilation）后得到的所有类名、方法名和字段名等都被混淆（Obfuscation）了，可读性几乎没有，基于此开发模组非常困难。因此需要一个对各种标识符实施重映射（Remapping）的工具，MCP（Mod Coder Pack）便是一个主要负责解决该问题的项目，它的核心是一套将混淆过的名称映射到可读性较强的名称的映射表（Mapping Table）。

​	由于MCP和Mojang的关系，这套映射表的使用和分发是受到严格限制的，MCP允许的一个常见用途是制作模组，但是在已发布的模组中包含MCP提供的映射表是严格禁止的。此外，MCP也授权了Forge等一些开源项目使用其映射表。

> [!NOTE]
> Mojang在2025年10月29日宣布，从《群骑纷争》的下一个小更新开始，Minecraft Java版的代码将不再被混淆。

​	Minecraft代码经过混淆的名称和MCP提供的可读性较好的名称都会频繁变动，为了满足二进制兼容性（Binary Compatibility），提出了一个稳定的名称——SRG Name（Searge Name），其中“Searge”来源于MCP发起人的网络ID，他于2014年加入Mojang。此外，通常将Minecraft代码经过混淆的名称称为Notch Name，将MCP提供的可读性较好的名称称为MCP Name。

​	SRG Name是技术上的名称，通常缺乏可读性，有时也能在开发模组时看到和SRG Name一样的名称，因为MCP无法为此提供可读性较好的名称。SRG Name分为3类：

- 类名：为可读性较好的名称，与MCP Name相同；
- 方法名：为诸如`func_xxxxx_x`的名称，其中`x`为数字编号；
- 字段名：为诸如`field_xxxxx_x`的名称，其中`x`为数字编号。

​	变量名和方法参数名等不需要保证技术上的稳定性，因此不存咋对应的SRG Name，不过MCP也提供了相应的名称。

​	在基于Forge的服务端和客户端中，SRG Name通常用于运行时，因此也被称为“运行时名称”。在基于Forge的服务端和客户端中如果遇到了报错，可以很容易在错误报告中找到SRG Name。

### Forge

​	常说Forge是一个API，这其实并不严谨。多数情况下，API只包含公开的接口和方法，不包含它的底层实现，而通过Forge可以随意访问Minecraft的底层，因此Forge并非纯粹的API。

​	Forge实际上由两个项目合并而成——FML和Minecraft Forge，前者在本文前面大致有介绍，而后者实际上又包含两个部分：

- 对Minecraft底层的修改及因此暴露出的公开方法。当有多个 Mod 因为同时修改 Minecraft 的某一个部分而互相冲突时，Forge 可以介入 Minecraft 的底层来提供一套令这些 Mod 不再冲突的解决方案；
- 一些相对来说独立于Minecraft之外的系统。这些系统看起来和Minecraft之间没有多少耦合，但能极大改善模组之间的兼容性，代表系统有流体、事件总线和矿物词典，这些小系统比其它的Forge组成部分更接近真正的API。

### Forge Gradle

​	在开发模组时通常会将Notch Name映射到MCP Name，这一过程称为反混淆（Deobfuscation）过程；在构建模组时通常会将MCP Name映射到SRG Name，这一过程称为重混淆（Reobfuscation）过程；在基于Forge的服务端和客户端中，Forge会将Notch Name映射到SRG Name，以便于模组一致。

​	反混淆和重混淆都是在开发和构建模组时使用Forge提供的工具自动完成的，这一工具名为Forge Gradle。Gradle是一个在开发基于Java的项目时经常使用的自动化构建工具（即本章节的[搭建Minecraft 1.12.2 Forge模组开发环境](MC/Mod12/Pre/environment)中所说的“右侧的大象图标”），而Forge Gradle是一个基于Gradle的插件。Gradle使用`build.gradle`文件声明自动化构建的方式，解压Forge MDK压缩包得到的`build.gradle`文件中以下行声明了一个项目使用Forge Gradle：

```java
apply plugin: 'net.minecraftforge.gradle'
```

​	Cleanroom Mod Template的`build.gradle`文件中声明应用了什么插件的代码如下：

```groovy
plugins {
    id 'java'
    id 'java-library'
    id 'maven-publish'
    id 'com.gradleup.shadow' version '9.2.2'
    id 'xyz.wagyourtail.unimined' version '1.4.9-kappa'
    id 'net.kyori.blossom'  version '2.1.0'
}
```

​	更多有关Gradle的内容有待后续更新......

> [!IMPORTANT]
> 《我的世界：Minecraft模组开发指南》；
>
> [Harbinger](https://harbinger.covertdragon.team/)。