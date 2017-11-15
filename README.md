# VirtualScroll (虚拟滚动条)
A lightweight custom virtual scrollbar plug-in

一个轻量级的自定义虚拟滚动条, 可以使一个DIV瞬间变身滚动窗口，而且支持个性化配置，可以打造与现有UI统一的分格
> 注意：不支持 IE9 及以下版本浏览器
#### 示例
> 请下载这个库，然后打开 examples 文件夹，运行 index.html 查看全部示例

##  很好很强大，值得拥有！

## 如需修复bug或增强功能 ，请联系 : 116485961@qq.com
#### 安装方法
```js
npm install virtualscroll --save
```
#### 推荐使用方法

##### 方法一
```js
const vs = require('virtualscroll ');
let boxa = document.querySelector('.boxa');
vs(boxa, {
    // 其它配置项
});
```
##### 方法二
```js
import vs from 'virtualscroll';
let boxa = document.querySelector('.boxa');
vs(boxa, {
    // 其它配置项
});
```
> 非构建环境，请直接在页面引入 "node_modules/VirtualScroll/build/VirtualScroll.js"
```js
<script src="node_modules/VirtualScroll/build/VirtualScroll.js"></script>
let boxa = document.querySelector('.boxa');
 VirtualScroll(boxa, {
                WheelStep: 50,
                VSwidth: 8,
                HSheight: 8,
                VScursor: 'pointer',
                VBbgColor: 'rgba(255,255,255, 0)',
                VSradius: '4px',
                // 其它配置项...
            });
```

> 参数一：传入一个dom 单对象 （必选参数）

> 参数二：配置项Obj (可省略的参数，省略以后将使用默认配置项)

> 返回值：实例对象Object (可以用这个对象调用 public 方法和成员变量)
##### 默认配置项
```js
{
        CurrentPosition: [0, 0], // 滑块的当前位置。默认：[0,0], 第1个元素表示水平滚动滑块滑动距离的百分比, 第2个元素表示垂直滚动滑块滑动距离的百分比, 取值 0 - 1，表示百分比
        VBwidth: 16, // 垂直滚动条的宽度 默认 16px
        HBheight: 16, // 水平滚动条的高度 默认 16px
        VSwidth: 16, // 垂直滑块的宽度 默认 16px
        HSheight: 16, // 水平滑块的高度 默认 16px
        VBborder: 'none', // 垂直滚动条的边线 例如： "1px solid #000" 或 "1px solid rgba(255,0,0,.5)"
        HBborder: 'none', // 水平滚动条的边线 例如： "1px solid #000" 或 "1px solid rgba(255,0,0,.5)"
        VSborder: 'none', // 垂直滑块的边线 例如： "1px solid #000" 或 "1px solid rgba(255,0,0,.5)"
        HSborder: 'none', // 水平滑块的边线 例如： "1px solid #000" 或 "1px solid rgba(255,0,0,.5)"
        VBbgColor: '#f0f0f0', // 垂直滚动条的背景颜色(透明度请用RGBA)
        HBbgColor: '#f0f0f0', // 水平滚动条的背景颜色(透明度请用RGBA)
        VSbgColor: '#cdcdcd', // 垂直滚动滑块的背景颜色(透明度请用RGBA)
        VSoverColor: '#ababab', // 垂直滚动滑块鼠标经过的颜色(透明度请用RGBA)
        VSclickColor: '#606060', // 垂直滚动滑块鼠标点击的颜色(透明度请用RGBA)
        HSbgColor: '#cdcdcd', // 水平滚动滑块的背景颜色(透明度请用RGBA)
        HSoverColor: '#ababab', // 水平滚动滑块鼠标经过的颜色(透明度请用RGBA)
        HSclickColor: '#606060', // 水平滚动滑块鼠标点击的颜色(透明度请用RGBA)
        VBradius: '0', // 垂直滚动条圆角 可以输入一个字符串 '4px' 或 '2em 1em 4em / 0.5em 3em' 或 '4px 4px'
        VSradius: '0', // 垂直滚动滑块圆角 可以输入一个字符串 '4px' 或 '2em 1em 4em / 0.5em 3em' 或 '4px 4px'
        HBradius: '0', // 水平滚动条圆角 可以输入一个字符串 '4px' 或 '2em 1em 4em / 0.5em 3em' 或 '4px 4px'
        HSradius: '0', // 水平滚动滑块圆角 可以输入一个字符串 '4px' 或 '2em 1em 4em / 0.5em 3em' 或 '4px 4px'
        VScursor: 'default', // 鼠标移动到垂直滚动滑块上的形状，默认是 default
        HScursor: 'default', // 鼠标移动到水平滚动滑块上的形状，默认是 default
        WheelNeed: true, // 是否需要滚轮滚动，默认是 true , 如果不需要，设置为 false
        WheelStep: 80, // 滚轮滚动时单步滑动的距离 单位是 px (也包括鼠标点击滚动条时的单步滑动距离)
        WheelBubble: true, // 当滚轮滚动到底或顶时，是否将事件冒泡到 document , 设置 false 表示不冒泡到 document , true 表示冒泡到 document
        AutoShow: false, // 鼠标移入时显示移出时隐藏滚动条，true 表示响应鼠标移入移出， false 表示不响应鼠标移入移出
        TransitionDuration: '.2s', // 动画的执行时间(影响滚动条的颜色切换时间，影响滑块的透明度切换时间)
        beforeCreate () {}, // 钩子 渲染之前 ，函数内 this 指向 RootElement
        created () {}, // 钩子 渲染之后 无参数, 函数内 this 指向 VirtualScroll 实例
        wheels (orientation, position) {}, // 钩子 滚轮滚动时执行  orientation 表示滚动方向 'up' 向上滚动 'down' 向下滚动 ,参数 position 是表示垂直滚动条的滑动偏移量 CurrentPosition
        dragStart (movetype, position) {}, // 钩子 拖动开始  movetype 表示滚动条类型 H 表示水平，V表示垂直 参数 position 是表示垂直滚动条的滑动偏移量 CurrentPosition
        dragging (orientation, position) {}, // 钩子 拖动进行中 参数1是移动方向 orientation (上'up', 下'down', 左'left', 右'right' ) ,参数 position 是表示垂直滚动条的滑动偏移量 CurrentPosition
        dragEnd (movetype, position) {} // 钩子 拖动结束  movetype 表示滚动条类型 H 表示水平，V表示垂直 参数 position 是表示垂直滚动条的滑动偏移量 CurrentPosition
    }
```
