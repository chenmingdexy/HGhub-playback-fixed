# HGhub Playback Fixed

基于本地保留的 **HGhub v1.2.0 原始源码压缩包**恢复的独立备份与播放接口修复版本。非官方发行；没有合入其他 fork 的代码，也不包含原项目的 Git 提交历史。

## 下载

从本仓库的 [Releases](https://github.com/chenmingdexy/HGhub-playback-fixed/releases) 下载：

| 文件 | 用途 |
| --- | --- |
| `HGhub-1.2.0-arm64-fixed.apk` | Android ARM64 / arm64-v8a；适合 Redmi K40 等 64 位 ARM 设备 |
| `HGhub-1.2.0-playback-fixed.exe` | Windows x64 便携程序 |

Android 应用名为 **HGhub 修复版**，包名 `com.hghub.localrepair`，采用独立本地签名，可与原版并存。发布包不含签名私钥和密码。

## 本次修改

- 播放请求适配上游新版接口及 `streams.main` 返回格式，保留旧格式兼容。
- 内置播放自检同步更新。
- 增加新接口、旧接口格式及空地址回归测试。
- 增加 Android 独立包名配置和本地构建脚本。

## 验证与限制

- Windows：前端构建通过；Rust 测试 37 通过、5 跳过；播放器回归测试 5 通过；曾在 Windows 实机确认播放进度持续推进。
- Android：ARM64 release 编译、16 KB ZIP 对齐和 APK v2/v3 验签通过；**尚未在安卓手机实测播放**。
- 2026-11-13 检查时，播放接口能返回地址。上游随时可能变更，无法保证持续可用。
- 这不是完整安全审计结果；第三方站点内容和网络请求仍需自行判断。

## 自行构建

前端需要 Node.js、pnpm；Rust 最低版本见 `src-tauri/Cargo.toml`。依赖由锁文件固定。

```powershell
pnpm install --frozen-lockfile
pnpm build
pnpm app:build
```

Android 使用 JDK 21、SDK Platform 36、Build Tools 36.0.0、NDK 28.2.13676358。设置 `JAVA_HOME`、`ANDROID_HOME`、`NDK_HOME`，确保 Rust / pnpm 在 PATH 中，然后运行：

```powershell
.\build-android.ps1
```

该脚本生成 release APK；自行分发前需要用自己的密钥签名。

## 来源与许可

原项目：[Minireel/HGhub](https://github.com/Minireel/HGhub)。原始说明保存在 [README.upstream.md](README.upstream.md)，仅作历史资料；其中官方渠道说明不代表本仓库是官方发行。

保留原 [PolyForm Noncommercial License 1.0.0](LICENSE)。本项目不提供、不存储、不分发音视频内容；禁止商业化使用，请尊重上游站点及内容权利人的权益。

Required Notice: Copyright (c) 2026 HGhub contributors (https://github.com/Minireel/HGhub)
