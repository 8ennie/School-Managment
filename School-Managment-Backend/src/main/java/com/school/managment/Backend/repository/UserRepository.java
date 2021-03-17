package com.school.managment.Backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.school.managment.Backend.model.adminestration.User;
import com.school.managment.Backend.model.adminestration.help.UserProjection;

@RepositoryRestResource(excerptProjection = UserProjection.class)
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);

	Boolean existsByUsername(String username);

	Boolean existsByEmail(String email);
}
