var mirror = {
    interval:   60000,
}

var isGoodBrower = $.support.leadingWhitespace;

//如果是 IE8 及以下浏览器则添加 Map 类
if (!isGoodBrower) {
    function Map() {
        this.elements = new Array();
        //获取Map元素个数
        this.size = function () {
            return this.elements.length;
        };
        //判断Map是否为空
        this.isEmpty = function () {
            return (this.elements.length < 1);
        };
        //删除Map所有元素
        this.clear = function () {
            this.elements = new Array();
        };
        //向Map中增加元素（key, value)
        this.set = function (_key, _value) {
            if (this.has(_key) == true) {
                if (this.containsValue(_value)) {
                    if (this.remove(_key) == true) {
                        this.elements.push({
                            key: _key,
                            value: _value
                        });
                    }
                } else {
                    this.elements.push({
                        key: _key,
                        value: _value
                    });
                }
            } else {
                this.elements.push({
                    key: _key,
                    value: _value
                });
            }
        };
        //删除指定key的元素，成功返回true，失败返回false
        this.remove = function (_key) {
            var bln = false;
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        this.elements.splice(i, 1);
                        return true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };
        //获取指定key的元素值value，失败返回null
        this.get = function (_key) {
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        return this.elements[i].value;
                    }
                }
            } catch (e) {
                return null;
            }
        };
        //获取指定索引的元素（使用element.key，element.value获取key和value），失败返回null
        this.element = function (_index) {
            if (_index < 0 || _index >= this.elements.length) {
                return null;
            }
            return this.elements[_index];
        };
        //判断Map中是否含有指定key的元素
        this.has = function (_key) {
            var bln = false;
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        bln = true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };
        //判断Map中是否含有指定value的元素
        this.containsValue = function (_value) {
            var bln = false;
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].value == _value) {
                        bln = true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };
        //获取Map中所有key的数组（array）
        this.keys = function () {
            var arr = new Array();
            for (i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].key);
            }
            return arr;
        };
        //获取Map中所有value的数组（array）
        this.values = function () {
            var arr = new Array();
            for (i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].value);
            }
            return arr;
        };
    }
}


/*var statusMap = new Map([
    ["success", "同步成功"],
    ["failed", "同步失败"],
    ["syncing", "同步中..."],
    ["presyncing", "同步预处理"],
    ["paused", "暂停同步"],
    ["disabled", "停止同步"],
]);*/
//兼容IE8
var statusMap = new Map();
statusMap.set("success", "同步成功");
statusMap.set("failed", "同步失败");
statusMap.set("syncing", "同步中...");
statusMap.set("presyncing", "同步预处理");
statusMap.set("paused", "暂停同步");
statusMap.set("disabled", "停止同步");


mirror.update = function update() {
    //取出tunasync同步工具的数据，进行json解析并更新首页的表格
    $.get("jobs.json", function(data) {
        for (var i = 0, n = data.length; i < n; i++){
            var job = eval(data[i]);
            var updateClass = "." + job.name + ".update-time";
            var upstreamClass = "." + job.name + ".upstream";
            var statusClass = "." + job.name + ".sync-status";
            var sizeClass = "." + job.name + ".mirror-size";
            $(updateClass).html(job.last_update.substring(0, 19));
            $(upstreamClass).html(job.upstream);
            $(statusClass).html(statusMap.get(job.status));
            $(sizeClass).html(job.size);
        }
    });
}


mirror.init = function (){
    this.update();
    // 定时刷新，同时需使用定时脚本：
    //wget -c http://localhost:14242/jobs -O jobs.json -a /mirrors/log/plog/wget.log
    // rm -f jobs.json?
    if (isGoodBrower){
        setInterval(function() {
            this.update();
        }.bind(this), this.interval);
    }
}