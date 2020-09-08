//package com.school.managment.Backend.repository;
//
//import java.util.Date;
//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;
//import org.springframework.web.bind.annotation.CrossOrigin;
//
//import com.school.managment.Backend.model.photoshow.SubstitutionShow;
//import com.school.managment.Backend.model.photoshow.help.projection.SubstitutionShowProjection;
//
//@CrossOrigin(origins = "*", maxAge = 3600)
//@RepositoryRestResource(excerptProjection = SubstitutionShowProjection.class)
//public interface SubstitutionShowRepository extends JpaRepository<SubstitutionShow, Long>{
//
//	Optional<SubstitutionShow> findByDate(Date date);
//	
//}
