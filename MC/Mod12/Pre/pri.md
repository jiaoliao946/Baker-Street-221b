# 理解初级概念

## 资源管理

### Resource Location

​	狭义上的资源（Resource）指的是`resources`目录下的资源文件，这些文件大多可以和资源包里的文件对应，比如贴图材质、方块物品模型和合成表等。广义上的资源指所有Minecraft中有独立意义的概念，比如方块、物品和生物等。

​	无论是哪种资源，在Minecraft中都是通过Resource Location管理的，对应代码中的$net.minecraft.util.ResourceLocation$类，因此Resource Location也用于注册表。一个Resource Location通常会有一个资源域（Resource Domain）和一个资源路径（Resource Path），每个模组的所有资源的资源域都是该模组的ID，对于Minecraft原版则是`minecraft`。通常表示一个Resource Location的形式是`资源域:资源路径`，比如`minecraft:lava`表示一个岩浆方块，`immersiveengineering:ore`表示沉浸工程里的矿物方块。

​	特定的Resource Location对应特定位置的资源文件，资源域决定了资源的目录，若资源域是`resource_domain`，则资源位于`resources/assets/resource_domain`目录下；资源路径决定了资源的文件名，如果`resource_path`是资源路径，那么资源文件可以是`resource_path.json`、`resource_path.png`等，由具体情况决定。

​	所有资源的文件名和路径上的文件夹名都应该采用字母小写、单词间以`_`分隔的形式，这一项规则在1.11以上是强制的，因此资源域（即模组ID）和资源路径也应该采用这样的命名形式。当然所谓“单词间以`_`分隔”并不是指会检测单词并要求单词间一定分隔，比如`immersiveengineering`和`immersive_engineering`都是可行的。

### pack.mcmeta

​	由于FML将模组中的资源文件以资源包的形式加载，`resources`文件夹根目录的`pack.mcmeta`文件是用于描述资源包的文件，该文件的格式也是JSON。在其中的`"pack"`下，`"_comment"`是注释，与具体内容无关；`"description"`是描述，虽然并不会被显示；`"pack_format"`是资源包版本，Minecraft1.11和1.12使用的版本是3，其它Minecraft版本见[格式版本列表](https://zh.minecraft.wiki/w/Pack.mcmeta?variant=zh-cn#%E6%A0%BC%E5%BC%8F%E7%89%88%E6%9C%AC%E5%88%97%E8%A1%A8)。

## 客户端和服务端

​	对于Minecraft1.12.2原版，客户端文件是`.minecraft/versions/1.12.2/1.12.2.jar`文件，服务端文件一般从官网下载，其名称通常为`minecraft_server.jar`。在开发环境中也可以通过`runClient`任务和`runServer`任务分别启动客户端和服务端。虽然Minecraft客户端和服务端的文件是不同的，但其中的大部分代码应该是相同的，而且编写模组时也希望最终得到的JAR是能同时用于两个端的，不需要分别为两个端使用不同的JAR。所以了解客户端和服务端的差异对于模组开发者是必要的。

### 基本概念

​	在单人游戏时，会同时开启一个客户端和一个本地服务端，整个游戏建立在客户端和服务端的交互上，而Minecraft使用Java中不同的线程（Thread）分别运行客户端和服务端。客户端线程创建客户端的对象，服务端线程创建服务端的对象，二者不应跨线程存取。为了区分Minecraft运行方式不同和线程不同所带来的客户端和服务端的差异，将其分为物理端和逻辑端：

- 使用类似`minecraft_server.jar`的JAR开启服务端，启动的是物理服务端（Physical Server Side）；
- 使用类似`1.12.2.jar`的JAR启动Minecraft游戏，启动的是物理客户端（Physical Client Side）；
- 加载世界后启动的服务端线程被称为逻辑服务端（Logical Server Side）；
- 启动Minecraft游戏后使用的客户端线程被称为逻辑客户端（Logical Client Side）。

​	因此实际情况为：

- 玩家退出世界后，玩家的物理客户端只会运行一个逻辑客户端；
- 玩家打开一个本地世界后，玩家的物理客户端会开启一个逻辑服务端，并将其和玩家的逻辑客户端连接从而进行游玩；
- 玩家连接多人服务器时，是在试图用物理客户端连接服务器的物理服务端，同时玩家的逻辑客户端试图进入服务器的逻辑服务端游玩。

### 单端操作

​	服务端（以后的“客户端”和“服务端”一般指逻辑端）主要用于计算游戏逻辑，而客户端通常进行绘图渲染，但有很多事件会同时在客户端和服务端各触发一次，比如$EntityJoinWorldEvent$，并且存在一些方式让操作只在某一端执行。

1. $isRemote$字段

    ​	$World$对象的$isRemote$字段为`true`则该对象运行在客户端，反之则运行在服务端。在物理服务端中这个值永远为`false`，但是这个值为`false`并不意味着该对象一定在物理服务端中，因为这个值也可以在物理客户端的逻辑服务端中为`false`。

    ​	可以这个值来判断接收到的某事件是在客户端上还是服务端上触发，并根据端的不同执行相应操作，这个判断方式一般是首选，除了代理之外，很少会需要其它判断方式。

2. $@SidedProxy$注解和$@SideOnly$注解

    ​	本章节的[首次构建](MC/Mod12/Pre/init)中提到的代理用到了$@SidedProxy$，用它修饰一个字段且它的两个属性分别指向两个不同的类，而FML将根据运行的物理端实例化对应的类，这样就可以让某些方法在物理服务端上和在物理客户端上有不同的行为。

    ​	被$@SideOnly$修饰的方法或字段会在与该注解的属性值不同的物理端上被彻底抹去（若调用则会报错——`NoSuchMethodException`），该注解的属性值只能为$Side.CLIENT$或$Side.SERVER$，该注解不应直接使用在代码中，只有在重写已经使用该注解修饰的原版方法时才能使用它。

3. $getEffectiveSide$方法和$getSide$方法

    ​	$getEffectiveSide$方法通过检测当前正在运行的线程名称猜测所在的逻辑端，由于它只是一个猜测，这个方法只应该在其他方式都不可行时才使用。
    
    ​	$getSide$方法可以用来获取代码所运行的物理端，它是在启动时就决定的，因而不依赖于猜测以得到结果，然而这个方法的调用情况很少。

### 越逻辑端访问

​	越逻辑端访问其实经常是不经意间由静态字段造成的，由于单人游戏中客户端和服务端共享同一个JVM，两个线程读写同一个静态字段将会导致各种各样的竞争情况和多线程的经典问题。这个错误也会由从运行在或能运行在逻辑服务端上的共享代码访问仅限物理客户端的类所造成。

​	因此当需要从一个逻辑端传输信息到另一个时，必须使用网络数据包（Packet），尽管在单人游戏中直接从服务端到客户端传输数据很方便。这个错误经常会被新手忽略，因为新手常常只在物理客户端上调试，虽然代码可以运行在物理客户端上，但它们会在物理服务器上崩溃。

## 事件系统

### 事件订阅

​	除了之前提到的生命周期事件，模组开发中经常遇到的就是Forge为Minecraft提供的各种游戏事件，比如玩家进入了世界、玩家破坏了一个方块、玩家捡起了一个物品等。

​	Minecraft游戏事件的触发机制和生命周期事件类似，但是为了与生命周期事件区分，$@SubscribeEvent$注解取代了$@EventHandler$，指示哪些方法是事件监听器。将这些监听器方法放到一个类$MiscHandler$下，并在Forge的对应事件总线中注册即可，注册时在主类的构造方法中添加以下代码其一：

```java
MinecraftForge.EVENT_BUS.register(MiscHandler.class);     // 监听器方法是静态的
MinecraftForge.EVENT_BUS.register(new MiscHandler());     // 监听器方法不是静态的
```

​	此处使用的是一般事件总线$EVENT\_BUS$，矿物生成总线和地形生成总线分别为$ORE\_GEN\_BUS$和$TERRAIN\_GEN\_BUS$。

​	对于一般游戏事件，也有另一种方式，需要使用$@EventBusSubscriber$注解修饰$MiscHandler$类，从而指示该类中包含多个一般游戏事件的监听器，在这个类中，代表事件监听器的方法只能为静态的。使用$@EventBusSubscriber$相当于Forge在构造主类时自动执行了在一般事件总线的注册。

​	接下来是实战——使用事件系统在玩家进入世界时发送一条欢迎消息，先随意在根包下的某个目录处新建一个类$MiscHandler$，采用$@EventBusSubscriber$加$@SubscribeEvent$的方式监听事件$EntityJoinWorldEvent$，并对接收的事件调用$getEntity$方法，再判断返回值的类型是否为玩家，若是则对该返回值调用$sendMessage$方法发送消息，方法的参数的类型为$TextComponentString$​，代码如下：

```java
@Mod.EventBusSubscriber
public class MiscHandler {
    @SubscribeEvent
    public static void onPlayerJoin(@NonNull EntityJoinWorldEvent event) {
        Entity entity = event.getEntity();
        if (event.getWorld().isRemote && entity instanceof EntityPlayer) {
            String message = "Welcome to Civolution, " + entity.getName() + "!";
            TextComponentString text = new TextComponentString(message);
            entity.sendMessage(text);
        }
    }
}
```

> [!TIP]
>
> IntelliJ IDEA有时会有一些添加注解的建议，并在该行左侧显示为一个黄色的`@`，以上代码中的`@NonNull`就是由此而来，IntelliJ IDEA还会有一些其它的代码建议，主要显示为黄色的下波浪线，它们大多都可以悬停在上方并在弹出的说明中一键采用。

​	为了防止将同一条消息发送两遍，在`if`语句中加入了`event.getWorld().isRemote`，这样只会在接收到客户端的事件时发送消息。

### 子事件

​	很多事件都有它们自己的不同变种，事件的变种虽然不同但它们都基于共同的因子（比如 $PlayerEvent$），或是一个有多个阶段的事件（比如$PotionBrewEvent$）。要注意的是，如果你监听了父事件类，那么这个事件监听器将会在该父事件的任一子类触发时被调用。

### 监听器的优先级

​	同一个事件可以被多个监听器监听，并且可以设置监听器的优先级，设置方式为修改$@SubscribeEvent$的属性$priority$，可填的属性值为枚举类型$EventPriority$里的任何值，由高到低分别为$HIGHEST$、$HIGH$、$NORMAL$、$LOW$和$LOWEST$。

### 事件的取消与“结果”

​	被$@Cancelable$注解修饰的事件可以被取消，使用`event.setCanceled(true)`取消监听器接收的事件$event$（参数若为`false`则重新启用），事件被取消后，默认不会再将事件传递给下一个监听器。只有被$@Cancelable$修饰的事件可以被取消，对不可取消的事件调用$setCanceled$方法（无论参数为什么）会报错—— `UnsupportedOperationException`。

​	其实可以选择接收被取消的事件，只需要将$@SubscribeEvent$的属性$receiveCanceled$设为`true`。

​	被$@HasResult$注解修饰的事件可以返回一个“结果”，使用`event.getResult()`得到监听器接收的事件$event$返回的结果，结果只能为`DENY`（停止事件）、`DEFAULT`（使用原版行为）或`ALLOW`（强制动作发生）。不同的事件可能对结果有不同的用法，使用一个事件的结果之前请先查看该事件的注释。

​	其实还可以使用`event.getResult(Event.Result.DENY)`将事件的结果设定为`DENY`，另外两个类似。

### 自定义事件

​	自定义事件类时继承$Event$类即可，自定义的事件类同样可以被$@Cancelable$和$@HasResult$​修饰，要注意的是，事件中的字段都应该是不可变的。在一般事件总线中发布一个自定义事件时使用类似以下的代码：

```java
boolean result = MinecraftForge.EVENT_BUS.post(new MyEvent());
```

​	$post$方法的返回值为`true`表示事件被取消，为`false`表示事件成功发布，因此若这个事件无法被取消（即无$@Cancelable$），则一定会返回`false`。

> [!IMPORTANT]
> 《我的世界：Minecraft模组开发指南》；
>
> [事件概论](https://harbinger.covertdragon.team/chapter-03/)、[物理端、逻辑端与网络IO](https://harbinger.covertdragon.team/chapter-07/)——[Harbinger](https://harbinger.covertdragon.team/)；
>
> [资源](https://mcforge-cn.readthedocs.io/zh/latest/concepts/resources/)、[Minecraft中的Side](https://mcforge-cn.readthedocs.io/zh/latest/concepts/sides/)、[事件](https://mcforge-cn.readthedocs.io/zh/latest/events/intro/)——[Minecraft Forge官方文档的中文翻译](https://mcforge-cn.readthedocs.io/zh/latest/)。
