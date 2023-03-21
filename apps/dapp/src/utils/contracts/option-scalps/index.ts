
type ScalpPools = 'ETH' | 'BTC' | string
export const MINIMUM_MARGIN: Record<ScalpPools, number> = {
    'ETH': 10,
    'BTC': 0.0005
}

