import { PDFDocument } from 'pdf-lib';

const contarPaginasPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ mensaje: 'No se recibió ningún archivo' });
        }

        try {
            const pdfDoc = await PDFDocument.load(req.file.buffer);
            const numPaginas = pdfDoc.getPageCount();
            res.json({ numPaginas });
        } catch (pdfError) {
            console.error('Error al procesar PDF:', pdfError);
            res.status(400).json({ 
                mensaje: 'Error al procesar el archivo PDF. Asegúrate de que sea un PDF válido.',
                error: pdfError.message 
            });
        }
    } catch (error) {
        console.error('Error al contar páginas del PDF:', error);
        res.status(500).json({ 
            mensaje: 'Error al procesar el archivo PDF',
            error: error.message 
        });
    }
};

export {
    contarPaginasPDF
};