English | [中文](./README-zh_CN.md)

# RTL Codemods Demo

The provided demo source code is not the completed Codemods utilized by Tubi during the Enzyme project migration. Instead, it is a highly simplified version that demonstrates the structure and operating principles of Codemods code after removing business code dependencies and complex transformer implementations. This demo serves as both a learning reference for Codemods and a scaffold foundation for developing custom Codemods.


## Invoke Codemods Script
The demo code here is not packaged as a command-line command. However, users can easily achieve the same command-line execution effect through the predefined npm script. For example, you can execute the following npm command to automatically migrate the Enzyme-based test file `./demo/test.spec.tsx` to an RTL implementation.

```shell
npm run transform ./demo/test.spec.tsx
```

For more command options, you can get them using the `--help` parameter.

```shell
npm run transform -- --help
```
