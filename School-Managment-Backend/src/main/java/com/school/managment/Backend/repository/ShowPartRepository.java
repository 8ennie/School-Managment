package com.school.managment.Backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.school.managment.Backend.model.photoshow.Document;
import com.school.managment.Backend.model.photoshow.ShowPart;
import com.school.managment.Backend.model.photoshow.help.projection.ShowPartProjection;

@CrossOrigin(origins = "*", maxAge = 3600)
@RepositoryRestResource(excerptProjection = ShowPartProjection.class)
public interface ShowPartRepository extends JpaRepository<ShowPart, Long>{
	//Optional<ShowPart> findByImageShow(ImageShowShowPart imageShowShowPart);
	
	
	List<ShowPart> findByParentDocument(Document parentDocument);
}
