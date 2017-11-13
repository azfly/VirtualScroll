;(function (definition) {
    'use strict';
    // CommonJS
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = definition();
    // RequireJS
    } else if (typeof define === 'function' && define.amd) {
        define(definition);
    // <script>
    } else if (typeof window !== 'undefined' || typeof self !== 'undefined') {
        let global = typeof window !== 'undefined' ? window : self;
        global.VirtualScroll = definition;
    } else { throw new Error('This environment was not anticipated.'); }
})(function (RootElement, UserConfig) {
    // RootElement 是必选参数 传入一个DOM节点对象
    if (!RootElement || RootElement.nodeName !== 'DIV') { throw new Error('(VirtualScroll) The first parameter must be a DIV element'); }
    // UserConfig 是可选参数 传一个 Object , 表示配置项。如果不传入配置参数，将使用默认参数
    if (UserConfig && UserConfig.constructor.valueOf() !== Object) {
        throw new Error('(VirtualScroll) The second argument must be an Object!');
    } else if (UserConfig && UserConfig.beforeCreate) {
        // 钩子函数 在实例化之前执行，注入的参数是一个根元素， 不要在这个钩子中执行AJAX数据获取， 不支持异步。
        // 因为没有实例化, 所以this不是指向根元素DOM对象
        UserConfig.beforeCreate.call(RootElement);
    };
    // 默认配置项
    const DefaultConfig = {
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
    };
    // 套用的模板 vs-main 是遮罩层，vs-container 是内容包裹容器，vs-horizontal-bar 是水平滚动条， vs-horizontal-slider 是水平滚动滑块，vs-vertical-bar 是垂直滚动条，vs-vertical-slider 是垂直滚动滑块
    const Template = `<div class="vs-main"><div class="vs-container"></div></div><div class="vs-horizontal-bar"><div class="vs-horizontal-slider"></div></div><div class="vs-vertical-bar"><div class="vs-vertical-slider"></div></div>`;
    // 构造函数, 将根元素对象和配置参数传入
    function VirtualScroll (RootElement, UserConfig) {
        // 成员变量定义
        this.$Options = {}; // 用户定义的参数与默认参数合并
        this.$Element = RootElement; // 根元素
        this.$Main = null; // 可视区域（遮罩）
        this.$Container = null; // 内容包裹容器
        this.$HorizontalBar = null; // 水平滚动条
        this.$HorizontalSlider = null; // 水平滚动滑块
        this.$VerticalBar = null; // 垂直滚动条
        this.$VerticalSlider = null; // 垂直滚动滑块
        // 执行成员函数
        this._build();
    }
    // 原型扩展
    VirtualScroll.prototype = {
        constructor: VirtualScroll, // 重新指向构造函数
        /**
         * 成员函数执行汇总
         */
        _build () {
            this._init(); // DOM结构与成员变量初始化
            this._setStyle(); // 基本样式初始化
            this._verticalAction(); // 垂直滚动条事件绑定
            this._horizontalAction(); // 水平滚动条事件绑定
            this._containerWheel(); // 滚动事件绑定
            this._initEvent(); // 其它事件初始化（鼠标样式切换事件、滚动条点击事件、鼠标移入移出事件等）
            this.$Options.created.call(this); // 钩子函数，实例创建完成之后触发
        },
        /**
         * DOM结构与成员变量初始化
         */
        _init () {
            // 根DOM结构及内容初始化
            this.$Options = Object.assign({}, DefaultConfig, UserConfig); // 合并自定义的参数与默认参数
            let contents = this.$Element.innerHTML;
            this.$Element.innerHTML = Template;
            // 变量初始化
            this.$Main = this.$Element.querySelector('.vs-main'); // 遮罩层
            this.$Container = this.$Main.querySelector('.vs-container'); // 内容包裹容器
            this.$Container.innerHTML = contents; // 重新装载滚动内容
            this.$HorizontalBar = this.$Element.querySelector('.vs-horizontal-bar'); // 水平滚动条
            this.$HorizontalSlider = this.$Element.querySelector('.vs-horizontal-slider'); // 水平滚动滑块
            this.$VerticalBar = this.$Element.querySelector('.vs-vertical-bar'); // 垂直滚动条
            this.$VerticalSlider = this.$Element.querySelector('.vs-vertical-slider'); // 垂直滚动滑块
            // 变量参数校验（滚动条初始位置设置校验，必须输入数组，元素值必须是 0 - 1 或之间的小数，如果大于 1 或小于 0 则自动取 1 或 0）
            if (Array.isArray(this.$Options.CurrentPosition)) {
                let ocp = this.$Options.CurrentPosition;
                if (ocp[0] > 100) { ocp[0] = 100; } else if (ocp[0] < 0 || isNaN(ocp[0])) { ocp[0] = 0; }
                if (ocp[1] > 100) { ocp[1] = 100; } else if (ocp[1] < 0 || isNaN(ocp[1])) { ocp[1] = 0; }
            } else { this.$Options.CurrentPosition = [0, 0]; }
        },
        /**
         * 给元素批量加样式（工具函数）
         */
        _addCSS (element, Obj) { for (let key in Obj) { element.style[key] = Obj[key]; } },
        /**
         * 初始化样式
         */
        _setStyle () {
            // 简化变量定义
            let op = this.$Options; // 设置参数
            let el = this.$Element; // 根元素
            let ma = this.$Main; // 可视区域（遮罩）
            let co = this.$Container; // 滚动内容（包裹容器）
            let vb = this.$VerticalBar; // 垂直滚动条
            let vs = this.$VerticalSlider; // 垂直滚动滑块
            let hb = this.$HorizontalBar; // 水平滚动条
            let hs = this.$HorizontalSlider; // 水平滚动滑块
            // 设置滚动条是否自动显示（响应鼠标移入显示移出隐藏）
            if (op.AutoShow) { hb.style.opacity = 0; vb.style.opacity = 0; };
            // 设置根元素 $Element 的定位样式
            // 将根元素设置为溢出隐藏 （建议给根元素的CSS也加上这个样式，以防止快速刷新页面时溢出内容的闪烁）
            el.style.overflow = 'hidden';
            // 获取根元素的最终样式（浏览器渲染后计算的样式）
            let ElementStyle = window.getComputedStyle(this.$Element, null);
            // 根元素定位要设置为 relative 或 absolute , 因为 absolute 会脱离文档流，所以如果没有设置则设置为 relative 比较安全，不会打乱页面布局
            if (!ElementStyle.position || ElementStyle.position === 'static') { el.style.position = 'relative'; }
            // 设置可视区域（遮罩） $Main 的样式
            this._addCSS(ma, { position: 'absolute', top: 0, left: 0, margin: 0, padding: 0, border: 'none', background: 'none' });
            // 设置滚动内容（包裹容器） $Container 的样式， 必须设置为 position = absolute 以方面滑动时进行绝对定位
            let ContainerStyle = window.getComputedStyle(this.$Container, null);
            if (ContainerStyle.position !== 'absolute') { co.style.position = 'absolute'; }
            this._addCSS(co, { top: 0, left: 0, margin: 0, padding: 0, border: 'none', background: 'none' });
            // 设置垂直滚动条 $VerticalBar 的样式
            this._addCSS(vb, {
                position: 'absolute',
                top: 0,
                right: 0,
                width: op.VBwidth + 'px',
                backgroundColor: op.VBbgColor,
                borderRadius: op.VBradius,
                boxSizing: 'border-box',
                padding: 0,
                margin: 0,
                border: op.VBborder,
                transitionProperty: 'opacity',
                transitionDuration: op.TransitionDuration
            });
            // 设置垂直滚动滑块 $VerticalSlider 的样式
            this._addCSS(vs, {
                position: 'absolute',
                boxSizing: 'border-box',
                padding: 0,
                margin: 0,
                border: op.VSborder,
                backgroundColor: op.VSbgColor,
                borderRadius: op.VSradius,
                cursor: op.VScursor,
                left: '50%',
                transitionProperty: 'background',
                transitionDuration: op.TransitionDuration,
                width: (op.VSwidth < vb.clientWidth ? op.VSwidth : vb.clientWidth) + 'px',
                marginLeft: (op.VSwidth < vb.clientWidth ? op.VSwidth : vb.clientWidth) / -2 + 'px'
            });
            // 设置水平滚动条 $HorizontalBar 的样式
            this._addCSS(hb, {
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: op.HBheight + 'px',
                backgroundColor: op.HBbgColor,
                borderRadius: op.HBradius,
                boxSizing: 'border-box',
                padding: 0,
                margin: 0,
                border: op.HBborder,
                transitionProperty: 'opacity',
                transitionDuration: op.TransitionDuration
            });
            // 设置水平滚动滑块 $HorizontalSlider 的样式
            this._addCSS(hs, {
                position: 'absolute',
                boxSizing: 'border-box',
                padding: 0,
                margin: 0,
                border: op.HSborder,
                backgroundColor: op.HSbgColor,
                borderRadius: op.HSradius,
                cursor: op.HScursor,
                top: '50%',
                transitionProperty: 'background',
                transitionDuration: op.TransitionDuration,
                height: (op.HSheight < hb.clientHeight ? op.HSheight : hb.clientHeight) + 'px',
                marginTop: (op.HSheight < hb.clientHeight ? op.HSheight : hb.clientHeight) / -2 + 'px'
            });
            // 滚动条是否可见 根据内容自动判断
            if (co.offsetHeight <= el.clientHeight) {
                vb.style.display = 'none';
                ma.style.right = 0;
                op.CurrentPosition[1] = 0;
            } else {
                vb.style.display = 'block';
                ma.style.right = op.VBwidth + 'px';
            }
            if (co.offsetWidth <= el.clientWidth) {
                hb.style.display = 'none';
                ma.style.bottom = 0;
                op.CurrentPosition[0] = 0;
            } else {
                hb.style.display = 'block';
                ma.style.bottom = op.HBheight + 'px';
            }
            // 样式计算垂直滚动条和滑块的高度宽度,和滑块的初始滑动距离
            vb.style.height = el.clientHeight - hb.offsetHeight + 'px';
            vs.style.height = vb.clientHeight / co.offsetHeight * el.clientHeight + 'px';
            vs.style.top = op.CurrentPosition[1] * (vb.clientHeight - vs.offsetHeight) + 'px';
            // 样式计算水平滚动条和滑块的宽度,和滑块的初始滑动距离
            hb.style.width = el.clientWidth - vb.offsetWidth + 'px';
            hs.style.width = hb.clientWidth / co.offsetWidth * el.clientWidth + 'px';
            hs.style.left = op.CurrentPosition[0] * (hb.clientWidth - hs.offsetWidth) + 'px';
            // 计算滚动内容的初始滑动距离
            co.style.left = -(co.offsetWidth - ma.clientWidth) * op.CurrentPosition[0] + 'px';
            co.style.top = -(co.offsetHeight - ma.clientHeight) * op.CurrentPosition[1] + 'px';
        },
        /**
         * 文档结构还原
         */
        restore () {
            let co = this.$Container;
            let el = this.$Element;
            el.innerHTML = co.innerHTML;
        },
        /**
         * 当窗口大小发生变化或其它原因，需要重新渲染滚动条时触发
         * 本实例自带window.onresize响应
         * 如果是其它事件导致的窗口大小变化，那可以在那个事件中 执行 vsobj.refresh() 刷新一下滚动条位置及长度
         */
        refresh () {
            let op = this.$Options;
            let el = this.$Element;
            let ma = this.$Main;
            let co = this.$Container;
            let vb = this.$VerticalBar;
            let vs = this.$VerticalSlider;
            let hb = this.$HorizontalBar;
            let hs = this.$HorizontalSlider;
            let HShow = true; // 是否显示水平滚动条
            let VShow = true; // 是否显示垂直滚动条
            // 重算是否需要水平滚动条 不需要 （滚动内容宽度小于窗口宽度，所以不需要）
            if (co.offsetWidth <= el.clientWidth) {
                HShow = false;
                hb.style.display = 'none';
                op.CurrentPosition[0] = 0;
                co.style.left = 0;
                ma.style.bottom = 0;
            }
            // 重算是否需要垂直滚动条 不需要 （滚动内容高度小于窗口高度，所以不需要）
            if (co.offsetHeight <= el.clientHeight) {
                VShow = false;
                vb.style.display = 'none';
                op.CurrentPosition[1] = 0;
                co.style.top = 0;
                ma.style.right = 0;
            }
            // 需要水平滚动
            if (HShow) {
                hb.style.display = 'block';
                // 重算 main 的底边(有水平滚动条)
                ma.style.bottom = op.HBheight + 'px';
                // 重算水平滚动条和滑块的宽度
                hb.style.width = el.clientWidth - (VShow ? op.VBwidth : 0) + 'px';
                hs.style.width = hb.clientWidth / co.offsetWidth * el.clientWidth + 'px';
                // 重算滑块的位置与滚动内容的位置
                hs.style.left = op.CurrentPosition[0] * (hb.clientWidth - hs.offsetWidth) + 'px';
                co.style.left = -(co.offsetWidth - ma.clientWidth) * op.CurrentPosition[0] + 'px';
            }
            // 需要垂直滚动
            if (VShow) {
                vb.style.display = 'block';
                // 重算 main 的右边(有垂直滚动条)
                ma.style.right = op.VBwidth + 'px';
                // 重算垂直滚动条和滑块的宽度
                vb.style.height = el.clientHeight - (HShow ? op.HBheight : 0) + 'px';
                vs.style.height = vb.clientHeight / co.offsetHeight * el.clientHeight + 'px';
                // 重算滑块的位置与滚动内容的位置
                vs.style.top = op.CurrentPosition[1] * (vb.clientHeight - vs.offsetHeight) + 'px';
                co.style.top = -op.CurrentPosition[1] * (co.offsetHeight - ma.clientHeight) + 'px';
            }
        },
        /**
         * 阻止浏览器默认事件，和事件冒泡
         */
        _stopBehavior (event) {
            if (event.preventDefault) {
                event.preventDefault();
                event.stopPropagation();
            } else { // IE
                event.cancelBubble = true;
                event.returnValue = false;
            }
        },
        /**
         * 渲染水平滚动条元素
         */
        _horizontalAction () {
            let self = this;
            let hb = this.$HorizontalBar;
            let hs = this.$HorizontalSlider;
            let op = this.$Options;
            let co = this.$Container;
            let oldLeft = 0;
            let orientation = null;
            let disX = null;
            // 事件函数定义
            let docup = function (event) {
                op.dragEnd.call(self, 'H', op.CurrentPosition[0]); // 钩子函数，滑动结束
                document.removeEventListener('mousemove', docmove);
                document.removeEventListener('mouseup', docup);
            };
            let docmove = function (event) {
                self._stopBehavior(event);
                let HoffsetRange = hb.clientWidth - hs.offsetWidth; // 水平滚动滑块的可滑行范围
                let HcoverWidth = co.offsetWidth - self.$Main.clientWidth; // 水平滚动内容的遮蔽区域宽度
                let newLeft = event.clientX - disX;
                if (newLeft < 0) { newLeft = 0; };
                if (newLeft > HoffsetRange) { newLeft = HoffsetRange; };
                hs.style.left = newLeft + 'px';
                co.style.left = -(newLeft * HcoverWidth / HoffsetRange) + 'px';
                // 将水平滚动位置写入变量 CurrentPosition
                op.CurrentPosition[0] = newLeft / HoffsetRange;
                // 判断左移还是右移
                if (oldLeft !== newLeft) {
                    if (oldLeft > newLeft) { orientation = 'left'; }
                    if (oldLeft < newLeft) { orientation = 'right'; }
                    self.$Options.dragging.call(self, orientation, op.CurrentPosition[0]); // 钩子函数，滑动进行中 orientation 表示移动方向 左left 右right
                }
                oldLeft = newLeft;
            };
            let hsdown = function (event) {
                orientation = null;
                op.dragStart.call(self, 'H', op.CurrentPosition[0]); // 钩子函数，滑动开始前
                self._stopBehavior(event); // 取消默认和冒泡
                disX = event.clientX - hs.offsetLeft;
                document.addEventListener('mousemove', docmove);
                document.addEventListener('mouseup', docup);
            };
            // 绑定事件
            hs.addEventListener('mousedown', hsdown);
        },
        /**
         * 渲染垂直滚动条元素
         */
        _verticalAction () {
            let self = this;
            let vb = this.$VerticalBar;
            let vs = this.$VerticalSlider;
            let op = this.$Options;
            let co = this.$Container;
            let oldTop = 0; // 上一次的距离
            let orientation = null;
            let disY = null;
            // 事件函数定义
            let docup = function (event) {
                op.dragEnd.call(self, 'V', op.CurrentPosition[1]); // 钩子函数，滑动结束
                document.removeEventListener('mousemove', docmove);
                document.removeEventListener('mouseup', docup);
            };
            let docmove = function (event) {
                self._stopBehavior(event);
                let VoffsetRange = vb.clientHeight - vs.offsetHeight; // 垂直滚动滑块的可滑行范围
                let VcoverHehght = co.offsetHeight - self.$Main.clientHeight; // 垂直滚动内容的遮蔽区域高度
                let newTop = event.clientY - disY;
                if (newTop < 0) { newTop = 0; };
                if (newTop > VoffsetRange) { newTop = VoffsetRange; };
                vs.style.top = newTop + 'px';
                co.style.top = -(newTop / VoffsetRange * VcoverHehght) + 'px';
                // 将垂直滚动位置写入变量 CurrentPosition
                op.CurrentPosition[1] = newTop / VoffsetRange;
                // 判断上移还是下移
                if (oldTop !== newTop) {
                    if (oldTop > newTop) { orientation = 'up'; }
                    if (oldTop < newTop) { orientation = 'down'; }
                    self.$Options.dragging.call(self, orientation, op.CurrentPosition[1]); // 钩子函数，滑动进行中 orientation 表示移动方向 上up下down
                }
                oldTop = newTop;
            };
            let vsdown = function (event) {
                orientation = null; // 此变量表示移动方向，取值 up , down ,如果原地没动，则是 null
                op.dragStart.call(self, 'V', op.CurrentPosition[1]); // 钩子函数，滑动开始前
                self._stopBehavior(event); // 取消默认和冒泡
                disY = event.clientY - vs.offsetTop;
                document.addEventListener('mousemove', docmove);
                document.addEventListener('mouseup', docup);
            };
            // 绑定事体件
            vs.addEventListener('mousedown', vsdown);
        },
        _wheelUp (event) {
            let co = this.$Container;
            let VoffsetRange = this.$VerticalBar.clientHeight - this.$VerticalSlider.offsetHeight;
            let top = parseFloat(co.style.top);
            if (top + this.$Options.WheelStep >= 0) {
                top = -0;
            } else {
                this._stopBehavior(event);
                top = top + this.$Options.WheelStep;
            }
            co.style.top = top + 'px';
            let x = this.$VerticalBar.clientHeight * -top / this.$Container.offsetHeight;
            this.$VerticalSlider.style.top = x + 'px';
            this.$Options.wheels.call(this, 'up', x / VoffsetRange); // 钩子函数
        },
        _wheelDown (event) {
            let co = this.$Container;
            let top = parseFloat(co.style.top);
            let WheelRange = this.$Container.offsetHeight - this.$Main.clientHeight;
            let VoffsetRange = this.$VerticalBar.clientHeight - this.$VerticalSlider.offsetHeight;
            if (top - this.$Options.WheelStep <= -WheelRange) {
                top = -WheelRange;
            } else {
                this._stopBehavior(event);
                top = top - this.$Options.WheelStep;
            }
            co.style.top = top + 'px';
            let x = Math.abs(top * VoffsetRange / WheelRange);
            this.$VerticalSlider.style.top = x + 'px';
            this.$Options.wheels.call(this, 'down', x / VoffsetRange); // 钩子函数
        },
        /**
         * 鼠标滚轮在滚动区滚动时，可滚动内容进行滚动
         */
        _containerWheel () {
            let self = this;
            let op = this.$Options;
            if (!op.WheelNeed) { return; } // 如果 wheelneed 是false 表示不需要滚轮，那么直接返回,不执行后面的代码
            let handler = function (event) {
                if (!self.$Options.WheelBubble) { self._stopBehavior(event); } // 释放滚轮 WheelBubble
                let VoffsetTop = self.$VerticalSlider.offsetTop;
                let VoffsetRange = self.$VerticalBar.clientHeight - self.$VerticalSlider.offsetHeight;
                if ((event.detail < 0 || event.wheelDelta > 0) && VoffsetTop !== 0) {
                    self._wheelUp(event);
                }
                if ((event.detail > 0 || event.wheelDelta < 0) && VoffsetTop !== VoffsetRange) {
                    self._wheelDown(event);
                }
                op.CurrentPosition[1] = VoffsetTop / VoffsetRange;
            };
            this.$Main.addEventListener('DOMMouseScroll', handler);
            this.$Main.addEventListener('mousewheel', handler);
        },
        /**
         * 滑块颜色鼠标经过和点击变色事件
         */
        _sliderColorEvent (slider, bgcolor, overcolor, clickcolor) {
            let t = true;
            let senter = function (e) {
                if (t) { slider.style.background = overcolor; }
            };
            let sout = function (e) {
                if (t) { slider.style.background = bgcolor; }
            };
            let sdown = function (e) {
                t = false;
                slider.style.background = clickcolor;
                document.addEventListener('mouseup', docup);
            };
            let sup = function (e) {
                t = true;
                slider.style.background = overcolor;
                document.removeEventListener('mouseup', docup);
            };
            let docup = function (e) {
                t = true;
                slider.style.background = bgcolor;
            };
            slider.addEventListener('mouseout', sout);
            slider.addEventListener('mouseenter', senter);
            slider.addEventListener('mousedown', sdown);
            slider.addEventListener('mouseup', sup);
        },
        /**
         * 水平单步滑动公用方法
         * n 表示单步滑动距离，如果小于 -1  或 大于 1 则是像素，如果大于-1小于1，则是百分比
         * 如果是百分比，那么输入 -1 到 1 的数值，比如  -0.25  或 0.958 （正数表示向左滑动，负数表示向右滑动）
         * @param n {Number} 是一个整数或小数，整数表示像素，小数表示百分比
         */
        horizontalSingle (n) {
            if (isNaN(n)) { return false; }
            let op = this.$Options;
            let hb = this.$HorizontalBar;
            let hs = this.$HorizontalSlider;
            let co = this.$Container;
            let ma = this.$Main;
            let HoffsetRange = hb.clientWidth - hs.offsetWidth;
            let CoffsetRange = co.offsetWidth - ma.clientWidth;
            let InitWidth = 0; // 初始化滚动距离
            let l = 0; // 垂直滚动滑块的顶距
            op.dragStart.call(this, 'H', op.CurrentPosition[0]); // 钩子函数，滑动开始前
            if (n >= -1 && n <= 1) { InitWidth = n * CoffsetRange; } else { InitWidth = n; } // 滚动内容移动的距离
            // 换算到垂直滚动条移动的距离
            let x = InitWidth / CoffsetRange * HoffsetRange;
            if (x === 0) { l = HoffsetRange / 2; }
            if (x > 0) { x = Math.ceil(x); l = (hs.offsetLeft + x > HoffsetRange) ? HoffsetRange : hs.offsetLeft + x; }
            if (x < 0) { x = Math.floor(x); l = (hs.offsetLeft + x < 0) ? 0 : hs.offsetLeft + x; }
            op.CurrentPosition[0] = l / HoffsetRange;
            op.dragEnd.call(this, 'H', op.CurrentPosition[0]); // 钩子函数，滑动结束
            hs.style.left = l + 'px';
            co.style.left = -l * CoffsetRange / HoffsetRange + 'px';
        },
        /**
         * 垂直单步滑动公用方法
         * n 表示单步滑动距离，如果小于 -1  或 大于 1则是像素，如果大于-1小于1，则是百分比
         * 如果是百分比，那么输入 -1 到 1 的数值，比如  -0.25  或 0.958 （正数表示向下滑动，负数表示向上滑动）
         * @param n {Number} 是一个整数或小数，整数表示像素，小数表示百分比
         */
        verticalSingle (n) {
            if (isNaN(n)) { return false; }
            let op = this.$Options;
            let vb = this.$VerticalBar;
            let vs = this.$VerticalSlider;
            let co = this.$Container;
            let ma = this.$Main;
            let VoffsetRange = vb.clientHeight - vs.offsetHeight;
            let CoffsetRange = co.offsetHeight - ma.clientHeight;
            let InitHeight = 0; // 初始化滚动距离
            let t = 0; // 垂直滚动滑块的顶距
            op.dragStart.call(this, 'V', op.CurrentPosition[1]); // 钩子函数，滑动开始前
            if (n >= -1 && n <= 1) { InitHeight = n * CoffsetRange; } else { InitHeight = n; } // 滚动内容移动的距离
            // 换算到垂直滚动条移动的距离
            let x = InitHeight / CoffsetRange * VoffsetRange;
            if (x === 0) { t = VoffsetRange / 2; }
            if (x > 0) { x = Math.ceil(x); t = (vs.offsetTop + x > VoffsetRange) ? VoffsetRange : vs.offsetTop + x; }
            if (x < 0) { x = Math.floor(x); t = (vs.offsetTop + x < 0) ? 0 : vs.offsetTop + x; }
            op.CurrentPosition[1] = t / VoffsetRange;
            op.dragEnd.call(this, 'V', op.CurrentPosition[1]); // 钩子函数，滑动结束
            vs.style.top = t + 'px';
            co.style.top = -t * CoffsetRange / VoffsetRange + 'px';
        },
        /**
         * 水平滚动条点击滑动
         */
        _horizontalSlide () {
            let self = this;
            let op = this.$Options;
            let hb = this.$HorizontalBar;
            let hs = this.$HorizontalSlider;
            let ma = this.$Main;
            let co = this.$Container;
            let timer = null;
            let orientation = null; // 移动方向 left 左， right 右
            let HBdown = function (event) {
                op.dragStart.call(self, 'H', op.CurrentPosition[0]); // 钩子函数，滑动开始前
                self._stopBehavior(event);
                timer = setInterval(function () {
                    hb.addEventListener('mouseout', hbclear);
                    hb.addEventListener('mouseup', hbclear);
                    let DownPoint = event.offsetX; // 点击的位置距离左边的距离 火狐(layerX ), IE,Chrome (offsetX)
                    if (navigator.userAgent.indexOf('Firefox') >= 0) { DownPoint = event.layerX; } // 如果是火狐
                    let HoffsetRange = hb.clientWidth - hs.offsetWidth; // 滑块的左右可滑行范围
                    let CoffsetRange = co.offsetWidth - ma.clientWidth; // 滚动内容的可滚动范围
                    let x = HoffsetRange * op.WheelStep / CoffsetRange; // 滑块的单步距离
                    if (DownPoint <= (hs.offsetLeft + hs.offsetWidth) && DownPoint >= hs.offsetLeft) { // 如果点击到滑块上，不进行动作
                    } else {
                        let l = 0;
                        if (DownPoint < hs.offsetLeft) {
                            orientation = 'left';
                            l = (hs.offsetLeft <= x) ? 0 : (hs.offsetLeft - x);
                            if (l < DownPoint) { l = DownPoint; clearInterval(timer); }
                        }
                        if (DownPoint > hs.offsetLeft + hs.offsetWidth) {
                            orientation = 'right';
                            l = (hs.offsetLeft + x >= HoffsetRange) ? HoffsetRange : (hs.offsetLeft + x);
                            if (l + hs.offsetWidth > DownPoint) { l = DownPoint - hs.offsetWidth; clearInterval(timer); }
                        }
                        op.CurrentPosition[0] = l / HoffsetRange;
                        op.dragging.call(self, orientation, op.CurrentPosition[0]); // 钩子函数，滑动进行中 orientation 表示移动方向 左left右right
                        hs.style.left = l + 'px';
                        co.style.left = -l * CoffsetRange / HoffsetRange + 'px';
                    }
                }, 30);
            };
            let hbclear = function (event) {
                clearInterval(timer);
                op.dragEnd.call(self, 'H', op.CurrentPosition[0]); // 钩子函数，滑动结束
                hb.removeEventListener('mouseout', hbclear);
                hb.removeEventListener('mouseup', hbclear);
            };
            hb.addEventListener('mousedown', HBdown);
        },
        /**
         * 垂直滚动条点击滑动
         */
        _verticalSlide () {
            let self = this;
            let op = this.$Options;
            let vb = this.$VerticalBar;
            let vs = this.$VerticalSlider;
            let ma = this.$Main;
            let co = this.$Container;
            let timer = null;
            let orientation = null; // 移动方向 up 上， 下 down
            let VBdown = function (event) {
                op.dragStart.call(self, 'V', op.CurrentPosition[1]); // 钩子函数，滑动开始前
                self._stopBehavior(event);
                timer = setInterval(function () {
                    vb.addEventListener('mouseout', vbclear);
                    vb.addEventListener('mouseup', vbclear);
                    let DownPoint = event.offsetY; // 点击的位置距离左边的距离 火狐(layerY ), IE,Chrome (offsetY)
                    if (navigator.userAgent.indexOf('Firefox') >= 0) { DownPoint = event.layerY; } // 如果是火狐
                    if (window.ActiveXObject || 'ActiveXObject' in window) { DownPoint = event.offsetY; } // 如果是IE
                    let VoffsetRange = vb.clientHeight - vs.offsetHeight; // 滑块的上下可滑行范围
                    let CoffsetRange = co.offsetHeight - ma.clientHeight; // 滚动内容的可滚动范围
                    let x = VoffsetRange * op.WheelStep / CoffsetRange; // 滑块的单步距离
                    if (DownPoint <= (vs.offsetTop + vs.offsetHeight) && DownPoint >= vs.offsetTop) { // 如果点击到滑块上，不进行动作
                    } else {
                        let t = 0;
                        if (DownPoint < vs.offsetTop) {
                            orientation = 'up';
                            t = (vs.offsetTop <= x) ? 0 : (vs.offsetTop - x);
                            if (t < DownPoint) { t = DownPoint; clearInterval(timer); }
                        }
                        if (DownPoint > vs.offsetTop + vs.offsetHeight) {
                            orientation = 'down';
                            t = (vs.offsetTop + x >= VoffsetRange) ? VoffsetRange : (vs.offsetTop + x);
                            if (t + vs.offsetHeight > DownPoint) {
                                t = DownPoint - vs.offsetHeight;
                                clearInterval(timer);
                            }
                        }
                        op.CurrentPosition[1] = t / VoffsetRange;
                        op.dragging.call(self, orientation, op.CurrentPosition[1]); // 钩子函数，滑动进行中 orientation 表示移动方向 上up下down
                        vs.style.top = t + 'px';
                        co.style.top = -t * CoffsetRange / VoffsetRange + 'px';
                    }
                }, 30);
            };
            let vbclear = function (event) {
                clearInterval(timer);
                op.dragEnd.call(self, 'V', op.CurrentPosition[1]); // 钩子函数，滑动结束 orientation 表示移动方向 上up下down
                vb.removeEventListener('mouseout', vbclear);
                vb.removeEventListener('mouseup', vbclear);
            };
            vb.addEventListener('mousedown', VBdown);
        },
        /**
         * 直达某个元素所在点，一般被用作搜索书签
         * @param oNode {DOM Object} Node 滚动内容中的节点对象
         * @param h {Bloomean} 是否需要水平滑动
         * @param V {Bloomean} 是否需要垂直滑动
         */
        reachTo (oNode, h, v) {
            let op = this.$Options;
            let co = this.$Container;
            let ma = this.$Main;
            let NodeGbcr = oNode.getBoundingClientRect();
            let CoGbcr = co.getBoundingClientRect();
            if (v) {
                op.dragStart.call(this, 'V', op.CurrentPosition[1]); // 钩子
                let vb = this.$VerticalBar;
                let vs = this.$VerticalSlider;
                let vrange = vb.clientHeight - vs.offsetHeight;
                let crangev = co.offsetHeight - ma.clientHeight;
                let t = Math.abs(NodeGbcr.top - CoGbcr.top);
                if (t >= crangev) { t = crangev; }
                co.style.top = -t + 'px';
                vs.style.top = t / crangev * vrange + 'px';
                op.CurrentPosition[1] = t / crangev * vrange / vrange;
                op.dragEnd.call(this, 'V', op.CurrentPosition[1]); // 钩子
            }
            if (h) {
                op.dragStart.call(this, 'H', op.CurrentPosition[0]); // 钩子
                let hb = this.$HorizontalBar;
                let hs = this.$HorizontalSlider;
                let hrange = hb.clientWidth - hs.offsetWidth;
                let crangeh = co.offsetWidth - ma.clientWidth;
                let l = Math.abs(NodeGbcr.left - CoGbcr.left);
                if (l >= crangeh) { l = crangeh; }
                co.style.left = -l + 'px';
                hs.style.left = l / crangeh * hrange + 'px';
                op.CurrentPosition[0] = l / crangeh * hrange / hrange;
                op.dragEnd.call(this, 'V', op.CurrentPosition[0]); // 钩子
            }
        },
        /**
         * 事件初始化
         */
        _initEvent () {
            let self = this;
            let op = this.$Options;
            let hb = this.$HorizontalBar;
            let hs = this.$HorizontalSlider;
            let vb = this.$VerticalBar;
            let vs = this.$VerticalSlider;
            let el = this.$Element;
            window.addEventListener('resize', function (e) { self.refresh(); });
            this._sliderColorEvent(vs, op.VSbgColor, op.VSoverColor, op.VSclickColor);
            this._sliderColorEvent(hs, op.HSbgColor, op.HSoverColor, op.HSclickColor);
            el.addEventListener('mouseover', function (e) { hb.style.opacity = 1; vb.style.opacity = 1; });
            el.addEventListener('mouseleave', function (e) { if (op.AutoShow) { hb.style.opacity = 0; vb.style.opacity = 0; } });
            this._verticalSlide(); // 垂直滚动条可点击
            this._horizontalSlide(); // 水平滚动条可点击
        }
    };
    return new VirtualScroll(RootElement, UserConfig);
});
