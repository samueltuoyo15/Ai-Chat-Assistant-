import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors'; // Import CORS

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

const genAI = new GoogleGenerativeAI('AIzaSyB6SD8rYS-VGRJlQHepvK2iFo1ULrn82GE');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.use(express.json());

app.post('/generate-content', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
