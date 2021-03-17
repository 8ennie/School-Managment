package com.school.managment.Backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.school.managment.Backend.model.photoshow.Area;

@RestController
@RequestMapping("/api/values")
public class ValueController {

	@GetMapping("/areas")
	public Area[] getAllAreas(){
		return Area.values();
	}
	
}
