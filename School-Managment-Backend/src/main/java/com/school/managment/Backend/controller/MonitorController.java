//package com.school.managment.Backend.controller;
//
//import javax.annotation.Resources;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.school.managment.Backend.repository.MonitorRepository;
//
//@RestController
//@RequestMapping(value = "/monitor", produces = "application/hal+json")
//public class MonitorController {
//	
//	final MonitorRepository monitorRepository;
//	
//	public MonitorController(final MonitorRepository monitorRepository) {
//		this.monitorRepository = monitorRepository;
//	}
//	
//	 @GetMapping
//	  public ResponseEntity<Resources<MonitorResource>> all() {
//	    // GET all
//	  }
//
//	  @GetMapping("/{id}")
//	  public ResponseEntity<MonitorResource> get(@PathVariable final long id) {
//	    // GET
//	  }
//
//	  @PostMapping
//	  public ResponseEntity<MonitorResource> post(@RequestBody final Person personFromRequest) {
//	    // POST
//	  }
//
//	  @PutMapping("/{id}")
//	  public ResponseEntity<MonitorResource> put(
//	      @PathVariable("id") final long id, @RequestBody Person personFromRequest) {
//	    // PUT
//	  }
//
//	  @DeleteMapping("/{id}")
//	  public ResponseEntity<?> delete(@PathVariable("id") final long id) {
//	    // DELETE
//	  }
//	
//}
