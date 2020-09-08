package com.school.managment.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.school.managment.Backend.model.photoshow.Document;
import com.school.managment.Backend.model.photoshow.help.projection.DocumentNameProjection;


@CrossOrigin(origins = "*", maxAge = 3600)
@RepositoryRestResource(excerptProjection = DocumentNameProjection.class)
public interface DocumentRepository extends JpaRepository<Document, Long>{

}
