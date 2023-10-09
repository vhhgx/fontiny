# FONT_COMPRESSION_TOOL

一个基于[fontmin](https://github.com/ecomfe/fontmin)的字体压缩工具


## TodoList

- [x] 拆分input和output目录
- [x] 重写日志方法
- [ ] 根据input的git记录，默认增量压缩。可在设置中选择为全量压缩
  - [ ] 如果是全量压缩，则需要在开始前将main.css进行删除，否则会引起错误
- [x] output全部压缩完成后，生成main.css，用于项目引入
- [x] 中英文使用不同压缩策略
- [x] 需要转哪些东西，需要使用配置文件进行配置
- [ ] input目录的初始化（提供一个符合要求的空目录）
- [ ] 默认output路径为平行于根目录的`output`路径

- [ ] BUG 日志方法时间缓存问题

