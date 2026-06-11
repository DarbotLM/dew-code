// Production constants
export const PRODUCTION_CLERK_BASE_URL = "https://clerk.dewcode.com"
export const PRODUCTION_DEW_CODE_API_URL = "https://app.dewcode.com"

// Functions with environment variable fallbacks
export const getClerkBaseUrl = () => process.env.CLERK_BASE_URL || PRODUCTION_CLERK_BASE_URL
export const getDewCodeApiUrl = () => process.env.DEW_CODE_API_URL || PRODUCTION_DEW_CODE_API_URL
