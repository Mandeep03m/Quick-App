const pdfParse=require('pdf-parse')
const fs=require('fs')
const axios=require('axios')

const summarizePDF=async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({message: "No PDF file uploaded"})
        }

        if(!process.env.HF_TOKEN){
            return res.status(500).json({ message: "Missing HF_TOKEN in environment" })
        }

        const dataBuffer=fs.readFileSync(req.file.path)
        const pdfData=await pdfParse(dataBuffer)
        const text=(pdfData.text || '').slice(0,2000)

        if(!text || text.trim().length === 0){
            return res.status(400).json({ message: "No extractable text found in PDF" })
        }

        const response=await axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            { inputs: text },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        )

        const summary=response.data?.[0]?.summary_text||"No Summary"
        res.status(200).json({
        message: "PDF summarized successfully",
        summary,
    });
    } catch (error) {
        const status = error.response?.status || 500
        const details = error.response?.data || error.message
        console.error('PDF summarize error:', details)
        res.status(status).json({
            message: "Error summarizing PDF",
            error: typeof details === 'string' ? details : (details.error || details.message || 'Unknown error'),
        });
    }
}
module.exports={summarizePDF}