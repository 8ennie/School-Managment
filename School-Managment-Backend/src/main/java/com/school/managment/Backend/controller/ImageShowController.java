package com.school.managment.Backend.controller;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.school.managment.Backend.model.photoshow.AdvertismentShow;
import com.school.managment.Backend.model.photoshow.ShowPart;
import com.school.managment.Backend.model.photoshow.SubstitutionShow;
import com.school.managment.Backend.payload.response.UploadFileResponse;
import com.school.managment.Backend.service.DBFileStorageService;
import com.school.managment.Backend.service.ImageShowService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api")
public class ImageShowController {

	@Autowired
	private DBFileStorageService dbFileStorageService;

	@Autowired
	private ImageShowService imageShowService;
	

	@PostMapping("/upload/substitution")
	public SubstitutionShow uplodSubstitution(@RequestParam("file") MultipartFile file,
			@RequestParam("showName") String showName, @RequestParam("date") Date date) {
		SubstitutionShow substitutionShow = imageShowService.saveSubstitutionShow(file, showName, date);
		return substitutionShow;
	}
	
	
	
	@PostMapping("/upload/advertisment")
	public AdvertismentShow uploadAdvertisment(@RequestParam("file") MultipartFile file,
			@RequestParam("showName") String showName) {

		AdvertismentShow advertismentShow = imageShowService.saveAdvertisment(file, showName);
		
		return advertismentShow;
	}
	
	
	@GetMapping("/currentSubstitutionShowParts")
	public Optional<List<ShowPart>> getCurrentSubstitutionShowParts() {
		return imageShowService.getCurrentSubstitutionShowParts();
	}
	

//	@GetMapping("/downloadImageShow/{fileId}")
//	public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
//		// Load file from database
//		Document dbFile = dbFileStorageService.getFile(fileId);
//
//		return ResponseEntity.ok().contentType(MediaType.parseMediaType(dbFile.getFileType()))
//				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + dbFile.getFileName() + "\"")
//				.body(new ByteArrayResource(dbFile.getData()));
//	}

}