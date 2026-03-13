# Changelog

## v0.3.0 — 2026-03-13
- `allowed-tools` 加入本地 MCP 工具，skill 执行时可直接调用 `create_view` 和 `export_to_excalidraw`
- 默认 workflow 改为 Local-first：生成 `.elements.json` → 自动 `export_native_scene.js` → 输出 `.excalidraw` 文件
- 移除 Browser-import mode（合并进 Local-first），简化为两个模式：Local-first / Online-share
- 新增 Layout Defaults 间距规范：同层横向 ≥80px、层间纵向 ≥100px、矩形最小 240×80，防止文字挤压截断
- 更新 README workflow 段落和 File Structure
- 新增 workflow 流程图 `examples/local-scenes/v030_workflow_test.excalidraw`

## v0.2.2 — 2026-03-12
- Roll forward native `.excalidraw` 文本宽度估算修正，确保 patch release tag 指向包含最新导出逻辑的 commit

## v0.2.1 — 2026-03-12
- 改进 native `.excalidraw` 导出时的文本宽度估算：区分空白、CJK 与普通字符，减少 browser import 后的文本尺寸偏差

## v0.2.0 — 2026-03-12
- 新增 `scripts/export_native_scene.js` 与 `scripts/export_native_scene_impl.mjs`，可将本地 `*.elements.json` 导出为原生 `.excalidraw` 文件
- 补充 `README.md` 的 File Formats 说明，明确区分本地 truth source 与 excalidraw.com 可上传格式
- 更新 `SKILL.md`、`examples/local-scenes/README.md` 与 `references/troubleshooting.md`，把 browser upload/open 的正确路径和常见 invalid file 问题写清楚

## v0.1.0 — 2026-03-11
- 初始开源版本：local-first Excalidraw MCP workflow、scene-file 规范、安装脚本与示例模板
