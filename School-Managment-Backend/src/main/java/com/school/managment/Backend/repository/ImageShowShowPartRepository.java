package com.school.managment.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.managment.Backend.model.photoshow.ImageShow;
import com.school.managment.Backend.model.photoshow.ImageShowShowPart;

@RepositoryRestResource()
public interface ImageShowShowPartRepository extends JpaRepository<ImageShowShowPart, Long>{

	List<ImageShowShowPart> findByImageShow(ImageShow imageShow);
	
}
