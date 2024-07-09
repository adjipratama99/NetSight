import { NextResponse, userAgent } from 'next/server'
import { HttpHandler as http } from '@/lib/HttpHandler'
import { destination } from '@/config/apiRoutes'
import { formatIp } from '@/lib/Helper'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import apis from '@/hidden/_api.json'

export async function apiPost(req, apiId) {
    return new Promise( async (resolve) => {
        if (apis.hasOwnProperty(apiId)) {
            if (destination.hasOwnProperty(apiId)) {
                const { searchParams } = new URL(req.url)
                const dest = searchParams.get("dest")
    
                if (destination[apiId].hasOwnProperty(dest)) {
                    let apiConfig = { ...apis[apiId] }
    
                    apiConfig["PATH"] = apiConfig["PATH"] + "/" + destination[apiId][dest].action + "/" + destination[apiId][dest].subAction
    
                    const { ua } = userAgent(req)
                    const clientIp = formatIp(req.headers.get('x-forwarded-for'))
                    const session = await getServerSession(authOptions)
                    let params = await req.json()
                    let config = {}

                    if(!("usingFormData" in params && params.usingFormData)) {
                        config = {
                            api: apiConfig,
                            headers: {},
                            body: JSON.stringify({
                                userAgent: ua,
                                clientIp,
                                username: session?.token?.username,
                                params
                            })
                        }
                    } else {
                        delete params.usingFormData
                        let data = ''
                        Object.keys(params).map((key, ind) => data += (ind !== 0 ? '&' : '')+ key +'='+ params[key])
                        
                        config = {
                            api: apiConfig,
                            headers: {
                                "Accept": "*/*",
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: data
                        }
                    }

                    return resolve(http(config))
                } else {
                    return resolve(NextResponse.json({ "code": -1, "message": "API destination not found" }, { status: 404 }))
                }
            } else {
                return resolve(NextResponse.json({ "code": -1, "message": "API configuration and destination doesnt match" }, { status: 404 }))
            }
        } else {
            return resolve(NextResponse.json({ "code": -1, "message": "API configuration is missing" }, { status: 500 }))
        }
    })
}