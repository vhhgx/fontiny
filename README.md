# FONT_COMPRESSION_TOOL

一个基于[fontmin](https://github.com/ecomfe/fontmin)的批量字体字型提取压缩工具，目前仅支持`ttf`（或`otf`）转`woff`和`svg`

## 功能

- 中英文采用不同压缩策略
  - 中文：字符提取后转换
  - 英文：转为woff等格式
- 支持基于git的增量或全量压缩
- 较详尽的配置项，可见根目录`compress.config.js`文件
- 压缩后会创建便于调用的`main.css`
- 根据字体文件名称生成`font-family`，如有字重的区别，则除regular外会标记相应的字重

## 使用

### 安装

需求：Node.js v16或更高

```shell
# 克隆仓库
git clone https://github.com/vhhgx/font_compression_tool.git
# 进入项目并安装依赖
cd font_compression_tool && npm install
# 执行初始化命令
npm run init
```

### 目录结构


默认初始化创建`input`目录，结构为`语种/字体公司/字体名称/字重/字体文件`，以免费可商用的[优设标题黑](https://www.uisdc.com/font-empower#uisdc_font)为例`cn/youshe/biaotihei/regular/ysbth.ttf`

在某些区分简繁体的书法字体中，结构则有所改变，以付费字体`方正宋刻本秀楷简体`为例`cn/fangzheng/songkeben/simplified/regular/fzqkb.ttf`

压缩后，`output`目录将会保留原结构，因此`input`应按具体场景具体组织


### 关于字重

字重在字体设计和css中用于描述字体的粗细。尽管浏览器支持多种字重，但效果由字体决定。以下是常见的9个字重


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


在CSS中，可以使用font-weight属性指定字重。仅当字体提供特定字重时，浏览器才能正确渲染，否则浏览器会默认选择最接近的可用字重


## 关于版本

- 0.1.0：命令行版本字型批量提取，发布于2023-10-11


## 下个版本

- [ ] 使用Nuxt.js给项目添加UI层
- [ ] 配置文件的可视化
- [ ] 在`output`查看压缩后字体的HTML输出
- [ ] 作为npm包发布
- [ ] 记录字体信息的JSON文件
- [ ] 响应`input`目录变化

## 已知的问题和缺陷

- [ ] 日志的时间缓存问题
- [ ] main.css地址配置

## 许可证

根据MIT许可证进行许可

## 致谢

感谢Fontmin为此项目提供的底层支持
