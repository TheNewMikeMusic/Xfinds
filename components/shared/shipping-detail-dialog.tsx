'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import { PriceDisplay } from '@/components/shared/price-display'
import { Agent, ProductOffer } from '@/lib/data'
import { CartItem } from '@/store/cart-store'
import { Info, Package, Weight, Ruler } from 'lucide-react'

interface ShippingDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agent: Agent | null
  offer?: ProductOffer
  cartItems?: CartItem[]
  estimatedShipping?: {
    min: number
    max: number
    currency: string
    note?: string
  }
}

export function ShippingDetailDialog({
  open,
  onOpenChange,
  agent,
  offer,
  cartItems,
  estimatedShipping,
}: ShippingDetailDialogProps) {
  const t = useTranslations('shippingDetail')

  // Calculate total weight and volume for cart items
  const totalWeight = cartItems?.reduce((sum, item) => sum + (item.weight || 0), 0) || 0
  const totalVolume = cartItems?.reduce((sum, item) => sum + (item.volume || 0), 0) || 0
  const hasWeight = cartItems?.some((item) => item.weight !== undefined) || false
  const hasVolume = cartItems?.some((item) => item.volume !== undefined) || false

  // Single offer shipping
  const singleShipping = offer ? offer.shipFee : null
  // Note: ProductOffer doesn't have weight/volume, these would come from product specs if needed
  const singleWeight = undefined
  const singleVolume = undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="glass border-blue-600/30 bg-gray-900/95 backdrop-blur-xl max-w-2xl max-h-[85vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-400" />
            {t('title', { agent: agent?.name || 'Agent' })}
          </DialogTitle>
          <DialogDescription className="text-gray-300 pt-2">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Shipping Summary */}
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">{t('summary')}</h3>
            <div className="space-y-2">
              {singleShipping !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{t('shippingFee')}:</span>
                  <div className="text-xl font-bold text-blue-400">
                    <PriceDisplay amount={singleShipping} originalCurrency={(offer?.currency || 'CNY') as any} size="lg" />
                  </div>
                </div>
              )}
              {estimatedShipping && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{t('estimatedShipping')}:</span>
                  <div className="text-xl font-bold text-blue-400">
                    {estimatedShipping.min === estimatedShipping.max ? (
                      <PriceDisplay amount={estimatedShipping.min} originalCurrency={estimatedShipping.currency as any} size="lg" />
                    ) : (
                      <>
                        <PriceDisplay amount={estimatedShipping.min} originalCurrency={estimatedShipping.currency as any} size="lg" /> - <PriceDisplay amount={estimatedShipping.max} originalCurrency={estimatedShipping.currency as any} size="lg" />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Weight & Volume Info */}
          {(singleWeight || totalWeight > 0 || singleVolume || totalVolume > 0) && (
            <div className="bg-gray-800/50 border border-white/10 rounded-lg p-4">
              <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                <Weight className="h-4 w-4 text-blue-400" />
                {t('dimensions')}
              </h3>
              <div className="space-y-2 text-sm">
                {singleWeight !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('itemWeight')}:</span>
                    <span className="text-white">{singleWeight} kg</span>
                  </div>
                )}
                {totalWeight > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('totalWeight')}:</span>
                    <span className="text-white">{totalWeight.toFixed(2)} kg</span>
                  </div>
                )}
                {singleVolume !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('itemVolume')}:</span>
                    <span className="text-white">{singleVolume} L</span>
                  </div>
                )}
                {totalVolume > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('totalVolume')}:</span>
                    <span className="text-white">{totalVolume.toFixed(2)} L</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Item Breakdown (for cart) */}
          {cartItems && cartItems.length > 0 && (
            <div className="bg-gray-800/50 border border-white/10 rounded-lg p-4">
              <h3 className="text-md font-semibold text-white mb-3">{t('itemBreakdown')}</h3>
              <div className="space-y-2">
                {cartItems.map((item, index) => (
                  <div key={item.offerId || index} className="flex justify-between items-center text-sm py-2 border-b border-white/5 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="text-white truncate">{item.title || item.productId}</div>
                      <div className="text-gray-400 text-xs">
                        {item.weight !== undefined && `${t('weight')}: ${item.weight} kg`}
                        {item.weight !== undefined && item.volume !== undefined && ' • '}
                        {item.volume !== undefined && `${t('volume')}: ${item.volume} L`}
                        {!item.weight && !item.volume && t('noDimensions')}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-white"><PriceDisplay amount={item.shipFee} originalCurrency="CNY" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calculation Method */}
          <div className="bg-gray-800/50 border border-white/10 rounded-lg p-4">
            <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-400" />
              {t('calculationMethod')}
            </h3>
            <div className="text-sm text-gray-300 space-y-2">
              {singleShipping !== null ? (
                <p>{t('singleItemMethod')}</p>
              ) : cartItems && cartItems.length > 0 ? (
                <>
                  <p>{t('multiItemMethod')}</p>
                  {!hasWeight && !hasVolume && (
                    <p className="text-yellow-400 flex items-center gap-1 mt-2">
                      <Info className="h-3 w-3" />
                      {t('noWeightWarning')}
                    </p>
                  )}
                </>
              ) : null}
              {estimatedShipping?.note && (
                <p className="text-blue-300 mt-2">{estimatedShipping.note}</p>
              )}
            </div>
          </div>

          {/* Agent Info */}
          {agent && (
            <div className="bg-gray-800/50 border border-white/10 rounded-lg p-4">
              <h3 className="text-md font-semibold text-white mb-2">{t('agentInfo')}</h3>
              <div className="text-sm text-gray-300">
                <p>{agent.name}</p>
                {agent.speedTag && (
                  <p className="mt-1">
                    {t('deliverySpeed')}: <span className="text-blue-400 capitalize">{agent.speedTag}</span>
                  </p>
                )}
                {agent.rating && (
                  <p className="mt-1">
                    {t('rating')}: <span className="text-blue-400">{agent.rating}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-3">
            <p className="text-xs text-yellow-300">{t('disclaimer')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

