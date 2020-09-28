# C语言基本数据类型

C语言中基本数据类型只有以下几类，且每种类型数据在32位和64位机器上占用的字节数并不一致。

| 类型   | 占用字节数（32位） | 占用字节数（64位） |
| ------ | ------------------ |
| char   | 1                  | 1                  |
| short  | 2                  | 2                  |
| int    | 4                  | 4                  |
| long   | 4                  | 8                  |
| float  | 4                  | 4                  |
| double | 8                  | 8                  |

可以使用下面的一个程序来查看C语言每种数据类型在自己机器上占用字节数。
```c
#include<stdio.h>
int main(){
	printf("char type %d\n",sizeof(char));
	printf("short type %d\n",sizeof(short));
	printf("int type %d\n",sizeof(int));
	printf("long type %d\n",sizeof(long));
	printf("float type %d\n",sizeof(float));
	printf("double type %d\n",sizeof(double));
}
```
在笔者机器上运行打印出 long type 8，证明笔者其实是64位的。
>long type 8


## 基本数据的符号

在整型数据（char，short，int，long）中，都是可以指定数据是否是有符号的。因此各个数据类型所表示的范围就可以确定。下面我们分析char和int类型的符号问题

| 数据类型      | 数据范围                     |
| ------------- | ---------------------------- |
| char          | -128~127                     |
| unsigned char | 0~255                        |
| int           | -2,147,483,648~2,147,483,647 |
| unsigned int  | 0~4,294,967,295              |
尽管char的数据范围是-128~127，但是我们可以赋值给char类型-128~255之间的任意数字。同理，unsigned char也可以被赋值-128~255之间的任意数字。比如以下定义是合法的。
```c
	char c1 = 255;
	unsigned char c2 = -128
```