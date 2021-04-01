package com.school.managment.Backend.controller;

import java.io.IOException;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.model.photoshow.ImageShow;
import com.school.managment.Backend.model.photoshow.ShowPart;
import com.school.managment.Backend.payload.request.ImageShowPartRequest;
import com.school.managment.Backend.payload.response.MessageResponse;
import com.school.managment.Backend.service.ImageShowService;
import com.school.managment.Backend.service.ShowPartService;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;;

@RestController
@RequestMapping("/api")
public class ImageShowController {

	@Autowired
	private ShowPartService showPartService;

	@Autowired
	private ImageShowService imageShowService;

	@PostMapping(value = "/upload/show", produces = MediaTypes.HAL_JSON_VALUE)
	public HttpEntity<EntityModel<ImageShow>> uploadImageShow(@RequestParam("file") MultipartFile file,
			@RequestParam("showName") String showName, Area area) throws IOException {
		ImageShow imageShow = showPartService.saveImageShow(file, showName, area);
		EntityModel<ImageShow> imagesShowModel = new EntityModel<ImageShow>(imageShow);
		imagesShowModel
				.add(linkTo(methodOn(ImageShowController.class).uploadImageShow(null, showName, area)).withSelfRel());
		System.out.println("Sending back Image Show!");
		return new ResponseEntity<>(imagesShowModel, HttpStatus.OK);
	}

	@PostMapping("/upload/document")
	public List<ShowPart> uploadDocument(@RequestParam("file") MultipartFile file, Area area) {
		List<ShowPart> showParts;
		try {
			showParts = showPartService.saveShowParts(file, area);
			System.out.println("sending image show Parts Back!");
			return showParts;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("PROBLEM Uploading the Document!");
			e.printStackTrace();
			return null;
		}

	}

	@PostMapping("/imageShows/showParts")
	public HttpEntity<EntityModel<ImageShow>> saveImageShow(
			@Valid @RequestBody ImageShowPartRequest imageShowPartRequest) {
		ImageShow imageShow = null;
		if (!imageShowPartRequest.isUpdate()) {
			imageShow = showPartService.saveShowParts(imageShowPartRequest.getImageShowParts(),
					imageShowPartRequest.getImageShowId());
		} else {
			System.out.println(imageShowPartRequest);
			imageShow = showPartService.updateShowParts(imageShowPartRequest.getImageShowParts(),
					imageShowPartRequest.getImageShowId());
		}
		EntityModel<ImageShow> imagesShowModel = new EntityModel<ImageShow>(imageShow);
		imagesShowModel
				.add(linkTo(methodOn(ImageShowController.class).saveImageShow(imageShowPartRequest)).withSelfRel());
		return new ResponseEntity<>(imagesShowModel, HttpStatus.OK);
	}

	@DeleteMapping("/imageShows/delete/{imageShowId}")
	public ResponseEntity<?> deleteImageShow(@PathVariable("imageShowId") Long imageShowId) {
		if (!imageShowService.deleteImageShow(imageShowId)) {
			return ResponseEntity.ok(new MessageResponse("IMAGE_SHOW_IN_USE"));
		} else {
			return ResponseEntity.ok(new MessageResponse("SUCCSESS"));
		}
	}

}