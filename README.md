# FONTINY

一个基于[fontmin](https://github.com/ecomfe/fontmin)的批量字体字型提取压缩工具，目前仅支持`ttf`（或`otf`）转`woff`和`svg`

## 使用

### 安装

需求：Node.js v16或更高

```shell
# 克隆仓库
git clone https://github.com/vhhgx/fontiny.git
# 进入项目并安装依赖
cd fontiny && npm install

# 如果npm i报错，则需要单独安装element-plus后再执行npm i
npm install -D @element-plus/nuxt
```

### 目录结构

默认初始化创建`input`目录，结构为`语种/字体公司/字体名称/（属性，可选）/字重/字体文件`，以免费可商用的[优设标题黑](https://www.uisdc.com/font-empower#uisdc_font)为例，结果为`cn/youshe/biaotihei/regular/ysbth.ttf`

在某些书法字体中，区分简体和繁体两种属性。依然以标题黑为例，则结构变为`cn/youshe/biaotihei/simplified/regular/ysbth.ttf`

压缩后，`output`目录将会保留原结构，因此`input`应按具体场景具体组织。


**需要注意**

由于根据字体名称生成`font-family`属性，因此非同一字族的字体文件应保持**文件名唯一**


## 开源引用

- [vuesax-alpha](https://www.vuesax.space/components/checkbox.html#icon)：一个适用于Vue3的高颜值组件库
- [fontmin](https://github.com/ecomfe/fontmin)：字型提取，字体格式转换工具
- [element-plus](https://element-plus.org/zh-CN/)：饿了么官方Vue3组件库


## 关于字重

字重在字体设计和css中用于描述字体的粗细，以下是常见的9个字重


| 字重名称    | 描述                       | weight |
| ----------- | -------------------------- | ------ |
| Thin        | 极细                       | 100    |
| Extra Light | 比Thin稍重                 | 200    |
| Light       | 轻字重                     | 300    |
| Regular     | 标准字重，常用于正文       | 400    |
| Medium      | 介于Regular和Semi Bold之间 | 500    |
| Semi Bold   | 较粗                       | 600    |
| Bold        | 常用于强调或标题           | 700    |
| Extra Bold  | 比Bold更粗                 | 800    |
| Black       | 最粗                       | 900    |


在CSS中，可以使用font-weight属性指定字重。尽管浏览器支持多种字重，但效果由字体决定。字体提供特定字重时，浏览器才能正确渲染，否则浏览器会默认选择最接近的可用字重


## 版本

### Version 0.1.0

命令行版本字型批量提取，发布于2023-10-11

- 中英文采用不同压缩策略
  - 中文：字符提取后转换
  - 英文：转为woff等格式
- 支持基于git的增量或全量压缩
- 较详尽的配置项，可见根目录`compress.config.js`文件
- 压缩后会创建便于调用的`main.css`
- 根据字体文件名称生成`font-family`，如有字重的区别，则除regular外会标记相应的字重



## 许可证

[MIT](https://github.com/vhhgx/fontiny/blob/main/LICENSE)

## 致谢

感谢Fontmin为此项目提供的底层支持
