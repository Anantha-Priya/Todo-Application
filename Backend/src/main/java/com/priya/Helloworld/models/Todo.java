package com.priya.Helloworld.models;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Data  //it's used to write getter setter for each of the fields in the table(this Data is form lombok)
public class Todo {
    @Id
    @GeneratedValue
    long Id;
    @NotNull
    @NotBlank
    @Schema(name="title",example="Complete Spring boot")
    String title;
    Boolean isCompleted;
    String ownerEmail;
}
