'use strict';
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 全局变量(root 即 window)
        root.Vue = factory();
    }
}(this, function() {
    // {{}}的正则表达式
    var defaultTagRegStr = '\\{\\{((?:.|\\n)+?)\\}\\}';
    var defaultTagReg = new RegExp(defaultTagRegStr, 'g');

    function _defineProperty(vue, obj, item, value) {
        var def = value;
        // 绑定数据监控时创建watcher
        vue.$watchers[item] = [];
        Object.defineProperty(obj, item, {
            configurable: true,
            enumerable: true,
            get: function() {
                return def;
            },
            set: function(val) {
                // 数据变动时触发action
                _action(vue, item, val, def);
                def = val;
            }
        });
    }

    // 绑定数据监控
    function _bindData(vue, o){
        var keys = Object.keys(o);
        for (var i = 0; i < keys.length; i++) {
            if (typeof vue[keys[i]] !== 'undefined') {
                console.error(keys[i] + ' has already existed');
            } else {
                _defineProperty(vue, vue.$data, keys[i], o[keys[i]]);
                _defineProperty(vue, vue, keys[i], o[keys[i]]);
            }
        }
    }

    // 触发watcher函数队列
    function _action(vue, item, newVal, oldVal) {
        for (var j = 0; j < vue.$watchers[item].length; j++) {
            vue.$watchers[item][j](newVal, oldVal);
        }
    }

    // 检查nodeType为1的dom节点
    function _nodeType1(vue, dom) {
        var nodes = dom.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType === 3) {
                _nodeType3(vue, nodes[i]);
            } else if (nodes[i].nodeType === 1) {
                _nodeType1(vue, nodes[i]);
            }
        }
    }

    // 检查nodeType为3的dom节点
    function _nodeType3(vue, dom){
        var text = dom.nodeValue;
        // 假如text为 {{variable1}}hello world{{variable2}}
        if (defaultTagReg.test(text)) {
            // nodeArr格式为['variable1', 'hello world', 'variable2']
            var nodeArr = text.split(defaultTagReg);
            // varsArr格式为['variable1', 'variable2']
            var varsArr = [];
            var varReg = new RegExp(defaultTagRegStr, 'g');
            while (true) {
                var exc = varReg.exec(text);
                if (exc) {
                    varsArr.push(exc[1]);
                } else {
                    break;
                }
            }
            nodeArr = nodeArr.map(function(val, key) {
                for (var j = 0; j < varsArr.length; j++) {
                    if (val === varsArr[j]) {
                        return {
                            type: 1,
                            variable: val,
                            value: vue.$data[val]
                        }
                    }
                }
                return {
                    type: 2,
                    value: val
                };
            });
            /*
                nodeArr格式为:
                [{
                    type: 1,
                    variable: 'variable1',
                    value: ''
                }, {
                    type: 2,
                    value: 'hello world'
                }, {
                    type: 1,
                    variable: 'variable2',
                    value: ''
                }]
            */
            _initNode(vue, dom, nodeArr);
        }
    }

    // 遍历nodeArr, 注册相应函数
    function _initNode(vue, dom, nodeArr){
        // 初始化nodeValue值
        var initStr = '';
        nodeArr.forEach(function(item, index) {
            initStr += item.value;
            if (item.type === 1) {
                _registerWatcher(vue, item.variable, function(newVal, oldVal) {
                    var str = '';
                    for (var i = 0; i < nodeArr.length; i++) {
                        if (nodeArr[i].type === 2) {
                            str += nodeArr[i].value;
                        } else if (nodeArr[i].type === 1) {
                            if (nodeArr[i].variable === item.variable) {
                                str += newVal;
                                nodeArr[i].value = newVal;
                            } else {
                                str += nodeArr[i].value;
                            }
                        }
                    }
                    dom.nodeValue = str;
                });
            }
        });
        dom.nodeValue = initStr;
    }

    //处理methods
    function _methods(vue, methods) {
        var keys = Object.keys(methods);
        for (var i = 0; i < keys.length; i++) {
            if (typeof vue[keys[i]] === 'undefined') {
                if (typeof methods[keys[i]] === 'function') {
                    vue[keys[i]] = (
                        function(i){
                            return function() {
                                methods[keys[i]].apply(vue, arguments);
                            }
                        }(i)
                    );
                }
            } else {
                console.error(keys[i] + ' has already existed');
            }
        }
    }

    // 注册watcher事件队列
    function _registerWatcher(vue, variable, callBack) {
        if (typeof callBack === 'function') {
            vue.$watchers[variable].push(callBack);
        }
    }

    // 主函数,构造函数
    function Vue(options) {
        // $watchers用来保存监控的变量名以及对应的数据改变时执行的函数队列
        this.$watchers = {};
        this.$data = {};
        // 绑定数据追踪
        _bindData(this, options.data || {});
        _methods(this, options.methods || {});
        if (options.el) this.$mount(options.el);
        if (typeof options.mounted === 'function') {
            options.mounted.apply(this);
        }
    }

    // 原型函数
    Vue.prototype.$mount = function(id) {
        if (this.$el) return;
        this.$el = document.getElementById(id.replace('#', ''));
        _nodeType1(this, this.$el);
    };
    Vue.prototype.$watch = function(item, callBack) {
        _registerWatcher(this, item, callBack);
    };
    return Vue;
}));