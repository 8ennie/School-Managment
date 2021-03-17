package com.school.managment.Backend.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.managment.Backend.model.adminestration.Role;
import com.school.managment.Backend.model.adminestration.help.RoleProjection;

@RepositoryRestResource(excerptProjection = RoleProjection.class)
public interface RoleRepository extends JpaRepository<Role, Long> {
	Optional<Role> findByName(String name);
}