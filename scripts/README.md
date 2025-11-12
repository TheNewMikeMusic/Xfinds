# 图片处理脚本说明

## 功能概述

这个脚本可以自动处理 `public` 文件夹中的图片文件，包括：
- ✅ 自动重命名中文文件名（使用文件内容哈希）
- ✅ 转换为 WebP 格式（更小的文件大小）
- ✅ 压缩图片（优化质量设置）
- ✅ 输出到 `public/images/optimized/` 文件夹
- ✅ 生成文件名映射文件

## 使用方法

### 方法一：使用 npm 脚本（推荐）

```bash
npm run process-images
```

### 方法二：直接运行 TypeScript 文件

```bash
npx tsx scripts/process-images.ts
```

## 处理流程

1. **扫描图片**：自动扫描 `public` 文件夹中的所有图片文件（支持 `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`）

2. **生成安全文件名**：
   - 使用文件内容的 SHA-256 哈希值生成唯一文件名
   - 格式：`{hash前16位}.webp`
   - 例如：`a1b2c3d4e5f6g7h8.webp`

3. **转换和压缩**：
   - 转换为 WebP 格式
   - 质量设置为 85（如果文件变大，则使用质量 90）
   - 压缩努力程度为 6（平衡质量和速度）

4. **保存文件**：
   - 原始文件结构保留在输出目录中
   - 例如：`public/images/product.png` → `public/images/optimized/images/product.webp`

5. **生成映射文件**：
   - 在 `public/images/optimized/filename-mapping.json` 中保存原始文件名和优化后文件名的映射关系

## 输出结构

```
public/
├── images/
│   └── optimized/
│       ├── filename-mapping.json  # 文件名映射
│       ├── product.png → product.webp
│       └── uploads/
│           └── ...
└── ...
```

## 映射文件格式

```json
{
  "images/product.png": {
    "safe": "a1b2c3d4e5f6g7h8.webp",
    "hash": "a1b2c3d4e5f6g7h8...",
    "optimized": "/images/optimized/images/a1b2c3d4e5f6g7h8.webp",
    "original": "images/product.png"
  }
}
```

## API 接口

### POST `/api/process-images`

处理图片的 API 接口。

**请求体：**
```json
{
  "path": "images/product.png",  // 可选：处理指定路径的图片
  "scanAll": true                 // 可选：扫描所有图片
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "processed": 10,
    "failed": 0,
    "results": [
      {
        "original": "images/product.png",
        "optimized": "/images/optimized/images/a1b2c3d4e5f6g7h8.webp",
        "safe": "a1b2c3d4e5f6g7h8.webp",
        "size": {
          "original": 1024000,
          "optimized": 512000,
          "reduction": 50
        }
      }
    ]
  }
}
```

## 注意事项

1. **备份原始文件**：脚本不会删除原始文件，只是创建优化版本

2. **跳过已处理文件**：映射文件中已存在的文件不会重复处理（除非删除映射文件）

3. **文件大小**：WebP 格式通常比 PNG/JPG 小 30-50%

4. **浏览器兼容性**：现代浏览器都支持 WebP 格式

5. **中文文件名**：完全支持中文文件名，会自动转换为安全的哈希文件名

## 常见问题

**Q: 如何处理新添加的图片？**
A: 直接运行 `npm run process-images`，脚本会自动扫描并处理新文件。

**Q: 如何更新已处理的图片？**
A: 删除 `public/images/optimized/filename-mapping.json` 文件，然后重新运行脚本。

**Q: 优化后的图片在哪里？**
A: 在 `public/images/optimized/` 文件夹中，保持原有的目录结构。

**Q: 如何在代码中使用优化后的图片？**
A: 优先使用优化后的路径（`/images/optimized/...`），如果不存在则回退到原始路径。

