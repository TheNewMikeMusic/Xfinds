'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Category } from '@/lib/data'
import { z } from 'zod'

const productSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  brand: z.string().min(1, '品牌不能为空'),
  categoryId: z.string().min(1, '请选择分类'),
  slug: z.string().min(1, 'Slug不能为空'),
  priceMin: z.number().min(0, '最低价格必须大于0'),
  priceMax: z.number().min(0, '最高价格必须大于最低价格'),
  tags: z.string().optional(),
})

export function UploadForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    categoryId: '',
    slug: '',
    priceMin: '',
    priceMax: '',
    tags: '',
    image: null as File | null,
  })

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form
      const validation = productSchema.safeParse({
        title: formData.title,
        brand: formData.brand,
        categoryId: formData.categoryId,
        slug: formData.slug,
        priceMin: Number(formData.priceMin),
        priceMax: Number(formData.priceMax),
        tags: formData.tags,
      })

      if (!validation.success) {
        alert('表单验证失败: ' + validation.error.errors[0].message)
        setLoading(false)
        return
      }

      // Upload image if provided
      let imageUrl = '/placeholder.jpg'
      if (formData.image) {
        const formDataToSend = new FormData()
        formDataToSend.append('image', formData.image)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataToSend,
        })

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          imageUrl = uploadData.url
        }
      }

      // Create product
      const productRes = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          brand: formData.brand,
          categoryId: formData.categoryId,
          slug: formData.slug,
          cover: imageUrl,
          gallery: [imageUrl],
          priceGuide: {
            min: Number(formData.priceMin),
            max: Number(formData.priceMax),
            currency: 'CNY',
          },
          tags: formData.tags
            ? formData.tags.split(',').map((t) => t.trim())
            : [],
          specs: {},
          offers: [],
        }),
      })

      if (productRes.ok) {
        alert('产品创建成功！')
        router.push(`/product/${formData.slug}`)
      } else {
        const error = await productRes.json()
        alert('创建失败: ' + (error.message || '未知错误'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('发生错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>上传新产品</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">产品标题</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="brand">品牌</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="categoryId">分类</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
            >
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              required
              placeholder="product-slug"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priceMin">最低价格</Label>
              <Input
                id="priceMin"
                type="number"
                value={formData.priceMin}
                onChange={(e) =>
                  setFormData({ ...formData, priceMin: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="priceMax">最高价格</Label>
              <Input
                id="priceMax"
                type="number"
                value={formData.priceMax}
                onChange={(e) =>
                  setFormData({ ...formData, priceMax: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags">标签 (逗号分隔)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div>
            <Label htmlFor="image">产品图片</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files?.[0] || null,
                })
              }
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? '创建中...' : '创建产品'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

