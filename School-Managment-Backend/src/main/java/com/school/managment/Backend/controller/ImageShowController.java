package com.school.managment.Backend.controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.trace.http.HttpTrace.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.school.managment.Backend.exception.CantDeleteException;
import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.model.photoshow.ImageShow;
import com.school.managment.Backend.model.photoshow.ShowPart;
import com.school.managment.Backend.payload.request.ImageShowPartRequest;
import com.school.managment.Backend.payload.response.MessageResponse;
import com.school.managment.Backend.service.ImageShowService;
//import com.school.managment.Backend.model.photoshow.SubstitutionShow;
import com.school.managment.Backend.service.ShowPartService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api")
public class ImageShowController {

	@Autowired
	private ShowPartService showPartService;
	
	@Autowired
	private ImageShowService imageShowService;

	@PostMapping("/upload/show")
	public ImageShow uploadImageShow(@RequestParam("file") MultipartFile file,
			@RequestParam("showName") String showName, Area area) throws IOException {
		ImageShow imageShow = showPartService.saveImageShow(file, showName, area);
		return imageShow;
	}
	
	@PostMapping("/upload/document")
	public List<ShowPart> uploadDocument(@RequestParam("file") MultipartFile file, Area area) throws IOException {
		List<ShowPart> showParts = showPartService.saveShowParts(file, area);
		return showParts;
	}

	@GetMapping("/currentSubstitutionShowParts")
	public Optional<List<ShowPart>> getCurrentSubstitutionShowParts() {
		return showPartService.getCurrentSubstitutionShowParts();
	}
	
	
	@PostMapping("/imageShows/showParts")
	public ImageShow saveImageShow(@Valid @RequestBody ImageShowPartRequest imageShowPartRequest) {
		if(!imageShowPartRequest.isUpdate()) {
			return showPartService.saveShowParts(imageShowPartRequest.getImageShowParts(), imageShowPartRequest.getImageShowId());
		} else {
			System.out.println(imageShowPartRequest);
			return showPartService.updateShowParts(imageShowPartRequest.getImageShowParts(), imageShowPartRequest.getImageShowId());
		}
	}
	
	@DeleteMapping("/imageShows/delete/{imageShowid}")
	public ResponseEntity deleteImageShow(@PathVariable("imageShowid") Long imageShowid){
		if(!imageShowService.deleteImageShow(imageShowid)) {
			return ResponseEntity.ok(new MessageResponse("IMAGE_SHOW_IN_USE"));
		} else {
			return ResponseEntity.ok(new MessageResponse("SUCCSESS"));
		}
	}


}