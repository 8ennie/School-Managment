package com.school.managment.Backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class HomeController {
	
	@GetMapping({"/", "/photoshow/**", "/auth/**", "/imageshow/**"})
    public String home(Model model) {
           return "forward:/index.html";
    }
}
