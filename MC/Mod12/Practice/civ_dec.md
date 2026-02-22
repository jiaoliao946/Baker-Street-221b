# 蜕变：装饰（Civolution:Decoration）的一些设计

## 色彩相关

​	模组蜕变：装饰（以下称为“本模组”）主要基于[Dye Depot](https://www.mcmod.cn/class/14130.html)模组和原版高版本来修改1.12.2的色彩相关内容。

### 拓展颜色

1. 重写枚举类$EnumDyeColor$

    ​	先将颜色拓展到32种，由于染料颜色枚举类$net.minecraft.item.EnumDyeColor$被用于染料物品、各种多色方块和皮革盔甲染色等大部分地方，且为了通过原版代码自动处理从而少写一些代码，使用Mixin重写该枚举类。

    ​	该枚举类的枚举常量即为各种颜色，那么怎么通过Mixin重写枚举类的枚举常量呢？如果稍微了解过枚举类的实现就应该知道，这些枚举常量也不过就是一些类型为该枚举类的公开的静态不可变字段，它们在枚举类的静态代码段开头被赋值，再组成一个数组并赋值给一个私有的静态不可变字段$\$VALUES$。

    ​	先通过`@Invoker("<init>")`获得枚举类$EnumDyeColor$的构造方法，再由构造方法得到该枚举类的新实例作为添加的新颜色并添加到数组$\$VALUES$末尾。因为数组$\$VALUES$是不可变的，所以需要使用$@Final$注解和$@Mutable$注解去除它的修饰符`final`，并通过$@Inject$注解混入静态代码段，在数组$\$VALUES$赋值之后修改它。对整个枚举类$EnumDyeColor$​的Mixin代码如下：

    ```java
    @Mixin(EnumDyeColor.class)
    public abstract class EnumDyeColorMixin {
        @Shadow
        @Final
        @Mutable
        private static EnumDyeColor[] $VALUES;
    
        @Contract(pure = true)
        @Invoker("<init>")
        // 指代构造方法
        private static @Nullable EnumDyeColor newColor(String name, int ordinal, int p_i47505_3, int p_i47505_4, String p_i47505_5, String p_i47505_6, int p_i47505_7, TextFormatting p_i47505_8) {
            return null;
        }
    
        @Contract(pure = true)
        @ModifyConstant(method = "<clinit>",
                constant = {@Constant(stringValue = "light_blue"), @Constant(stringValue = "lightBlue")})
        private static @NonNull String modifyLightBlue(String string) {
            return "sky";
        }
    
        @Inject(method = "<clinit>",
                at = @At(value = "FIELD",
                        target = "Lnet/minecraft/item/EnumDyeColor;$VALUES:[Lnet/minecraft/item/EnumDyeColor;",
                        shift = At.Shift.AFTER,
                        opcode = Opcodes.PUTSTATIC))
        // 添加颜色
        private static void edit$VALUES(CallbackInfo ci) {
            // 转存已有颜色
            List<EnumDyeColor> colors = new ArrayList<>(Arrays.asList($VALUES));
            // 新颜色的相关数据
            @SuppressWarnings("unchecked")     // 防止警告“未检查的赋值”
            ImmutableTriple<String, Integer, TextFormatting>[] datas = new ImmutableTriple[]{
                    new ImmutableTriple<>("maroon", 0x7B2713, TextFormatting.DARK_RED),
                    new ImmutableTriple<>("rose", 0xD93D43, TextFormatting.RED),
                    new ImmutableTriple<>("coral", 0xDF7758, TextFormatting.LIGHT_PURPLE),
                    new ImmutableTriple<>("indigo", 0x331E57, TextFormatting.DARK_PURPLE),
                    new ImmutableTriple<>("navy", 0x153D64, TextFormatting.DARK_BLUE),
                    new ImmutableTriple<>("slate", 0x4C5E86, TextFormatting.BLUE),
                    new ImmutableTriple<>("olive", 0x8C8F2A, TextFormatting.DARK_GRAY),
                    new ImmutableTriple<>("amber", 0xD7AF00, TextFormatting.YELLOW),
                    new ImmutableTriple<>("beige", 0xE1D5A3, TextFormatting.WHITE),
                    new ImmutableTriple<>("teal", 0x2F7B67, TextFormatting.DARK_AQUA),
                    new ImmutableTriple<>("mint", 0x38CE7D, TextFormatting.GREEN),
                    new ImmutableTriple<>("aqua", 0x5EF0CC, TextFormatting.AQUA),
                    new ImmutableTriple<>("verdant", 0x255714, TextFormatting.BLACK),
                    new ImmutableTriple<>("forest", 0x32A326, TextFormatting.DARK_GREEN),
                    new ImmutableTriple<>("ginger", 0xCF6121, TextFormatting.GOLD),
                    new ImmutableTriple<>("tan", 0xF49C5D, TextFormatting.GRAY)
            };
            // 添加新颜色
            for(short i = 16; i < datas.length + 16; ++i) {
                ImmutableTriple<String, Integer, TextFormatting> data = datas[i - 16];
                String name = data.left;
                colors.add(newColor(name, i, 47 - i, i, name, name, data.middle, data.right));
            }
            // 同步数据到$VALUES
            $VALUES = colors.toArray(new EnumDyeColor[0]);
        }
    }
    ```

    ​	枚举类的构造方法参数列表开头会隐式地添加一个字符串参数和一个int参数，这两个参数用于它们父类的构造方法，所以以上代码中也要考虑这两个参数才能正常获取到构造方法。以上代码先将数组$\$VALUES$的内容提取到一个$List$对象中，在其末尾添加新的$EnumDyeColor$对象，再变回数组并赋值给数组$\$VALUES$。可以先将新颜色的相关数据存到一个$ImmutableTriple$数组中，再通过`for`循环取出、创建$EnumDyeColor$对象并添加到末尾。

    ​	$EnumDyeColor$对象的$meta$字段和$dyeDamage$字段是随颜色倒着变化的，它们分别用于对应多色方块和染料物品的Metadata，其实如果玩游戏时仔细观察就可以发现，在创造模式物品栏中，染料是从黑色到白色，而多色方块是从白色到黑色。

    ​	对于$EnumDyeColor$构造方法的$TextFormatting$参数，笔者也不清楚具体用于做什么，随意设置了一下。

    > [!TIP|label:可选]
    > 因为新颜色的名称都是一个单词，而原版颜色中除了淡蓝色（light_blue），其余颜色也都是一个单词（淡灰色只是本地化成了淡灰色（Light Gray），代码中用的是`silver`），所以鉴于笔者的强迫症，笔者对其进行了修改。Dye Depot为了本地化名的一致性，其内置资源包可以将淡蓝色（Light Blue）本地化为天蓝色（Sky），所以通过$@ModifyConstant$注解使用`"sky"`替换枚举类$EnumDyeColor$​静态代码块中的`"light_blue"`和`"lightBlue"`，代码如下：
    >
    > ```java
    >  @Contract(pure = true)
    >  @ModifyConstant(method = "<clinit>",
    >             constant = {@Constant(stringValue = "light_blue"), 
    >                     @Constant(stringValue = "lightBlue")})
    >  private static @NonNull String modifyLightBlue(String string) {
    >      return "sky";
    >  }
    > ```
    >
    > 因为各种翻译密钥和模型绑定都是调用$EnumDyeColor$对象的$getDyeColorName$方法或$getTranslationKey$方法，所以这样修改之后，相应物品和方块的翻译密钥和模型文件的文件名也会修改，需要做出对应调整。

2. 重写$ItemDye$类

    ​	虽然枚举类$EnumDyeColor$的$colorValue$字段被用于绝大部分需要颜色值的场景，但是也有很小一部分情况下使用的颜色值是$net.minecraft.item.ItemDye$类的公开静态不可变字段$DYE\_COLORS$的元素，比如烟火之星和烟花的粒子颜色。

    ​	既然拓展了颜色，这个字段的元素也要增加，大体可以参考数组$\$VALUES$，不过$DYE\_COLORS$是一个int数组，不能直接得到对应的$List$对象，所以使用了$System.arraycopy$方法，代码如下：

    ```java
        // 用于烟花颜色
        @Shadow
        @Final
        @Mutable
        public static int[] DYE_COLORS;
    
    
        @Inject(method = "<clinit>",
                at = @At(value = "FIELD",
                        target = "Lnet/minecraft/item/ItemDye;DYE_COLORS:[I",
                        shift = At.Shift.AFTER,
                        opcode = Opcodes.PUTSTATIC))
        private static void addColor(CallbackInfo ci) {
            // 新烟花颜色放在末尾
            int[] colors = new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0x7E2818, 0xDD3F4A, 0xE37A5E, 0x2B1D51, 0x1A2459, 0x4B427A, 0x6A851B, 0xB5A400, 0xBDC994, 0x365763, 0x4FA67D, 0x67C5C7, 0x00451A, 0x008F31, 0xB05327, 0xD48C60};
            // 已有烟花颜色放到开头
            System.arraycopy(DYE_COLORS, 0, colors, 0, DYE_COLORS.length);
            // 同步数据到DYE_COLORS
            DYE_COLORS = colors;
        }
    ```

    ​	虽然Dye Depot源代码中该颜色值和枚举类$EnumDyeColor$同一颜色的颜色值一致，但是在原版中二者是不一样的，所以笔者还是基于后者做出了一定微调从而得到前者。

    ​	在1.12.2中，墨囊、可可豆、青金石和骨粉不应该是真正的染料，但是它们被当成染料使用，且拥有和其它染料一样的物品ID（Metadata不同）。因此为了保证它们的获取、用法等不变并且和其它模组兼容，不打算将它们和正常的染料拆成两个物品ID，也不改变它们的Metadata，而是在同一个物品ID下通过Metadata额外添加它们对应的真染料——黑色、棕色、蓝色和白色染料，分别对应32、33、34和35的Metadata。

    ​	再加上原版的染料物品和16种新颜色对应的染料物品，`minecraft:dye`这一物品ID下的有效Metadata就来到了36个，即0~35。需要将它们全部显示到创造模式物品栏中，通过Mixin重写$ItemDye$类的$getSubItems$方法来实现，还可以稍微调整一下显示的顺序，先显示4个假染料，再显示真染料，并用4个假染料对应的真染料替换其位置，代码如下：

    ```java
        @Unique
        // 批量添加物品到创造模式物品栏
        private void civDecoration$addItems(NonNullList<ItemStack> items, short l, short r) {
            for(short i = l; i <= r; ++i)
                items.add(new ItemStack(this, 1, i));
        }
    
        @Overwrite
        // 重写创造模式物品栏显示的物品
        public void getSubItems(CreativeTabs tab, NonNullList<ItemStack> items) {
            if(this.isInCreativeTab(tab)) {
                items.add(new ItemStack(this, 1, 0));
                items.add(new ItemStack(this, 1, 3));
                items.add(new ItemStack(this, 1, 4));
                items.add(new ItemStack(this, 1, 15));
                items.add(new ItemStack(this, 1, 32));
                civDecoration$addItems(items, (short) 1, (short) 2);
                items.add(new ItemStack(this, 1, 33));
                items.add(new ItemStack(this, 1, 34));
                civDecoration$addItems(items, (short) 5, (short) 14);
                items.add(new ItemStack(this, 1, 35));
                civDecoration$addItems(items, (short) 16, (short) 31);
            }
    }
    ```

    ​	对于染料物品的本地化，先通过Mixin重写$ItemDye$类的$getTranslationKey$方法从而修改翻译密钥，代码如下：

    ```java
        @Overwrite
        public String getTranslationKey(@NonNull ItemStack stack) {
            int i = stack.getMetadata();
            // 所有染料物品翻译密钥的公共部分
            String var10000 = super.getTranslationKey();
            // 4个假染料对应的真染料的翻译密钥特殊处理
            return var10000 + "." + (i > 31 ? switch (i) {
                case 33 -> "brown_new";
                case 34 -> "blue_new";
                case 35 -> "white_new";
                default -> "black_new";
            } : EnumDyeColor.byDyeDamage(i).getTranslationKey());
    }
    ```

    ​	因为以上代码使用了`super.getTranslationKey()`，所以其所处于的类 ，即用于混入$ItemDye$类的Mixin类必须继承$net.minecraft.item.Item$类。

    ​	再到`resources/assets/minecraft/lang`目录下的`.lang`文件中仿照原版染料物品的本地化填写，即形如`item.dyePowder.maroon.name=褐红色染料`。为了本地化名的一致性，可以将玫瑰红（Rose Red）、仙人掌绿（Cactus Green）、蒲公英黄（Dandelion Yellow）、淡灰色染料（Light Gray Dye）和淡蓝色染料（Light Blue Dye）的本地化名分别改为红色染料（Red Dye）、绿色染料（Green Dye）、黄色染料（Yellow Dye）、银灰色染料（Silver Dye）和天蓝色染料（Sky Dye）。

3. 绑定模型和材质

    ​	模型绑定倒是可以不使用Mixin，直接使用Forge的模型绑定即可，可以参考本系列文章的[物品添加](MC/Mod12/Base/item?id=绑定模型和材质-1)。不过貌似通过这种方式修改某个原版物品ID的某个Metadata的模型绑定就会挤掉该物品ID所有Metadata的模型绑定，所以需要给`minecraft:dye`下包括原版染料在内的所有Metadata都绑定模型，$RegistryHandler$类的$onModelRegistry$​方法代码如下：

    ```java
        @SubscribeEvent
        public static void onModelRegistry(ModelRegistryEvent event) {
            // 染料
            for(short i = 0; i < 32; ++i)
                CivDecoration.proxy.registerModel(Items.DYE, i, EnumDyeColor.byDyeDamage(i).getName());
            CivDecoration.proxy.registerModel(Items.DYE, 32, "black_new");
            CivDecoration.proxy.registerModel(Items.DYE, 33, "brown_new");
            CivDecoration.proxy.registerModel(Items.DYE, 34, "blue_new");
            CivDecoration.proxy.registerModel(Items.DYE, 35, "white_new");
    
            // 一般模组物品
            for(Item item : ITEMS)
                if(item instanceof ItemSubtypeBase) {
                    short i = 0;
                    for (String name : ((ItemSubtypeBase) item).getSubtypeNames())
                        CivDecoration.proxy.registerModel(item, i++, name);
                } else CivDecoration.proxy.registerModel(item);
    }
    ```

    ​	其中的$Items$类指的是$net.minecraft.init.Items$​类。而后的材质绑定就非常简单了，仿照原版即可，即模型文件名称形如`dye_maroon.json`，内容形如：

    ```json
    {
        "parent": "item/generated",
        "textures": {
            "layer0": "items/dye_powder_maroon"
        }
    }
    ```

    ​	材质文件名形如`dye_powder_maroon.png`，可以顺便把原版染料物品的材质也换成新版本的或Dye Depot内置资源包的。

4. 矿物词典和合成配方

    ​	增删矿物词典不需要使用Mixin，增删的内容包括：

    - 将4个假染料分别从`dyeBlack`、`dyeBrown`、`dyeBlue`和`dyeWhite`中移除且从`dye`中移除；
    - 将4个假染料对应的真染料分别添加到`dyeBlack`、`dyeBrown`、`dyeBlue`和`dyeWhite`中；
    - 将16个新染料分别添加到`dyeMaroon`、`dyeRose`和`dyeCoral`等中。
    
    ​	但是被添加到矿物词典的新染料并不会在给皮革盔甲染色时真正被认为是染料，所以还需要修改$net.minecraftforge.oredict.DyeUtils$类的私有的静态不可变字段$dyeOredicts$和公共的静态方法$colorFromStack$。$colorFromStack$方法中本来使用的是$byMetadata$方法，但是考虑到未来的设计中可能会让一个meta对应两种颜色，所以改用$byDyeDamage$方法，数组$dyeOredicts$的顺序也要改成从黑到白再从褐红到淡棕。笔者直接将所用的Mixin类写成了$EnumDyeColorMixin$类的内部类，代码如下：
    
    > [!WARNING]
    > 由于枚举类$EnumDyeColor$被用于大部分多色方块，而增多了它的枚举常量后还没有对这些多色方块进行相应的重写，所以只完成以上的步骤后虽然可以成功构建模组，但是会在进入游戏时崩溃。

### 多色方块

​	潜影盒

### 模组支持

​	

## 岩石相关



> [!IMPORTANT]
> [Dye Depot的源代码](https://github.com/N1nn1/dye_depot/)。
