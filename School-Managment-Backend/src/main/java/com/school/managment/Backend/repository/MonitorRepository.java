package com.school.managment.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.model.photoshow.Monitor;
import com.school.managment.Backend.model.photoshow.help.projection.MonitorProjection;



@Repository
@CrossOrigin(origins = "*")
@RepositoryRestResource(excerptProjection = MonitorProjection.class)
public interface MonitorRepository extends JpaRepository<Monitor, Long> {

//	Optional<Monitor> findByUser(User user);
	
	public List<Monitor> findByAreas(Area area);
	
	public List<Monitor> findByImageShowId(Long id);
	
}