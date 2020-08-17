package com.school.managment.Backend.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.school.managment.Backend.model.photoshow.AdvertismentShow;
import com.school.managment.Backend.model.photoshow.ImageShow;
import com.school.managment.Backend.model.photoshow.ShowPart;
import com.school.managment.Backend.model.photoshow.SubstitutionShow;
import com.school.managment.Backend.model.photoshow.help.ShowType;
import com.school.managment.Backend.repository.AdvertismentShowRepository;
import com.school.managment.Backend.repository.ShowPartRepository;
import com.school.managment.Backend.repository.SubstitutionShowRepository;

@Service
public class ImageShowService {

	@Autowired
	private AdvertismentShowRepository advertismentShowRepository;

	@Autowired
	private SubstitutionShowRepository substitutionShowRepository;
	
	@Autowired
	private ShowPartRepository showPartRepository;

	@Autowired
	private DBFileStorageService dbFileStorageService;

	public SubstitutionShow saveSubstitutionShow(MultipartFile file, String showName, Date date) {
		// System.out.println("The Name of the Show is: " + showName);
		System.out.println("The Name of the Show is: " + showName);
		System.out.println("Uploading a Substitution");

		SubstitutionShow substitutionShow = new SubstitutionShow();
		substitutionShow.setName(showName);
		substitutionShow.setShowType(ShowType.SUBSTITUTION);
		substitutionShow.setDate(date);
		ImageShow imageShow = dbFileStorageService.storeFile(file);
		substitutionShow.setDocument(imageShow.getDocument());
		substitutionShow.setShowParts(imageShow.getShowParts());

		substitutionShowRepository.save(substitutionShow);

		for (ShowPart showPart : substitutionShow.getShowParts()) {
			showPart.setShow(substitutionShow);
			showPartRepository.save(showPart);
		}

		return substitutionShow;
	}

	public AdvertismentShow saveAdvertisment(MultipartFile file, String showName) {
		// System.out.println("The Name of the Show is: " + showName);
		System.out.println("The Name of the Show is: " + showName);
		System.out.println("Uploading a Advertisment");

		AdvertismentShow advertismentShow = new AdvertismentShow();
		advertismentShow.setName(showName);
		advertismentShow.setShowType(ShowType.ADVERTISEMENT);
		ImageShow imageShow = dbFileStorageService.storeFile(file);
		advertismentShow.setDocument(imageShow.getDocument());
		advertismentShow.setShowParts(imageShow.getShowParts());
		advertismentShowRepository.save(advertismentShow);
		
		for (ShowPart showPart : advertismentShow.getShowParts()) {
			showPart.setShow(advertismentShow);
			showPartRepository.save(showPart);
		}
		return advertismentShow;
	}
	
	public Optional<List<ShowPart>> getCurrentSubstitutionShowParts() {
		Optional<SubstitutionShow> subShow =  substitutionShowRepository.findByDate(new Date());
		
		if(subShow.isPresent()) {
			return Optional.of(substitutionShowRepository.findByDate(new Date()).get().getShowParts());
		}
		
		return null;
	}
}
