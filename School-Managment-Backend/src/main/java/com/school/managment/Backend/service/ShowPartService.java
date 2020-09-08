package com.school.managment.Backend.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.model.photoshow.Document;
import com.school.managment.Backend.model.photoshow.ImageShow;
import com.school.managment.Backend.model.photoshow.ImageShowShowPart;
import com.school.managment.Backend.model.photoshow.ShowPart;
//import com.school.managment.Backend.model.photoshow.SubstitutionShow;
import com.school.managment.Backend.repository.ImageShowRepository;
import com.school.managment.Backend.repository.ImageShowShowPartRepository;
import com.school.managment.Backend.repository.ShowPartRepository;
//import com.school.managment.Backend.repository.SubstitutionShowRepository;

@Service
public class ShowPartService {

//	@Autowired
//	private SubstitutionShowRepository substitutionShowRepository;

	@Autowired
	private ShowPartRepository showPartRepository;

	@Autowired
	private ImageShowShowPartRepository imageShowShowPartRepository;

	@Autowired
	private ImageShowRepository imageShowRepository;

	@Autowired
	private DBFileStorageService dbFileStorageService;

	@Autowired
	private PDFConverterService pdfConverterService;

//	public SubstitutionShow saveSubstitutionShow(MultipartFile file, String showName, Date date) throws IOException {
//		List<ShowPart> imageParts = saveShowParts(file);
//		SubstitutionShow substitutionShow = new SubstitutionShow();
//		substitutionShow.setName(showName);
//		substitutionShow.setArea(Area.SUBSTITUTION);
//		substitutionShow.setDate(date);
//
//		substitutionShow = substitutionShowRepository.save(substitutionShow);
//		for (int i = 1; i <= imageParts.size(); i++) {
//			ShowPart showPart = imageParts.get(i - 1);
//			ImageShowShowPart imageShowPart = showPart.addImageShow(substitutionShow);
//			imageShowPart.setPosition(i);
//			imageShowShowPartRepository.save(imageShowPart);
//			showPartRepository.save(showPart);
//		}
//		substitutionShowRepository.save(substitutionShow);
//		return substitutionShow;
//	}

	public ImageShow saveImageShow(MultipartFile file, String showName, Area area) throws IOException {
		List<ShowPart> imageParts = saveShowParts(file);
		ImageShow imageShow = new ImageShow();
		imageShow.setName(showName);
		imageShow.setArea(area);
		
		imageShow = imageShowRepository.save(imageShow);
		for (int i = 1; i <= imageParts.size(); i++) {
			ShowPart showPart = imageParts.get(i - 1);
			ImageShowShowPart imageShowPart = showPart.addImageShow(imageShow);
			imageShowPart.setPosition(i);
			imageShowShowPartRepository.save(imageShowPart);
			showPartRepository.save(showPart);
		}
		imageShowRepository.save(imageShow);
		return imageShow;
	}

	public List<ShowPart> saveShowParts(MultipartFile file) throws IOException {
		Document document = dbFileStorageService.storeFile(file);
		ArrayList<ShowPart> showParts = new ArrayList<ShowPart>(pdfConverterService.convertPDFToPng(document));
		showPartRepository.saveAll(showParts);
		return showParts;
	}

	public Optional<List<ShowPart>> getCurrentSubstitutionShowParts() {

		return null;
	}
}
