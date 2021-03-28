package com.school.managment.Backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.SpringVersion;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories("com.school.managment.Backend.repository")
public class BackendApplication {

	public static void main(String[] args) {
		System.out.println(SpringVersion.getVersion());
		System.out.println(SpringBootVersion.getVersion());
		SpringApplication.run(BackendApplication.class, args);
	}

}
