package com.school.managment.Backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.model.photoshow.ImageShow;
import com.school.managment.Backend.model.photoshow.help.projection.ImageShowProjection;

@RepositoryRestResource(excerptProjection = ImageShowProjection.class)
public interface ImageShowRepository extends JpaRepository<ImageShow, Long>{

	public List<ImageShow> findByArea(Area area);
	
	public List<ImageShow> findByNameContains(String name);
	
	public List<ImageShow> findByAreaAndNameContains(Area area, String name);
	
}
