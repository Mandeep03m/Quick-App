const axios=require('axios')
const cheerio=require('cheerio')

const scrapeGoogle=async(req,res)=>{
    try {
        const {keyword}=req.query
        if(!keyword){
            return res.status(400).json({message:"Keyword not found"})
        }

        const query=encodeURIComponent(keyword)
        // Prefer a stable SERP API when configured
        if (process.env.SERPAPI_KEY) {
            try {
                const serpApiUrl = `https://serpapi.com/search.json?engine=google&q=${query}&hl=en&gl=us&num=10&api_key=${process.env.SERPAPI_KEY}`
                const { data } = await axios.get(serpApiUrl, { timeout: 15000 })
                const organic = Array.isArray(data.organic_results) ? data.organic_results : []
                const results = organic.map(r => ({
                    title: r.title,
                    url: r.link,
                    snippet: r.snippet || r.snippet_highlighted_words?.join(' ')
                })).filter(r => r.title && r.url)
                return res.status(200).json({ keyword, results })
            } catch (e) {
                // fall through to HTML scraping if SERP API fails
                console.warn('SERPAPI failed, falling back to HTML scraping:', e?.message || e)
            }
        }

        const url=`https://www.google.com/search?q=${query}&hl=en&gl=us&num=10&safe=active&pws=0`

        const {data}=await axios.get(url,{
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language":"en-US,en;q=0.9",
                "Referer":"https://www.google.com/",
                // Bypass consent pages in some regions
                "Cookie":"CONSENT=YES+"
            },
            timeout: 15000,
        })
        const $=cheerio.load(data)
        const results=[]

        // Google SERP main results typically live under #search .g containers
        $("#search .g").each((i, container) => {
            const titleEl = $(container).find('h3').first()
            const anchorEl = titleEl.closest('a')
            const rawHref = anchorEl.attr('href')
            const title = titleEl.text().trim()

            if (!title || !rawHref) return

            // Normalize Google redirect links like /url?q=https://example.com&sa=...
            let finalUrl = rawHref
            try {
                if (rawHref.startsWith('/url?')) {
                    const parsed = new URL('https://www.google.com' + rawHref)
                    const q = parsed.searchParams.get('q')
                    if (q) finalUrl = q
                }
            } catch(_) {}

            // Extract snippet/description if present
            const snippet = $(container).find('div.VwiC3b, span.aCOpRe').first().text().trim()

            results.push({ title, url: finalUrl, snippet })
        })

        // Fallback selector for some layouts
        if (results.length === 0) {
            $('div.yuRUbf > a').each((i, a) => {
                const title = $(a).find('h3').text().trim()
                let rawHref = $(a).attr('href')
                if (!title || !rawHref) return
                let finalUrl = rawHref
                try {
                    if (rawHref.startsWith('/url?')) {
                        const parsed = new URL('https://www.google.com' + rawHref)
                        const q = parsed.searchParams.get('q')
                        if (q) finalUrl = q
                    }
                } catch(_) {}
                const container = $(a).closest('.g')
                const snippet = container.find('div.VwiC3b, span.aCOpRe').first().text().trim()
                results.push({ title, url: finalUrl, snippet })
            })
        }

        // Last-resort fallback
        if (results.length === 0) {
            $('a:has(h3)').each((i, a) => {
                const title = $(a).find('h3').first().text().trim()
                let rawHref = $(a).attr('href')
                if (!title || !rawHref) return
                let finalUrl = rawHref
                try {
                    if (rawHref.startsWith('/url?')) {
                        const parsed = new URL('https://www.google.com' + rawHref)
                        const q = parsed.searchParams.get('q')
                        if (q) finalUrl = q
                    }
                } catch(_) {}
                results.push({ title, url: finalUrl })
            })
        }

        return res.status(200).json({ keyword, results })
    } catch (error) {
        const status = error.response?.status || 500
        console.error("Scraping Error:", error.message || error)
        if (status === 429 || status === 503) {
            return res.status(status).json({ message: "Google is rate-limiting. Try again later or use a SERP API." })
        }
        res.status(status).json({ message: "Failed to scrape Google results" });

    }
}
module.exports={scrapeGoogle}