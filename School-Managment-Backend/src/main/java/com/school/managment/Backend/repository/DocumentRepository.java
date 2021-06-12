package com.school.managment.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.model.photoshow.Document;
import com.school.managment.Backend.model.photoshow.help.projection.DocumentNameProjection;

@RepositoryRestResource(excerptProjection = DocumentNameProjection.class)
public interface DocumentRepository extends JpaRepository<Document, Long>{

	public List<Document> findByArea(Area area);
	
	public List<Document> findByFileNameContains(String fileName);
	
	public List<Document> findByAreaInAndFileNameContains(List<Area> areaList, String fileName);
}
