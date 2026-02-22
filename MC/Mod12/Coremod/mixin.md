# 使用Mixin

## 基本知识

### 简介

​	“Mixin”，即“Mix in”，意为“混入”，它是一个功能强大而用法简约的工具，能够帮助开发者在运行期间操纵运行的代码，与反射和方法句柄不同，它直接对目标类的字节码进行操作。Mixin是通过ASM Tree实现的，它可以将Coremod开发者从硬核地修改字节码中解放出来，转为使用标准的Java代码。

### 由来

​	[Mixin](https://github.com/SpongePowered/Mixin)最初是由[Sponge](https://spongepowered.org/)开发的，而后有了用于Fabric并自带[MixinExtras](https://github.com/LlamaLad7/MixinExtras)的[分支](https://github.com/FabricMC/Mixin)，基于该分支又有了用于Minecraft低版本Forge的分支[UniMix](https://github.com/LegacyModdingMC/UniMix)，而Cleanroom使用的[Mixin](https://github.com/CleanroomMC/MixinBooter-UniMix)就是由UniMix修改而来。

### Mixin类

​	Mixin是对类的修改，它的主要功能是在一个目标类中混入部分代码，每个目标类都对应一个Mixin类，在这个Mixin类中存有要混入目标类的代码。Mixin类与其目标类的结合即Mixin类的应用，这发生在各种类转换器的应用之后。虽然Mixin类的定义和一般的类无异，但是它不应该被认为是真正的类，因为它永远不应该被实例化，而是在运行时被应用于它的目标类，因而将它视为存在于它的目标类中更有利于程序的设计。

## 工作准备

### Coremod相关

​	如果想使用Mixin修改原版或Forge的类，则需要先声明该JAR中包含Coremod，具体操作见本章节的[简介](MC/Mod12/Coremod/coremod)。对于实现了$IFMLLoadingPlugin$接口的Coremod入口类，其中的$getASMTransformerClass$方法和$getAccessTransformerClass$方法分别用于ASM Transformer和Access Transformer，与Mixin无关，如果不使用，可以不需要重写。

### 配置

​	Mixin的配置文件放在`resources`文件夹根目录，其中用于混入原版和模组代码的分别为`modid.default.mixin.json`和`modid.mod.mixin.json`。常用的配置及其说明如下：

|        配置        |   类型   |                             说明                             |
| :----------------: | :------: | :----------------------------------------------------------: |
|      package       |  string  | 必填，存放Mixin类的包，在运行时，该包下的所有类都会被放到$LaunchClassLoader$对象的$transformerExceptions$字段中，即不会被各种类转换器考虑 |
|       mixins       | [string] |    同时用于客户端和服务端的Mixin类，地址相对`package`的值    |
|       client       | [string] |        用于物理客户端的Mixin类，地址相对`package`的值        |
|       server       | [string] |        用于物理服务端的Mixin类，地址相对`package`的值        |
|      priority      |   int    |              该配置文件被载入的优先级，默认为0               |
|       plugin       |  string  | 可以在运行时修改Mixin配置的插件类的完整类名，该类需要实现$IMixinConfigPlugin$接口（见本文的[IMixinConfigPlugin接口](MC/Mod12/Coremod/mixin?id=IMixinConfigPlugin接口)） |
|      required      | boolean  | 是否在任意一个Mixin类未成功注入时报错并终止游戏，默认为`false` |
|     minVersion     |  string  |       Mixin的最低兼容版本，会忽略高于该版本的Mixin特性       |
|   setSourceFile    | boolean  |       Mixin类是否会重写其目标类的元数据，默认为`false`       |
|      verbose       | boolean  |               是否启用详细日志，默认为`false`                |
|   mixinPriority    |   int    |             所有Mixin类的默认优先级，默认为1000              |
|       parent       |  string  |                       此配置继承的配置                       |
|       target       |  string  | 该配置适用的环境，默认为`@env(DEFAULT)`，还可以为`@env(PREINIT)`、`@env(INIT)`和`@env(MOD)` |
| compatibilityLevel |  string  |                兼容的JAVA版本，形如`"JAVA_8"`                |

​	如果使用IntelliJ IDEA，建议安装插件`Minecraft Development`以辅助Mixin使用，比如为Mixin类提供代码建议以将其自动添加到`"mixins"`、`"client"`或`"server"`中。

### 其它

​	一般在根包下的`mixin`包中存放所有的Mixin类，用于修改原版代码的Mixin类一般直接放在该包下，而用于修改模组代码的Mixin类一般放在该包下的`mod`包中。如果不需要混入[HEI](https://www.mcmod.cn/class/5881.html)的代码，可以把根包下的`mixin.mod.hei`包删去。

## 具体用法

### 可用注解

1. $@Mixin$

    ​	通过$@Mixin$​注解修饰一个类以使其成为Mixin类，Mixin类的类名一般为`目标类类名Mixin`，比如当目标类的类名为`Minecraft`时，其Mixin类的类名应该为`MinecraftMixin`。

    ​	该注解的属性及其说明如下：

    |   属性   |    类型    |                             说明                             |
    | :------: | :--------: | :----------------------------------------------------------: |
    |  value   | Class<?>[] |        当目标类公开时，使用该属性，值为其$Class$对象         |
    | targets  |  String[]  | 当目标类非公开时，使用该属性，值为其完整类名，若使用内部类，用`$`替代`.` |
    | priority |    int     | 该Mixin类的优先级，用于和其它有相同目标类的Mixin类比较，越小越先应用 |
    |  remap   |  boolean   | 是否对方法和成员名称进行重映射，默认为`true`，当目标类为模组的类时，应为`false` |

    ​	Mixin类一般被设置为抽象类，从而减少用于通过编译的非必要代码。Mixin类的父类可以不是其目标类的父类，而是目标类向上的任意一级父类，比如目标类父类的父类。可以让Mixin类实现某个其目标类没有实现的接口。

    ​	若Mixin类与其目标类继承的父类不同，在Mixin类中通过`super`调用父类的某方法，则会调用其目标类的父类的该方法。当Mixin类与其目标类继承的父类不同时，对于动态绑定的内容，比如`super`，会分析目标类向上每一级父类的层次结构，这需要额外的开销，所以一般情况下应该让Mixin类与其目标类继承同一个父类。

2. $@Shadow$

    ​	在Mixin类中无法直接使用目标类的成员，不过被$@Shadow$注解修饰的成员可以在Mixin类中指代目标类的同名字段或相同签名的方法，这种方法一般会被设置为抽象方法以减少用于通过编译的非必要代码。使用$@Shadow$无法直接指代构造方法和静态代码块。

    ​	该注解的属性及其说明如下：

    |  属性   |   类型   |                             说明                             |
    | :-----: | :------: | :----------------------------------------------------------: |
    | prefix  |  String  | 在应用Mixin时自动剔除的标识符前缀，从而应对编译器在两个方法同名且同参数时报错等 |
    |  remap  | boolean  |                         同$@Mixin$的                         |
    | aliases | String[] |    此成员的别名，只用于可能因某些影响而名称发生变化的成员    |

    ​	指代目标类中静态成员的Mixin类成员也需要是静态的。

3. $@Final$

    ​	当通过$@Shadow$指代的字段在目标类中为不可变字段时，在Mixin类中该字段应该被$@Final$注解或`final`修饰，该注解没有属性。

    ​	如果该字段在目标类中还是静态字段，那么在Mixin类中该字段一般采用$@Final$修饰，因为如果还被`final`修饰，就是静态不可变字段，为了满足语法，需要给定一个无用处的初始值。

4. $@Mutable$

    ​	对于通过$@Shadow$指代的目标类的不可变字段，在Mixin类中用$@Mutable$注解修饰该字段可去除它在目标类中的`final`修饰符，该注解没有属性。

5. $@Invoker$

    ​	在Mixin类中，被$@Invoker$注解修饰的方法会被自动实现为目标类的某个方法（以下称为”目标方法“），目标方法可以是私有或保护方法。如果被修饰的是抽象方法，它也会被自动实现。被修饰的方法必须和目标方法有同样的参数列表。

    ​	该注解常用的属性及其说明如下：

    | 属性  |  类型   |         说明         |
    | :---: | :-----: | :------------------: |
    | value | String  | 要实现的方法的方法名 |
    | remap | boolean |     同$@Mixin$的     |

    ​	可以通过$@Invoker$调用目标类的构造方法，使用`@Invoker("<init>")`即可，但不能调用静态代码块。

6. $@Unique$

    ​	在Mixin类中，被$@Unique$注解修饰的成员可以被添加到目标类中，如果在目标类中存在和它同名的同类型（同为字段或同为方法）成员，则会在应用Mixin时报错，除非将该注解的属性$silent$设为`true`，不过一般不推荐这么做，因为可能会带来潜在的问题。

7. $@Inject$

    ​	在Mixin类中，被$@Inject$注解修饰的方法被称为注入器，其中的内容会被注入目标类的某个方法（以下称为”目标方法“），接下来的内容可以参考根包下的$mixin.MinecraftMixin$类进行理解。

    ​	该注解只能被用于修饰方法，方法名随意（可以取为`被注入方法的方法名Inject`，比如当目标方法为`createDisplay`时，取为`createDisplayInject`），但方法的返回值类型必须为`void`，且参数为目标方法的参数后面再加一个$CallbackInfo$类的参数或$CallbackInfoReturnable$类的参数。

    ​	该注解常用的属性及其说明如下：

    |    属性     |   类型   |                       说明                        |
    | :---------: | :------: | :-----------------------------------------------: |
    |     id      |  String  |     用于此注入器的标识符，默认为目标类的类名      |
    |   method    | String[] |                  目标方法的签名                   |
    |   target    |  Desc[]  |       更加准确地指定目标方法，比如它的签名        |
    |     at      |  @At[]   |                    注入的位置                     |
    | cancellable | boolean  | 是否能在要注入的语句中退出目标方法，默认为`false` |
    |    remap    | boolean  |                   同$@Mixin$的                    |

    ​	在注入器中，对$CallbackInfo$类的参数$ci$调用$getId$方法可得到该注入器的标识符。若属性$cancellable$的值为`true`，则对参数$ci$调用$cancel$方法相当于在目标方法中执行`return ;`语句，若为`false`，则调用该方法会报错。

    ​	调用$cancel$方法是不会通过目标方法返回值的，若想要返回值，则需要改为使用$CallbackInfoReturnable$类的参数$cir$，$CallbackInfoReturnable$类是一个泛型，其类型参数为返回值类型，调用参数$cir$的$setReturnValue$方法即可修改返回值。

    ​	当注入构造方法和静态代码块时，属性$method$的值应分别为`"<init>"`和`"<clinit>"`，不过不能注入到构造方法开头，因为构造方法开头必须显式或隐式地调用其父类的构造方法。

8. $@ At$

    ​	$@ At$注解常被用作属性$at$的值从而指示在方法中注入的位置，该注解的属性及其说明如下：

    |  属性  |  类型  |                             说明                             |
    | :----: | :----: | :----------------------------------------------------------: |
    |   id   | String |  用于此注入器的标识符，完整标识符形如`@At的id:@Inject的id`   |
    | value  | String | 注入的位置，可以是`HEAD`、`RETURN`、`TAIL`、`INVOKE`、`INVOKE_ASSIGN`、`FIELD`、`NEW`、`INVOKE_STRING`、`JUMP`或`CONSTANT` |
    | slice  | String |     指定$@Inject$使用的$Slice$对象的$id$，对其它注解无效     |
    | shift  |  enum  | 微调注入位置，默认为`NONE`，还可以为`BEFORE`、`AFTER`或`BY`，分别将注入位置移动到该位置之后、之前和由属性$by$决定 |
    |   by   |  int   |   负数表示向前多少行，正数表示向后多少行，绝对值不应大于3    |
    | target | String | 目标成员的签名，用于当$value$为`INVOKE`、`INVOKE_STRING`、`INVOKE_ASSIGN`、`FIELD`或`NEW`时 |
    | opcode |  int   | 检索的操作码，必须为枚举类$org.objectweb.asm.Opcodes$的枚举常量$GETFIELD$、$PUTFIELD$、$GETSTATIC$、$PUTSTATIC$或$JUMP$，用于当$value$为`FIELD`或`JUMP`时 |

    ​	$value$属性各种可能取值及其说明如下：

    - `"HEAD"`：方法开头；
    - `"RETURN"`：所有`return`语句前；
    - `"TAIL"`：方法结尾的`return`语句前；
    - `"INVOKE"`：调用$target$属性指定的方法前；
    - `"FIELD"`：某条字节码之前，该字节码的操作码和参数分别由$opcode$属性和$target$属性指定；

9. $ModifyConstant$

    ​	

10. $@Redirect$

    ​	

> [!CAUTION]
> $@Redirect$和$@Overwrite$极具侵入性，很容易导致冲突，一般不推荐使用。

6. $@Overwrite$

    ​	在Mixin类中，被$@Overwrite$注解修饰的成员会覆盖目标类中同名字段或相同签名的方法。当应用Mixin时，如果多个Mixin类都尝试覆盖同一个方法，只有一个能成功，其它的都会失败并导致游戏崩溃。
    
    ​	该注解的属性及其说明如下：
    
    |    属性     |   类型   |                 说明                 |
    | :---------: | :------: | :----------------------------------: |
    | constraints |  String  | 为使此次覆盖成功而必须验证的约束条件 |
    |   aliases   | String[] |            同$@Shadow$的             |
    |    remap    | boolean  |             同$@Mixin$的             |

### IMixinConfigPlugin接口

​	$IMixinConfigPlugin$接口中的方法

​	不要将实现了$IMixinConfigPlugin$接口的插件类放到存放Mixin类的包下，否则可能会无法被检索到。

> [!IMPORTANT]
> [Introduction to Mixins   Understanding Mixin Architecture](https://github.com/SpongePowered/Mixin/wiki/Introduction-to-Mixins---Understanding-Mixin-Architecture)、[Introduction to Mixins   The Mixin Environment](https://github.com/SpongePowered/Mixin/wiki/Introduction-to-Mixins---The-Mixin-Environment)——[Mixin官方Wiki](https://github.com/SpongePowered/Mixin/wiki)；
>
> [注解](https://docs.mihono.cn/zh/develop/modding/Mixin/annotation/)——[CryChic文档](https://docs.mihono.cn/zh/)；
>
> [配置](https://cleanroommc.com/zh/wiki/forge-mod-development/mixin/environment/configuration)——[CleanroomMC](https://cleanroommc.com/zh/)；
>
> [如何改MC代码？最全最易懂的Mixin+AccessWidener教程，学完变大佬！](https://blog.csdn.net/qq_36912579/article/details/135503363)——[CSDN](https://www.csdn.net/)；
>
> [配置](https://github.com/xfl03/CoreModTutor/blob/master/book/5.1.md)、[注入](https://github.com/xfl03/CoreModTutor/blob/master/book/5.3.md)——[Minecraft 1.3.2-1.15.2 原版 / FML CoreMod 开发教程](https://github.com/xfl03/CoreModTutor?tab=readme-ov-file)。