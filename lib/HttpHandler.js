import { NextResponse } from 'next/server'
import https from 'https'

export async function HttpHandler(config) {
  try {
    let options = {
      method: config.api.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      body: config.body
    }

    if (config.api.USERNAME && config.api.PASSWORD) {
      options.headers["Authorization"] = "Basic "+ Buffer.from(config.api.USERNAME +":"+ config.api.PASSWORD).toString("base64")
    }

    if (typeof config.headers === 'object' && !Array.isArray(config.headers) && config.headers !== null && Object.keys(config.headers).length) {
      options.headers = Object.assign(options.headers, config.headers)
    }
    
    if (config.api?.SSL) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      options["agent"] = new https.Agent({
        rejectUnauthorized: false,
      });
    }

    const url = ((config.api?.SSL) ? "https://" : "http://") + config.api.HOST +":"+ config.api.PORT + config.api.PATH
    const res = await fetch(url, options)
    
    if (! res.ok) {
      const response = await res.json()
      return NextResponse.json(response)
      return NextResponse.json({ "code": -1, "message": "Something wrong", "content": null, "error": { config, url, options } }, { status: res.status })
    }

    const response = await res.json()

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json({ "code": -1, "message": error.toString(), "content": null }, { status: 500 })
  }
}