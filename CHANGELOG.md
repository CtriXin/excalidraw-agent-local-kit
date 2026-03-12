# Changelog

## v0.2.1 — 2026-03-12
- 改进 native `.excalidraw` 导出时的文本宽度估算：区分空白、CJK 与普通字符，减少 browser import 后的文本尺寸偏差

## v0.2.0 — 2026-03-12
- 新增 `scripts/export_native_scene.js` 与 `scripts/export_native_scene_impl.mjs`，可将本地 `*.elements.json` 导出为原生 `.excalidraw` 文件
- 补充 `README.md` 的 File Formats 说明，明确区分本地 truth source 与 excalidraw.com 可上传格式
- 更新 `SKILL.md`、`examples/local-scenes/README.md` 与 `references/troubleshooting.md`，把 browser upload/open 的正确路径和常见 invalid file 问题写清楚

## v0.1.0 — 2026-03-11
- 初始开源版本：local-first Excalidraw MCP workflow、scene-file 规范、安装脚本与示例模板
