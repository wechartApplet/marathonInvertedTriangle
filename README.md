<p align="center">
     <a href='https://docs.oracle.com/en/java/javase/8'><img alt="Java 8" src="https://img.shields.io/badge/Java%208-%23007396.svg?logo=java"></a>
    <a href='https://docs.spring.io/spring-boot/docs/2.6.2-SNAPSHOT/reference/html'><img alt="Spring Boot 2" src="https://img.shields.io/badge/Spring%20Boot%202-%23000000.svg?logo=springboot"></a>
    <a href='https://staging-cn.vuejs.org'><img alt="Vue 3" src="https://img.shields.io/badge/Vue%202%20-%232b3847.svg?logo=vue.js"></a><br/>
    <a href='#'><img alt="Github stars" src="https://img.shields.io/github/stars/201206030/novel?logo=github"></a>
    <a href='#'><img alt="Github forks" src="https://img.shields.io/github/forks/201206030/novel?logo=github"></a>
    <a href='#'><img alt="Gitee stars" src="https://gitee.com/novel_dev_team/novel/badge/star.svg?theme=gitee"></a>
    <a href='#'><img alt="Gitee forks" src="https://gitee.com/novel_dev_team/novel/badge/fork.svg?theme=gitee"></a>
</p>

# 马拉松倒三角计划配速生成器
 + 此项目是一个微信小程序项目，长距离的运动需要循序渐进的由慢变快的模式，有计划有目的的合理分配体力，才不会受伤，此小程序主要就是解决此类极限运动的配速配置的业务场景。

### 开发环境

+ Windows

### 配置环境

+ 啥都没配置                

### 开发工具

+ [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

###  编码规范

- 规范方式：严格遵守阿里编码规约。
- 命名统一：简介最大程度上达到了见名知意。
- 分包明确：层级分明可快速定位到代码位置。
- 注释完整：描述性高大量减少了开发人员的代码阅读工作量。
- 工具规范：使用统一jar包避免出现内容冲突。
- 代码整洁：可读性、维护性高。

### 包的结构 
```
+- marathonInvertedTriangle -- 项目根目录
|   +- .eslintrc.js -- ESLint 配置文件，用于定义代码的 linting 规则，确保代码风格一致。
|   +- .git -- Git 版本控制目录
|   +- .vscode -- Visual Studio Code 配置目录
|   |   +- settings.json -- Visual Studio Code 的项目特定设置文件，包含编辑器配置和文件关联
|   +- app.js -- 小程序的全局逻辑文件，包含小程序的生命周期函数和全局数据。
|   +- app.json -- 小程序的全局配置文件，定义了页面路径、窗口表现、网络超时时间等。
|   +- app.wxss -- 小程序的全局样式文件，定义了全局的 CSS 样式。
|   +- Images -- 存放图片资源的目录，用于存储小程序中使用的图片文件。
|   |   +- index.png -- 分享功能使用的默认图片
|   +- pages -- 存放小程序页面的目录，每个页面包含一个独立的文件夹。
|   |   +- components -- 可复用的UI组件
|   |   |   +- InfoColumn -- 信息行组件，用于展示配速相关的统计信息
|   |   |   |   +- InfoColumn.js -- 组件逻辑
|   |   |   |   +- InfoColumn.json -- 组件配置
|   |   |   |   +- InfoColumn.wxml -- 组件结构
|   |   |   |   +- InfoColumn.wxss -- 组件样式
|   |   |   +- PickerItem -- 选择框组件，用于时间和距离的选择
|   |   |   |   +- PickerItem.js -- 组件逻辑
|   |   |   |   +- PickerItem.json -- 组件配置
|   |   |   |   +- PickerItem.wxml -- 组件结构
|   |   |   |   +- PickerItem.wxss -- 组件样式
|   |   |   +- SubmitButton -- 提交按钮组件，处理表单提交
|   |   |   |   +- SubmitButton.js -- 组件逻辑
|   |   |   |   +- SubmitButton.json -- 组件配置
|   |   |   |   +- SubmitButton.wxml -- 组件结构
|   |   |   |   +- SubmitButton.wxss -- 组件样式
|   |   +- index -- 首页，用于输入配速计算参数
|   |   |   +- index.js -- 首页逻辑，处理用户输入和数据验证
|   |   |   +- index.json -- 首页配置
|   |   |   +- index.wxml -- 首页结构
|   |   |   +- index.wxss -- 首页样式
|   |   +- paceChart -- 配速图表页面，展示计算结果
|   |   |   +- paceChart.js -- 配速计算和展示逻辑
|   |   |   +- paceChart.json -- 页面配置
|   |   |   +- paceChart.wxml -- 页面结构
|   |   |   +- paceChart.wxss -- 页面样式
|   +- project.config.json -- 项目配置文件，包含项目基本信息和开发工具配置
|   +- project.private.config.json -- 项目私有配置，包含敏感信息
|   +- README.md -- 项目说明文档
|   +- sitemap.json -- 小程序 sitemap 配置，定义页面访问规则
|   +- utils -- 工具函数目录
|   |   +- cache.js -- 缓存管理工具，处理本地数据存储
|   |   +- common.js -- 通用工具函数，如时间格式化、数据转换等
|   |   +- distancePicker.js -- 距离选择器相关的工具函数
|   |   +- share.js -- 分享功能配置和处理
|   |   +- styleHelper.js -- 样式处理工具，处理动态样式和主题
|   |   +- timePicker.js -- 时间选择器相关的工具函数
|   |   +- util.js -- 其他通用工具函数
```

### 项目运行

+ 利用微信开发者工具运行

### 技术选型：

+ 木有啥框架也木有啥选型，就是纯wxml,wxcss,js


### 项目效果简介

![](./Images/img_1.png)

![](./Images/img_2.png)

### 项目二维码

![](./Images/index.png)

### 通过此项目GET

#### 微信开发工具快捷键

1. 格式化代码 shift + alt + f

#### 部分ES6功能

1. 展开运算符 (...)
```javascript
// 对象展开
const item = { type: 'initial', value: 5 };
const newItem = { ...item, selectedIndex: 0 };
// 结果: { type: 'initial', value: 5, selectedIndex: 0 }

// 添加或更新属性
const user = { name: '张三', age: 25 };
const updatedUser = { ...user, age: 26, role: 'admin' };
// 结果: { name: '张三', age: 26, role: 'admin' }

// 实际应用：更新选择器数据
const pickerItem = { type: 'initial', selectedIndex: 0 };
const updatedItem = { 
    ...pickerItem, 
    selectedIndex: initialIndex !== -1 ? initialIndex : 0 
};
```

展开运算符的特点：
- 创建对象的浅拷贝
- 可以方便地添加或更新属性
- 不会修改原对象
- 适合用于不可变数据的处理

2. map 数组方法
```javascript
// 基础示例：数值转换
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2);
// 结果: [2, 4, 6]

// 对象数组处理
const users = [
    { name: '张三', age: 20 },
    { name: '李四', age: 25 }
];
const names = users.map(user => user.name);
// 结果: ['张三', '李四']

// 实际应用：更新选择器状态
const pickerItems = items.map(item => {
    if (item.type === 'initial') {
        return { ...item, selectedIndex: newIndex };
    }
    return item;
});
```

map 的特点：
- 返回一个新数组，长度与原数组相同
- 不会修改原数组
- 每个元素都会被函数处理
- 常用于数据转换和格式化

3. find 数组方法
```javascript
// 基础示例：查找元素
const numbers = [1, 2, 3, 4];
const found = numbers.find(num => num > 2);
// 结果: 3

// 对象数组处理
const users = [
    { name: '张三', age: 20 },
    { name: '李四', age: 25 }
];
const foundUser = users.find(user => user.age > 20);
// 结果: { name: '李四', age: 25 }

// 实际应用：查找选择器数据
const pickerItems = [
    { type: 'initial', selectedIndex: 0 },
    { type: 'sprint', selectedIndex: 1 }
];
const foundItem = pickerItems.find(item => item.type === 'initial');
// 结果: { type: 'initial', selectedIndex: 0 }
```

find 的特点：
- 返回第一个满足条件的元素
- 如果没有找到元素，返回 undefined
- 常用于查找特定元素

4. reduce 数组方法
```javascript
// 基础示例：累加
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, num) => acc + num, 0);
// 结果: 10

// 对象数组处理
const users = [
    { name: '张三', age: 20 },
    { name: '李四', age: 25 }
];
const totalAge = users.reduce((acc, user) => acc + user.age, 0);
// 结果: 45

// 实际应用：计算配速总时间
const paceData = [
    { pace: 360 },  // 6分钟
    { pace: 330 },  // 5.5分钟
    { pace: 300 }   // 5分钟
];
const totalTime = paceData.reduce((acc, { pace }) => acc + pace, 0);
// 结果: 990秒
```

reduce 的特点：
- 返回累积的结果
- 可以处理任意类型的数据
- 常用于数据统计和计算

5. includes 方法
```javascript
// 基础示例：字符串包含
const text = "Hello World";
console.log(text.includes('World'));  // true
console.log(text.includes('Python')); // false

// 数组包含
const numbers = [1, 2, 3, 4];
console.log(numbers.includes(2));     // true
console.log(numbers.includes(5));     // false

// 实际应用：检查配速数据
const paceData = [
    { pace: 360 },  // 6分钟
    { pace: 330 },  // 5.5分钟
    { pace: 300 }   // 5分钟
];
console.log(paceData.includes({ pace: 360 }));  // false
console.log(paceData.includes({ pace: 330 }));  // false
console.log(paceData.includes({ pace: 300 }));  // false
```

includes 的特点：
- 返回布尔值（true/false）
- 区分大小写
- 可用于字符串和数组
- 常用于检查数据是否包含特定值

### 参考链接

1. [微信小程序官方API](https://developers.weixin.qq.com/miniprogram/dev/api/)