package com.school.managment.Backend.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.model.photoshow.Document;
import com.school.managment.Backend.model.photoshow.ImageShow;
import com.school.managment.Backend.model.photoshow.ImageShowShowPart;
import com.school.managment.Backend.model.photoshow.ShowPart;
import com.school.managment.Backend.payload.request.ImageShowPart;
import com.school.managment.Backend.repository.ImageShowRepository;
import com.school.managment.Backend.repository.ImageShowShowPartRepository;
import com.school.managment.Backend.repository.ShowPartRepository;

@Service
public class ShowPartService {

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

	public ImageShow saveImageShow(MultipartFile file, String showName, Area area) throws IOException {
		List<ShowPart> imageParts = saveShowParts(file, area);
		ImageShow imageShow = new ImageShow();
		
		imageShow.setName(showName);
		imageShow.setArea(area);

		imageShow = imageShowRepository.save(imageShow);
		for (int i = 1; i <= imageParts.size(); i++) {
			ShowPart showPart = imageParts.get(i - 1);
			ImageShowShowPart imageShowPart = showPart.addImageShow(imageShow);
			imageShowPart.setPosition(i);
			imageShowShowPartRepository.save(imageShowPart);
			System.out.println("Saved ImageShowShowPart number: " + imageShowPart.getPosition());
			showPartRepository.save(showPart);
		}
		ImageShow savedImageShow =  imageShowRepository.save(imageShow);
		System.out.println("Saved Image Show!");
		return savedImageShow;
	}

	public List<ShowPart> saveShowParts(MultipartFile file, Area area) throws IOException {
		Document document = dbFileStorageService.storeFile(file, area);
		ArrayList<ShowPart> showParts = new ArrayList<ShowPart>(pdfConverterService.convertPDFToPng(document));
		List<ShowPart> savedShowParts = showPartRepository.saveAll(showParts);
		System.out.println("Successfully saved the ImageShowParts!");
		//System.out.println(savedShowParts);
		return savedShowParts;
	}

	public ImageShow saveShowParts(List<ImageShowPart> imageShowParts, Long imageShowId) {
		ImageShow imageShow = imageShowRepository.findById(imageShowId).get();
		for (int i = 1; i <= imageShowParts.size(); i++) {
			ImageShowPart imageShowPart = imageShowParts.get(i - 1);
			ShowPart showPart = showPartRepository.findById(imageShowPart.getShowPartId()).orElse(null);
			if (showPart != null && imageShow != null) {
				createImageShowShowPart(imageShow, i, imageShowPart, showPart);
			}
		}
		return imageShowRepository.save(imageShow);
	}

	public ImageShow updateShowParts(List<ImageShowPart> imageShowParts, Long imageShowId) {
		ImageShow imageShow = imageShowRepository.findById(imageShowId).get();
		imageShow.getShowParts().clear();

		List<Long> imageShowShowPartIds = imageShowShowPartRepository.findByImageShow(imageShow).stream().map(showPart -> showPart.getId())
				.collect(Collectors.toList());
		List<Long> currentImageShowShowPartIds = imageShowParts.stream().map(showPart -> showPart.getImageShowShowPartId())
				.collect(Collectors.toList());
		imageShowShowPartIds.removeAll(currentImageShowShowPartIds);
		for (Long id : imageShowShowPartIds) {
			imageShowShowPartRepository.deleteById(id);
		}
		
		for (int i = 1; i <= imageShowParts.size(); i++) {
			ImageShowPart imageShowPart = imageShowParts.get(i - 1);
			ShowPart showPart = showPartRepository.findById(imageShowPart.getShowPartId()).orElse(null);
			if (showPart != null && imageShow != null) {
				if (imageShowPart.getImageShowShowPartId() == null) {
					createImageShowShowPart(imageShow, i, imageShowPart, showPart);
				} else {

					ImageShowShowPart imageShowShowPart = imageShowShowPartRepository
							.findById(imageShowPart.getImageShowShowPartId()).orElse(null);
					if (imageShowShowPart == null) {
						createImageShowShowPart(imageShow, i, imageShowPart, showPart);
					} else {
						imageShowShowPart.setPosition(i);
						imageShowShowPart.setActive(imageShowPart.isActive());
						imageShowShowPart.setDisplayTime(imageShowPart.getDisplayTime());
						imageShowShowPartRepository.save(imageShowShowPart);
					}
				}

			}
		}
		return imageShowRepository.save(imageShow);
	}

	private void createImageShowShowPart(ImageShow imageShow, int i, ImageShowPart imageShowPart, ShowPart showPart) {
		ImageShowShowPart imageShowShowPart = showPart.addImageShow(imageShow);
		imageShowShowPart.setPosition(i);
		imageShowShowPart.setActive(imageShowPart.isActive());
		imageShowShowPart.setDisplayTime(imageShowPart.getDisplayTime());
		imageShowShowPartRepository.save(imageShowShowPart);
		showPartRepository.save(showPart);
	}

}
