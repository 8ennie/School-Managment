package com.school.managment.Backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/")
public class HomeController {
	
	@GetMapping({"/", "/photoshow/**", "/auth/**"})
    public String home(Model model) {
           return "forward:/index.html";
    }
}
