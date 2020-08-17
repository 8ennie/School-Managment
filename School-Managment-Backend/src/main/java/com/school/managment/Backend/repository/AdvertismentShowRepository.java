package com.school.managment.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.school.managment.Backend.model.photoshow.AdvertismentShow;
import com.school.managment.Backend.model.photoshow.SubstitutionShow;
import com.school.managment.Backend.model.photoshow.help.projection.ImageShowProjection;

@CrossOrigin(origins = "*", maxAge = 3600)
@RepositoryRestResource(excerptProjection = ImageShowProjection.class)
public interface AdvertismentShowRepository extends JpaRepository<AdvertismentShow, Long>{

}
