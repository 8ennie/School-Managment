package com.school.managment.Backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.school.managment.Backend.model.adminestration.User;
import com.school.managment.Backend.model.photoshow.Monitor;
import com.school.managment.Backend.model.photoshow.help.projection.MonitorProjection;



@Repository
@CrossOrigin(origins = "*", maxAge = 3600)
@RepositoryRestResource(excerptProjection = MonitorProjection.class)
public interface MonitorRepository extends JpaRepository<Monitor, Long> {

	Optional<Monitor> findByUser(User user);
	
}