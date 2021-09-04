package com.school.managment.Backend.model.photoshow;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicTransportShowPart {

    @Id
    private Long id;

    @Column
    private Boolean active;

    @Column
    private LocalTime startTime;

    @Column
    private LocalTime endTime;

    @OneToOne
    private Monitor monitor;
}
