package com.school.managment.Backend.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class LocalCorsConfiguration implements WebMvcConfigurer, RepositoryRestConfigurer {

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		config.getCorsRegistry().addMapping("/**").allowedHeaders("*").allowedMethods("*").allowedOrigins("*");
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedHeaders("*").allowedMethods("*").allowedOrigins("*");
	}

}
