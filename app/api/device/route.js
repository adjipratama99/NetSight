import { apiPost } from '@/lib/ApiRequest'

export async function POST(req) {
    const response = await apiPost(req, 'monitoring')
    return response
}