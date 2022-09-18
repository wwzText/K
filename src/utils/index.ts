// input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
// 选择文本。createTextRange(setSelectionRange)是input方法
const selectText = (textbox: any, startIndex: number, stopIndex: number) => {
    if (textbox.createTextRange) {//ie
        const range = textbox.createTextRange();
        range.collapse(true);
        range.moveStart('character', startIndex);//起始光标
        range.moveEnd('character', stopIndex - startIndex);//结束光标
        range.select();//不兼容苹果
    } else {//firefox/chrome
        textbox.setSelectionRange(startIndex, stopIndex);
        textbox.focus();
    }
}

export const copyText = (text: string | number) => {
    if (typeof (text) === 'number') {
        text = text.toString()
    };

    const textString = text.toString();
    let input = document.createElement('input');
    input.id = "copy-input";
    input = document.createElement('input');
    input.readOnly = true;        // 防止ios聚焦触发键盘事件
    input.style.position = "absolute";
    input.style.left = "-1000px";
    input.style.zIndex = "-1000";
    document.body.appendChild(input)

    input.value = textString;
    // ios必须先选中文字且不支持 input.select();
    selectText(input, 0, textString.length);

    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    input.blur();
};

// 隐藏中间地址
export const hiddenAddress = (address: string) => {
    address = address || "";
    let arr = address.split('');
    arr.splice(8, arr.length - 16, '****');
    return arr.join('')
}

export const formatTime = (num: number | string , format = "YYYY-MM-DD hh:mm:ss") => {
    let ret, date, renum;
    // 处理时间戳，js一般获取的时间戳是13位，PHP一般是10位,根据实际情况做判断处理
    if (num.toString().length == 10) {
        date = new Date(parseInt(num.toString()) * 1000);
    } else {
        date = new Date(parseInt(num.toString()));
    }

    const opt = {
        "Y": date.getFullYear().toString(), // 年
        "M": (date.getMonth() + 1).toString(), // 月
        "D": date.getDate().toString(), // 日
        "h": date.getHours().toString(), // 时
        "m": date.getMinutes().toString(), // 分
        "s": date.getSeconds().toString() // 秒
        // 目前用的是这六种符号,有其他格式化字符需求可以继续添加，值必须转化成字符串
    };
    type Opt = "Y" | "M" | "D" | "h" | "m" | "s"
    for (let k in opt) {
        ret = new RegExp("(" + k + "+)").exec(format);
        if (ret) {
            renum = (ret[1].length == 1) ? (opt[k as Opt]) : (opt[k as Opt].padStart(ret[1].length, "0")) //根据复数前面是否补零,如“mm”补零，单“m”前面不补零
            format = format.replace(ret[1], renum)  //替换
        };
    };
    return format;
};