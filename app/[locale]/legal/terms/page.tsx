import { setRequestLocale } from 'next-intl/server'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent } from '@/components/ui/card'

interface TermsPageProps {
  params: { locale: string }
}

export default function TermsPage({ params }: TermsPageProps) {
  setRequestLocale(params.locale)
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Card className="glass">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <h1>服务条款</h1>
            <p className="text-gray-400">最后更新: {new Date().toLocaleDateString('zh-CN')}</p>
            
            <h2>1. 接受条款</h2>
            <p>
              通过访问和使用 Xfinds，您同意遵守这些服务条款。如果您不同意这些条款，请不要使用我们的服务。
            </p>

            <h2>2. 服务描述</h2>
            <p>
              Xfinds 是一个产品搜索和代理比较平台。我们提供产品信息、价格比较和代理服务商的链接。
              我们不是零售商，也不直接销售产品。
            </p>

            <h2>3. 用户责任</h2>
            <p>
              您有责任确保您提供的信息准确无误。您不得使用我们的服务进行任何非法活动。
            </p>

            <h2>4. 第三方链接</h2>
            <p>
              我们的网站包含指向第三方网站的链接。我们不对这些网站的内容或隐私政策负责。
            </p>

            <h2>5. 免责声明</h2>
            <p>
              我们不对通过我们的平台找到的产品或服务的质量、安全性或合法性做出任何保证。
              所有交易均在您和第三方代理之间进行。
            </p>

            <h2>6. 联系我们</h2>
            <p>
              如果您对这些条款有任何疑问，请联系我们。
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

