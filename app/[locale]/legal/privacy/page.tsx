import { setRequestLocale } from 'next-intl/server'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent } from '@/components/ui/card'

interface PrivacyPageProps {
  params: { locale: string }
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  setRequestLocale(params.locale)
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Card className="glass">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <h1>隐私政策</h1>
            <p className="text-gray-400">最后更新: {new Date().toLocaleDateString('zh-CN')}</p>
            
            <h2>1. 信息收集</h2>
            <p>
              我们收集您在使用我们的服务时提供的信息，包括但不限于：
            </p>
            <ul>
              <li>注册信息（邮箱地址）</li>
              <li>使用数据（搜索查询、浏览历史）</li>
              <li>购物车和比较列表数据</li>
            </ul>

            <h2>2. 信息使用</h2>
            <p>
              我们使用收集的信息来：
            </p>
            <ul>
              <li>提供和改进我们的服务</li>
              <li>个性化您的体验</li>
              <li>分析使用情况</li>
            </ul>

            <h2>3. 信息共享</h2>
            <p>
              我们不会向第三方出售您的个人信息。我们可能会与以下各方共享信息：
            </p>
            <ul>
              <li>服务提供商（如托管服务）</li>
              <li>法律要求时</li>
            </ul>

            <h2>4. 数据安全</h2>
            <p>
              我们采取合理的安全措施来保护您的信息，但无法保证绝对安全。
            </p>

            <h2>5. Cookie</h2>
            <p>
              我们使用 Cookie 来改善用户体验。您可以通过浏览器设置管理 Cookie。
            </p>

            <h2>6. 您的权利</h2>
            <p>
              您有权访问、更正或删除您的个人信息。请联系我们行使这些权利。
            </p>

            <h2>7. 联系我们</h2>
            <p>
              如果您对隐私政策有任何疑问，请联系我们。
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

