package com.school.managment.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.school.managment.Backend.model.photoshow.ShowPart;

@CrossOrigin(origins = "*", maxAge = 3600)
public interface ShowPartRepository extends JpaRepository<ShowPart, Long>{

}
