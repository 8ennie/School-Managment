package com.school.managment.Backend.model.photoshow;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalTime;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicTransportShowPart {

    @Column
    private Boolean showPublicTransport;

    @Column
    private LocalTime startTime;

    @Column
    private LocalTime endTime;
}
