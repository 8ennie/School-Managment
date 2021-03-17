package com.school.managment.Backend.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.managment.Backend.model.adminestration.EPrivilege;
import com.school.managment.Backend.model.adminestration.Privilege;


@RepositoryRestResource()
public interface PrivilegeRepository extends JpaRepository<Privilege, Long> {
	Optional<Privilege> findByName(EPrivilege name);
}