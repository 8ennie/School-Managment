package com.school.managment.Backend.controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.model.photoshow.ImageShow;
import com.school.managment.Backend.model.photoshow.ShowPart;
//import com.school.managment.Backend.model.photoshow.SubstitutionShow;
import com.school.managment.Backend.service.ShowPartService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api")
public class ImageShowController {

	@Autowired
	private ShowPartService showPartService;

//	@PostMapping("/upload/substitution")
//	public SubstitutionShow uplodSubstitution(@RequestParam("file") MultipartFile file,
//			@RequestParam("showName") String showName, @RequestParam("date") Date date) throws IOException {
//		SubstitutionShow substitutionShow = showPartService.saveSubstitutionShow(file, showName, date);
//		return substitutionShow;
//	}

	@PostMapping("/upload/show")
	public ImageShow uploadImageShow(@RequestParam("file") MultipartFile file,
			@RequestParam("showName") String showName, Area area) throws IOException {
		ImageShow imageShow = showPartService.saveImageShow(file, showName, area);
		return imageShow;
	}
	
	@PostMapping("/upload/document")
	public List<ShowPart> uploadDocument(@RequestParam("file") MultipartFile file) throws IOException {
		List<ShowPart> showParts = showPartService.saveShowParts(file);
		return showParts;
	}

	@GetMapping("/currentSubstitutionShowParts")
	public Optional<List<ShowPart>> getCurrentSubstitutionShowParts() {
		return showPartService.getCurrentSubstitutionShowParts();
	}
	
	


}