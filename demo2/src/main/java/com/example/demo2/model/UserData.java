package com.example.demo2.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_data")
public class UserData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uid;

    private String name;
    private String email;
    private String password;
    private String roles;
}
