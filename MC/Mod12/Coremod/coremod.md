# 简要介绍Coremod及其基本用法

​	Coremod是Forge的一种机制，也是一种特殊的模组，与其它模组相比，它能在Minecraft正常启动、Minecraft和普通模组代码被加载前提前被加载。它并不等同于修改字节码、ASM或Mixin，这只是它的一些用途，但它确实主要被用来直接修改Minecraft和模组的源代码，除此之外，它还可以被用来提取前置模组和在Minecraft加载前对环境进行预处理。

## 声明Coremod

​	声明一个JAR中包含Coremod的方式为先将`gradle.properties`文件中的配置`is_coremod`设为`true`，再让配置`coremod_plugin_class_name`指向一个实现了$IFMLLoadingPlugin$接口的类（以下称为“入口类”）。如果该JAR不包含主类，即没有使用$@MOD$注解，则要将配置`coremod_includes_mod`设为`false`，反之则设为`true`，该设置不影响Coremod是否被显示在游戏的模组列表中。

## IFMLLoadingPlugin接口

​	Cleanroom Mod Template提供的实现了$IFMLLoadingPlugin$接口的类就是根包下的$ExampleLoadingPlugin$类，可以先将它的类名改为想要的，比如`LoadingPlugin`。

​	接下来的内容可以参考$net.minecraftforge.fml.relauncher.FMLCorePlugin$类和$net.minecraftforge.classloading.FMLForgePlugin$进行理解，在$IFMLLoadingPlugin$接口的定义中可以看到它有5个方法，这些方法及其说明如下：

- $getASMTransformerClass$：返回一个字符串数组，其中的元素为所有实现了$IClassTransformer$接口的ASM Transformer类（见本章节的[ASM Transformer](MC/Mod12/Coremod/asmt)）的完整类名（从根包一直到该类）的字符串；
- $getModContainerClass$：返回一个字符串，为一个实现了$ModContainer$接口（见本文的[ModContainer接口](MC/Mod12/Coremod/coremod?id=ModContainer类)）的类的完整类名，如果返回`null`则Coremod不会被显示在游戏的模组列表中，但是仍然能发挥作用；
- $getSetupClass$：返回一个字符串，为一个实现了$IFMLCallHook$接口（见本文的[IFMLCallHook接口](MC/Mod12/Coremod/coremod?id=IFMLCallHook接口)）的类的完整类名；
- $injectData$：获得外界传来的一些数据并进行相应操作，参数为一个$Map$对象，FML在Minecraft启动后会调用该方法并以一个$HashMap$对象作为参数，该对象包含的4对键值对如下：
    - `"mcLocation"`：一个$File$对象，表示当前运行环境下`.minecraft`文件夹在电脑上的路径，如果当前使用`runClient`任务，该路径就是`.`；
    - `"coremodList"`：一个$ArrayList$对象，表示当前运行环境下的所有Coremod；
    - `"runtimeDeobfuscationEnabled"`：一个boolean实例，指示当前是否处在混淆环境下，为真则是（即处于开发环境），反之则否（即处于一般的游戏环境）；
    - `"coremodLocation"`：一个$File$对象，表示当前运行环境下该Coremod所处文件在电脑上的路径，如果当前使用`runClient`任务，则是`null`。

- $getAccessTransformerClass$：返回一个字符串，为一个实现了$IClassTransformer$接口的Access Transformer类（见本章节的[Access Transformer](MC/Mod12/Coremod/at)）的完整类名的字符串，因为一般情况下直接使用FML提供的Access Transformer类，所以该方法可以不用重写。

​	还可以看到$IFMLLoadingPlugin$接口有5个注解，这些注解都可以用来修饰实现了该接口的类，这些注解及其说明如下：

- $@DependsOn$：属性为一个字符串数组，其中的元素为该Coremod依赖的Coremod（不清楚是不是Coremod ID的字符串）；
- $@MCVersion$：属性为一个字符串，表示该Coremod适用的Minecraft版本；
- $@Name$：属性为一个字符串，表示该Coremod的名称，会被用于$injectData$方法的`"coremodList"`所对的值中，如果不给定则默认为入口类的类名；
- $@SortingIndex$：属性为一个int值，用于建议该Coremod应该排在什么位置，只保证该值比该Coremod小的Coremod在该Coremod之前初始化，默认值为0，可以设得稍大一些，比如[Quark模组](https://github.com/VazkiiMods/Quark/blob/1.12/src/main/java/vazkii/quark/base/asm/LoadingPlugin.java)设为了1001；
- $@TransformerExclusions$：属性为一个字符串数组，其中的元素为不应被修改的类或包的完整类名或包名，其中的包下的所有类都不会被修改，该Coremod的入口类和所有类转换器都应该被包含在内，否则可能会在被修改时产生某些错误。

### ModContainer接口

​	先新建一个类并让它继承$DummyModContainer$类，为什么不直接直接实现$ModContainer$接口呢？因为实现起来太复杂了，况且$FMLCorePlugin$类使用的$FMLContainer$类也是继承自这个类，接下来参考$FMLContainer$类编写构建方法和重写$registerBus$方法。

​	可以发现构建方法中`new`了一个$ModMetadata$对象，“ModMetadata“，翻译过来就是”模组的元数据“，所以其中储存了Coremod的相关信息，可以参考`mcmod.info`文件为其字段赋值。

​	$registerBus$方法用于将Coremod注册到事件总线，使其能接收到总线发来的模组初始化等事件，其返回值代表是否注册成功，被关闭或者不需要事件的Coremod应返回`false`，所以返回值也决定了这个Coremod是否会被显示在游戏的模组列表中，不过即使返回`false`，这个Coremod的类转换器仍然会工作。

​	可以发现，$FMLContainer$类中有几个事件监听器，它们使用的注解不是一般的$@EventHandler$或$@SubscribeEvent$，而是而是$@Subscribe$。

### IFMLCallHook接口

​	FML大致希望开发者实现该接口用于进行Coremod的初始化工作，不过实际上不怎么使用该接口。要实现该接口需要实现两个方法——$injectData$方法和$call$方法，其中前者的调用是在入口类的同名方法之后，而后者的调用又在前者之后。

​	该接口的$injectData$方法收到的参数包含的4对键值对如下：

- `"mcLocation"`：同入口类的；
- `"classLoader"`：一个$RelaunchClassLoader$对象，为当前运行环境下使用的$ClassLoader$对象；
- `"coremodLocation"`：同入口类的；
- `"deobfuscationFileName"`：一个字符串，表示当前运行环境下反混淆文件的名称。

​	该接口的$call$方法一般用于模组配置。

> [!IMPORTANT]
> [基于FML的MinecraftMod制作教程 Extra编(3) – Coremod的制作](http://blog.hakugyokurou.net/?p=333)——[白玉楼之梦 - szszss' blog](http://blog.hakugyokurou.net)；
>
> [1.6.1-1.12.2 FML CoreMod大事记](https://github.com/xfl03/CoreModTutor/blob/master/book/4.2.md)——[Minecraft 1.3.2-1.15.2 原版 / FML CoreMod 开发教程](https://github.com/xfl03/CoreModTutor?tab=readme-ov-file)；
>
> [俩车的 Coremod 介绍](https://archives.mcbbs.co/read.php?tid=849970)——[MCBBS复活赛](https://archives.mcbbs.co/index_desktop.html)。