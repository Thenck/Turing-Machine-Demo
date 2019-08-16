# Turing-Machine-Demo
## 逻辑结构
1. 可前后移动的读写头。
2. 无限长的纸带。
3. 状态存储器。
4. 程序指令控制集合。

## 简述
简单的来说就是通过程序指令控制让纸带在读写头上前后移动写入信息，具体表现为 输入+当前状态 =》输出+后一状态。
无限长的纸带上的信息就是输入。
读写头前后移动或者在纸带上写入信息就是输出。
判断读写头前后移动亦或是写入信息的就是程序指令控制集合。
记录状态信息的就是状态存储器。

## DEMO
本DEMO距离个吃东西的例子
输入|状态|输出|下一状态
--|:--:|--:|--:
食物|饥饿|没食物（吃了就没食物了）|饱腹
食物|饱腹|往前走一步|饥饿
没食物|饥饿|食物（煮饭了有食物了）|饥饿
没食物|饱腹|往前走一步|饥饿

1. 当输入 有食物并且解饿的时候     就把食物吃了 饱腹了
2. 当输入 有食物但是出于饱腹的时候 就往前走     走动了饿了
3. 当输入 没食物并且饥饿的时候     就煮一份食物 煮了食物还没吃还是饿
4. 当输入 没食物并且饱腹的时候     就往前走     走动了饿了


这样就实现了一个简单的图灵机，根据这个demo的指令集纸带是可以永动的。
1. DEMO中Program directives 用于编写指令集
2. DEMO中Init input 用于初始化纸带上的信息（根据填写的生成一条循环250长度的纸条）
3. DEMO中init status 用于初始化第一个输入状态 并显示后续的当前状态
4. DEMO中的TAPE就是现实纸带的运行状况
5. TAPE中红色的就是读写头

