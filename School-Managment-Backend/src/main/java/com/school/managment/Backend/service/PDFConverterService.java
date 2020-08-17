package com.school.managment.Backend.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.school.managment.Backend.model.photoshow.Document;
import com.school.managment.Backend.model.photoshow.ImageShow;
import com.school.managment.Backend.model.photoshow.ShowPart;
import com.school.managment.Backend.repository.ShowPartRepository;

@Service
public class PDFConverterService {

	@Autowired
	private ShowPartRepository showPartRepository;

	public List<ShowPart> convertPDFToPng(Document doc) throws IOException {
		final PDDocument document = PDDocument.load(doc.getData());
		PDFRenderer pdfRenderer = new PDFRenderer(document);
		List<ShowPart> showParts = new ArrayList<ShowPart>();
		for (int page = 0; page < document.getNumberOfPages(); ++page) {
			BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 300, ImageType.RGB);
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ImageIO.write(bim, "png", baos);
			baos.flush();
			byte[] imageInByte = baos.toByteArray();
			baos.close();
			ShowPart showPart = new ShowPart();
			showPart.setImage(imageInByte);
			showPart.setOrigin(doc.getFileName().toString() + "( " + page + " )");
			showParts.add(showPartRepository.save(showPart));
		}
		document.close();
		return showParts;

	}
}
