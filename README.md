# RTL Codemods Demo

这份 Demo 源码并非 Tubi 在 Enzyme 项目迁移中使用的成品 Codemods 代码，而是在删除业务代码依赖和繁杂的 transfomers 实现后，用于展示 Codemods 代码组织方式和工作原理的极精简版本。它既是学习 Codemods 的一个参考示例，也可被用作构建专有 Codemods 的脚手架基础。

## 调用 Codemods 脚本

作为示例代码，这里并未将 Codemods 封装成命令行命令。但用户可以方便地通过预置的 npm 脚本达到同样的命令行执行效果。例如，可以通过执行如下的 npm 命令将基于 Enzyme 的 `./demo/test.spec.tsx` 测试文件自动迁移为 RTL 的实现。

```shell
npm run transform ./demo/test.spec.tsx
```

更多命令选项，可以通过 `--help` 参数获得。

```shell
npm run transform -- --help
```
