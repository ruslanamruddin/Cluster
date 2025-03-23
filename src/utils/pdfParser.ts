import * as pdfjs from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Set the worker source to use the official Mozilla CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

/**
 * Extract text content from a PDF file
 * @param pdfFile The PDF file to parse
 * @returns A promise that resolves to the extracted text
 */
export async function extractTextFromPDF(pdfFile: File): Promise<string> {
  try {
    console.log('Starting PDF extraction for file:', pdfFile.name);
    console.log('Using PDF.js version:', pdfjs.version);
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    
    // Load PDF document
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`
    }).promise;
    
    console.log(`PDF loaded successfully. Number of pages: ${pdf.numPages}`);
    
    // Extract text from each page
    let extractedText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: TextItem) => item.str)
        .join(' ');
      
      extractedText += pageText + '\n\n';
      console.log(`Processed page ${i}/${pdf.numPages}`);
    }
    
    console.log('PDF extraction completed. Text length:', extractedText.length);
    
    // Check if we got actual content
    if (!extractedText.trim()) {
      throw new Error('No text content found in PDF');
    }
    
    return extractedText;
    
  } catch (error) {
    console.error('PDF extraction failed:', error);
    return "I couldn't extract text from your PDF. Please manually enter your skills below.";
  }
}
